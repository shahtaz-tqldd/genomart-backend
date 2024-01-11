const express = require("express");
const auth = require("../../middlewares/authHandler");
const DashboardController = require("./dashboard.controller");

const router = express.Router();

router.route("/stats").get(auth(), DashboardController.getStats);

module.exports = router;
