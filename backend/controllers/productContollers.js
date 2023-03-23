const Product = require("../module/productModel");
const ErrorHandler = require("../utility/errorhandler");
const catchAsynceError = require("../middleware/catchAsynceError");
const ApiFeatures = require("../utility/apifeautures");

// only admin access the route
exports.createProduct = catchAsynceError(async (req, res, next) => {
  const product = await Product.create(req.body);

  res.status(200).json({
    success: true,
    product,
  });
});

// get all the product
exports.getAllProducts = catchAsynceError(async (req, res) => {
  const apiFeature = new ApiFeatures(Product.find(), req.query).search();
  // const product = await Product.find();
  const product = await apiFeature.search()

  res.status(200).json({
    success: true,
    product,
  });
});
// get product details
exports.getIdByProduct = catchAsynceError(async (req, res, next) => {
  let product = await Product.findById(req.params.id);
  if (!product) {
    next(
      new ErrorHandler(`product not found with this id${req.params.id}`, 404)
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
