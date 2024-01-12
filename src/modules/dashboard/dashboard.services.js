const { default: mongoose } = require("mongoose");
const { ApiError } = require("../../middlewares/errors/errors");
const Product = require("../products/product.model");
const User = require("../user/user.model");
const Order = require("../orders/order.model");
const Info = require("./dashboard.model");

const getStatsService = async () => {
  const totalProducts = await Product.countDocuments();
  const totalUsers = await User.countDocuments();
  const totalOrders = await Order.countDocuments();

  // Total orders with status 'pending'
  const totalPendingOrders = await Order.countDocuments({
    status: "pending",
  });

  // Total orders with status 'processing'
  const totalProcessingOrders = await Order.countDocuments({
    status: "processing",
  });

  // Total orders with status 'sent'
  const totalSentOrders = await Order.countDocuments({ status: "sent" });

  // Total orders with status 'received'
  const totalCompletedOrders = await Order.countDocuments({
    status: "completed",
  });

  return {
    totalProducts,
    totalUsers,
    totalOrders,
    totalPendingOrders,
    totalProcessingOrders,
    totalSentOrders,
    totalCompletedOrders,
  };
};

const createBannerService = async (payload) => {
  let info = await Info.findOne();
  if (!info) {
    info = await Info.create({});
  }

  info.banners = payload
  const updatedInfo = await info.save();
  return updatedInfo;
};

module.exports = {
  getStatsService,
  createBannerService,
};
