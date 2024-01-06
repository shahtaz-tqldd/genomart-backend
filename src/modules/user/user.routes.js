const express = require("express");
const auth = require("../../middlewares/authHandler");
const { UploadImageCloudinary } = require("../../middlewares/uploadCloudinary");
const UserController = require("./user.controller");

const router = express.Router();

router.post(
  "/",
  UploadImageCloudinary.single("profileImage"),
  UserController.createUser
);

router.get("/", UserController.getAllUsers);

router.get("/profile", auth(), UserController.getMyProfile);

router.get("/:userId", UserController.getSingleUser);

router.patch(
  "/:id",
  UploadImageCloudinary.single("profileImage"),
  UserController.updateUser
);

module.exports = router;
