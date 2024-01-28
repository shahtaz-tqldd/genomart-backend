const express = require("express");
const auth = require("../../middlewares/authHandler");
const { UploadImageCloudinary } = require("../../middlewares/uploadCloudinary");
const UserController = require("./user.controller");

const router = express.Router();

router.get("/", UserController.getAllUsers);
router.post("/", UserController.createUser);
router.get("/profile", auth(), UserController.getMyProfile);
router.patch(
  "/update/:id",
  auth(),
  UploadImageCloudinary.single("profileImage"),
  UserController.updateUser
);

router.get("/:userId", UserController.getSingleUser);
router.patch("/:userId", auth(), UserController.disableUser);
router.patch("/update-role/:userId", auth(), UserController.updateRole);

module.exports = router;
