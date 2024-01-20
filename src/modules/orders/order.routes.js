const express = require("express");
const auth = require("../../middlewares/authHandler");
const OrderController = require("./order.controller");

const router = express.Router();

router.route("/").post(auth(), OrderController.createOrder);
router.route("/").get(auth(), OrderController.getAllOrders);
router.route("/:id").get(auth(), OrderController.getSingleOrder);
router.route("/:id").delete(auth(), OrderController.deleteOrder);
router.route("/status/:id").patch(auth(), OrderController.changeOrderStatus);

module.exports = router;
