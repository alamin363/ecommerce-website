const ErrorHandler = require("../utility/errorhandler");
const catchAsynceError = require("../middleware/catchAsynceError");
const Users = require("../module/userModel");
const sendToken = require("../utility/jwtToken");
const sendEmail = require("../utility/sendEmail");
const crypto = require("crypto");
// register a User

exports.registerUser = catchAsynceError(async (req, res, next) => {
  const { name, email, password } = req.body;
  const user = await Users.create({
    name,
    email,
    password,
    avatar: {
      public_id: "this is sample id",
      url: "profilePicture",
    },
  });
  sendToken(user, 201, res);
});
// Login User
exports.loginUser = catchAsynceError(async (req, res, next) => {
  const { email, name, password } = req.body;

  // checking if user has given password and email both
  if (!email || !password) {
    return next(new ErrorHandler("Please Enter Email & Password", 400));
  }
  const user = await Users.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }
  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }
  sendToken(user, 200, res);
});

// Logout user
exports.logout = catchAsynceError(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged Out",
  });
});

// Forgot password
exports.forgetPassword = catchAsynceError(async (req, res, next) => {
  const user = await Users.findOne({ email: req.body.email });
  if (!user) {
    return next(new ErrorHandler("User not Found", 404));
  }
  // Get ResetPassword Token
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  const resetpasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${resetToken}`;

  const message = `Your password reset token is :- /n/n ${resetpasswordUrl} /n/nlf you have not requested this email then please ignore it`;
  try {
    await sendEmail({
      email: user.email,
      subject: `TnT Market Password Recovery`,
      message,
    });
    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetpasswordToken = undefined;
    user.resetpasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    await next(new ErrorHandler(error.message, 500));
  }
});

exports.resetPassword = catchAsynceError(async (req, res, next) => {
  // create token hash
  const resetpasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const user = await Users.findOne({
    resetpasswordToken,
    resetpasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHandler(
        "Reset Password Token is Invalid or has been expired",
        400
      )
    );
  }
  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password does not password", 400));
  }
  user.password = req.body.password;
  user.resetpasswordExpire = undefined;
  user.resetpasswordToken = undefined;

  await user.save();

  sendToken(user, 200, res);
});

// getUser Details
exports.getUserDetails = catchAsynceError(async (req, res, next) => {
  const user = await Users.findById(req.user.id);
  res.status(200).json({
    success: true,
    user,
  });
});
// update User password
exports.updateUserPassword = catchAsynceError(async (req, res, next) => {
  const user = await Users.findById(req.user.id).select("+password");
  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Old password id incorrect", 401));
  }
  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password does not match", 401));
  }
  user.password = req.body.newPassword;
  await user.save();

  sendToken(user, 200, res);
});

// update user profile

exports.updateUserProfile = catchAsynceError(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
  };
  // we will add cloudinary later
  const user = await Users.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json({
    success: true,
    // data: user
  });
});

// get all the user
exports.getAllUser = catchAsynceError(async (req, res, next) => {
  const users = await Users.find();
  res.status(200).json({
    success: true,
    users,
  });
});
// get single user (admin)
exports.getSingleUserByAdmin = catchAsynceError(async (req, res, next) => {
  const user = await Users.findById(req.params.id);
  if (!user) {
    return next(
      new ErrorHandler(
        `user does not exist width this Id: ${req.params.id}`,
        400
      )
    );
  }
  res.status(200).json({
    success: true,
    user,
  });
});

// update user role --admin

exports.updateUserRole = catchAsynceError(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };
  // we will add cloudinary later
  const user = await Users.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json({
    success: true,
    // data: user
  });
});
// delete user --admin

exports.deleteUser = catchAsynceError(async (req, res, next) => {
  const user = await Users.findById(req.params.id);
  if (!user) {
    return next(ErrorHandler(`user not found by this id: ${req.params.id}`));
  }
  //  we will remove cloudera
  // await user.remove();
  // .remove function not working thats why remove this why
  const removeUser = await Users.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: "user remove successful",
  });
});
