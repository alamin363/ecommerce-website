const Product = require("../module/productModel");
const ErrorHandler = require("../utility/errorhandler");
const catchAsynceError = require("../middleware/catchAsynceError");
const ApiFeatures = require("../utility/apifeautures");

// only admin access the route
exports.createProduct = catchAsynceError(async (req, res, next) => {
  req.body.user = req.user.id;

  const product = await Product.create(req.body);

  res.status(200).json({
    success: true,
    product,
  });
});

// get all the product
exports.getAllProducts = catchAsynceError(async (req, res) => {
  const resultPerPage = 5;
  const productCount = await Product.countDocuments();
  const apiFeature = new ApiFeatures(Product.find(), req.query)
    .search()
    .filter()
    .pagination(resultPerPage);
  // const product = await Product.find();
  const product = await apiFeature.query;
  res.status(200).json({
    success: true,
    product,
    productCount,
  });
});
// get product details
exports.getIdByProduct = catchAsynceError(async (req, res, next) => {
  let product = await Product.findById(req.params.id);
  if (!product) {
    next(
      new ErrorHandler(`product not found with this id: ${req.params.id}`, 404)
    );
  }
  res.status(200).json({
    success: true,
    product,
  });
});

// updata the product
exports.updateProduct = catchAsynceError(async (req, res, next) => {
  let product = await Product.findById(req.params.id);
  if (!product) {
    next(
      new ErrorHandler(`product not found with this id${req.params.id}`, 404)
    );
  }
  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json({
    success: true,
    product,
  });
});

// delete Product
exports.deleteProduct = catchAsynceError(async (req, res, next) => {
  let product = await Product.findById(req.params.id);
  if (!product) {
    next(
      new ErrorHandler(`product not found with this id: ${req.params.id}`, 404)
    );
  }
  product = await Product.findByIdAndDelete(req.params.id);
  res.status(200).json({
    success: true,
    message: "product delete successfully",
  });
});

// create new review or update the review

exports.createProductReview = catchAsynceError(async (req, res, next) => {
  const { rating, comment, productId } = req.body;

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };
  const product = await Product.findById(productId);
  const isReviewed = product.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString()
  );
  if (isReviewed) {
    product.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user._id.toString())
        (rev.rating = rating), (rev.comment = comment);
    });
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }
  // avg rating
  let avg = 0;

  product.reviews.forEach((rev) => {
    avg += rev.rating;
  }) / product.reviews.length;
  product.ratings = avg / product.reviews.length;
  await product.save({ validateBeforeSave: false });
  res.status(200).json({
    success: true,
  });
});

// Get all reviews of products
exports.getProductReviews = catchAsynceError(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }
  res.status(200).json({ success: true, reviews: product.reviews });
});

// delete reviews

exports.deleteReviews = catchAsynceError(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  const reviews = product.reviews.filter(
   (rev) => rev._id.toString() !== req.query.id.toString()
  );
 
  let avg = 0;
  reviews.forEach((rev) => {
    avg += rev.rating;
  }) / product.reviews.length;
  const ratings = avg / product.reviews.length;
  const numOfReviews = reviews.length;
  await Product.findByIdAndUpdate(
    req.query.productId,
    {
      reviews,
      ratings,
      numOfReviews,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );
  res
    .status(200)
    .json({ success: true, message: "review deleted successfully" });
});