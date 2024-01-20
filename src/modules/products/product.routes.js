const express = require("express");
const auth = require("../../middlewares/authHandler");
const { UploadImageCloudinary } = require("../../middlewares/uploadCloudinary");
const ProductController = require("./product.controller");

const router = express.Router();

router
  .route("/")
  .post(
    auth(),
    UploadImageCloudinary.fields([{ name: "images", maxCount: 4 }]),
    ProductController.createProduct
  );
router.route("/").get(ProductController.getAllProducts);
router.route("/categories").get(ProductController.getAllCategories);
router.route("/:id").get(ProductController.getSingleProduct);
router.route("/:id").delete(auth(), ProductController.deleteProduct);
router.route("/wishlist/:id").patch(auth(), ProductController.addToWishList);
router.route("/wishlist/all").get(auth(), ProductController.getAllWishList);

module.exports = router;
