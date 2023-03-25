const express = require("express");
const {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getIdByProduct,
} = require("../controllers/productContollers");
const { isAuthenticateUser, authorizeRoles } = require("../middleware/auth");

const router = express.Router();
router.route("/product").get(getAllProducts);
router.route("/product/new").post(isAuthenticateUser, createProduct);
// URL same thakle aivabe aksate update and delete method use kora jai;
router
  .route("/product/:id")
  .put(isAuthenticateUser, authorizeRoles("admin"), updateProduct)
  .delete(isAuthenticateUser, authorizeRoles("admin"), deleteProduct)
  .get(getIdByProduct);

module.exports = router;
