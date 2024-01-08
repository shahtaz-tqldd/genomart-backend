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
router.route("/").get(auth(), ProductController.getAllProducts);
router.route("/:id").get(auth(), ProductController.getSingleProduct);
router.route("/:id").delete(auth(), ProductController.deleteProduct);

module.exports = router;
