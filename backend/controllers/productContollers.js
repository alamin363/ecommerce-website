const Product = require("../module/productModel");

// omly admin access the route
exports.createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

// get all the product
exports.getAllProducts = async (req, res) => {
  try {
    const product = await Product.find();

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};
// updata the product
exports.updateProduct = async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404).json({
        success: false,
        message: "product is not found",
      });
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
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

// delete Product
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404).json({
        success: false,
        message: `product is not found by this id:${req.params.id}`,
      });
    }
    await product.remove();
    res.status(200).json({
      success: true,
      message: "product delete successfully",
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};
