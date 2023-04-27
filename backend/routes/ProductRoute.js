const express = require("express");
const {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getIdByProduct,
  createProductReview,
  getProductReviews,
  deleteReviews,
  deleteReview,
} = require("../controllers/productContollers");
const { isAuthenticateUser, authorizeRoles } = require("../middleware/auth");

const router = express.Router();
router.route("/product").get(getAllProducts);

router
  .route("/product/new")
  .post(isAuthenticateUser, authorizeRoles("admin"), createProduct);
// URL same thakle aivabe aksate update and delete method use kora jai;
router
  .route("/product/:id")
  .put(isAuthenticateUser, authorizeRoles("admin"), updateProduct)
  .delete(isAuthenticateUser, authorizeRoles("admin"), deleteProduct)
  .get(getIdByProduct);
// router.route("/product/:id").get(getIdByProduct);
router.route("/review").put(isAuthenticateUser, createProductReview);
router
  .route("/reviews")
  .get(getProductReviews)
  .delete(isAuthenticateUser, deleteReviews);
module.exports = router;
