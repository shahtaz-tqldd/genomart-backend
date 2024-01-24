const express = require("express");
const AuthController = require("./auth.controller");

const router = express.Router();

router.post("/login", AuthController.login);
router.post("/login/social", AuthController.socialLogin);
router.post("/refresh-token", AuthController.refreshToken);

module.exports = router;
