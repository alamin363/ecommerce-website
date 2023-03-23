const express = require("express");
const {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getIdByProduct
} = require("../controllers/productContollers");

const router = express.Router();
router.route("/product").get(getAllProducts);
router.route("/product/new").post(createProduct);
// URL same thakle aivabe aksate update and delete method use kora jai;
router
  .route("/product/:id")
  .put(updateProduct)
  .delete(deleteProduct)
  .get(getIdByProduct);

module.exports = router;
