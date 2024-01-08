const catchAsync = require("../../utiles/catchAsync");
const sendResponse = require("../../utiles/sendResponse");
const pick = require("../../middlewares/helpers/pick");
const { orderFilterableFields } = require("./order.constant");
const OrderService = require("./order.services");
const {
  paginationFields,
} = require("../../middlewares/helpers/paginationHelper");

const createOrder = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const result = await OrderService.createOrderService(req.body, userId);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "New order created!",
    data: result,
  });
});

const getAllOrders = catchAsync(async (req, res, next) => {
  const filters = pick(req.query, orderFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);
  const result = await OrderService.getAllOrderService(
    filters,
    paginationOptions
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Get all orders",
    meta: result.meta,
    data: result.data,
  });
});

const deleteOrder = catchAsync(async (req, res, next) => {
  const result = await OrderService.deleteOrderService(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Order deleted!",
    data: result,
  });
});

const getSingleOrder = catchAsync(async (req, res, next) => {
  const ordertId = req.params.id;
  const result = await OrderService.getSingleOrderService(ordertId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Get single order",
    data: result,
  });
});

const updateOrder = catchAsync(async (req, res, next) => {
  const orderId = req.params.id;
  const result = await OrderService.updateOrderService(orderId, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Order updated!",
    data: result,
  });
});

module.exports = {
  createOrder,
  getAllOrders,
  deleteOrder,
  getSingleOrder,
  updateOrder,
};
