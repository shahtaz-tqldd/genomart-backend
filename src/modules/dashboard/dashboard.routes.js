const express = require("express");
const auth = require("../../middlewares/authHandler");
const DashboardController = require("./dashboard.controller");
const { UploadImageCloudinary } = require("../../middlewares/uploadCloudinary");

const router = express.Router();

router.route("/stats").get(auth(), DashboardController.getStats);
// router.route("/banner").get(auth(), DashboardController.getBanner);
router
  .route("/banner")
  .post(
    auth(),
    UploadImageCloudinary.fields([{ name: "images", maxCount: 3 }]),
    DashboardController.createBanner
  );

router
  .route("/settings")
  .post(
    auth(),
    UploadImageCloudinary.single("logo"),
    DashboardController.createInfo
  );
router.route("/settings").get(auth(), DashboardController.getSettingsInfo);

module.exports = router;
