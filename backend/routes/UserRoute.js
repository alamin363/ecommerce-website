const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  logout,
  forgetPassword,
  resetPassword,
  getUserDetails,
  updateUserPassword,
  updateUserProfile,
  getAllUser,
  getSingleUserByAdmin,
  updateUserRole,
  deleteUser,
} = require("../controllers/userController");
const { isAuthenticateUser, authorizeRoles } = require("../middleware/auth");
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/password/forgot").post(forgetPassword);
router.route("/password/reset/:token").put(resetPassword);
router.route("/logout").get(logout);
router.route("/me").get(isAuthenticateUser, getUserDetails);
router.route("/password/update").put(isAuthenticateUser, updateUserPassword);
router.route("/me/update").put(isAuthenticateUser, updateUserProfile);
router
  .route("/admin/user")
  .get(isAuthenticateUser, authorizeRoles("admin"), getAllUser);

router
  .route("/admin/user/:id")
  .get(isAuthenticateUser, authorizeRoles("admin"), getSingleUserByAdmin).put(isAuthenticateUser, authorizeRoles("admin"), updateUserRole).delete(isAuthenticateUser, authorizeRoles("admin"), deleteUser)
module.exports = router;
