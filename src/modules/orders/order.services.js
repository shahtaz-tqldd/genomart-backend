const { default: mongoose } = require("mongoose");
const {
  calculatePagination,
} = require("../../middlewares/helpers/paginationHelper");
const { OrderSearchableFields } = require("./order.constant");
const Order = require("./order.model");
const { ApiError } = require("../../middlewares/errors/errors");
const User = require("../user/user.model");
const generateId = require("../../utiles/generateRandomNumber");
const Product = require("../products/product.model");

const createOrderService = async (payload) => {
  const user = await User.findById(payload.customer.id);

  if (!user) {
    throw new Error("User not found");
  }

  if (payload.customer.address !== user?.address) {
    user.address = payload.customer.address;
  }
  if (payload.customer.phone !== user?.phone) {
    user.phone = payload.customer.phone;
  }
  if (payload.customer.house !== user?.house) {
    user.house = payload.customer.house;
  }
  if (payload.customer.street !== user?.street) {
    user.street = payload.customer.street;
  }

  await user.save();

  const sl = await generateId();

  const orderData = {
    user: payload.customer.id,
    payment: payload.payment.method,
    cost: payload.payment.total,
    products: payload.products,
    orderSl: sl,
  };

  await Promise.all(
    payload.products.map(async (orderProduct) => {
      const product = await Product.findById(orderProduct.productId);
      if (product) {
        product.numSold += orderProduct.quantity;
        product.stock -= orderProduct.quantity;
        if (product.stock >= 0) {
          await product.save();
        } else {
          throw new ApiError(404, "Product stock out");
        }
      }
    })
  );

  const result = await Order.create(orderData);

  return result;
};

const getAllOrderService = async (
  userId,
  statuses,
  searchTerm,
  paginationOptions
) => {
  const { page, limit, skip, sortBy, sortOrder } =
    calculatePagination(paginationOptions);
  const query = {};

  if (statuses && statuses.length > 0) {
    query.status = { $in: statuses };
  }
  if (userId) {
    query.user = new mongoose.Types.ObjectId(userId);
  }

  if (searchTerm) {
    const searchConditions = OrderSearchableFields.map((field) => ({
      [field]: {
        $regex: searchTerm,
        $options: "i",
      },
    }));

    query.$or = searchConditions;
  }

  const result = await Order.find(query)
    .sort({ [sortBy]: sortOrder })
    .skip(skip)
    .limit(limit)
    .populate({
      path: "products.productId",
      select: "name images category price brand",
      options: { virtuals: true },
    })
    .populate({
      path: "user",
      select: "fullname email address",
    })
    .exec();

  const total = await Order.countDocuments(query);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const deleteOrderService = async (id) => {
  const result = await Order.findByIdAndDelete(id);
  return result;
};

const getSingleOrderService = async (productId) => {
  const result = await Order.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(productId),
      },
    },
  ]);

  return result[0];
};

const updateOrderService = async (orderId, payload) => {
  const id = new mongoose.Types.ObjectId(userId);

  if (imageData?.url) {
    updateData.profileImage = imageData;
  }

  try {
    const result = await Order.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );

    if (!result) {
      throw new ApiError(404, "Order not found");
    }

    return result;
  } catch (error) {
    throw new ApiError(500, "Internal Server Error", error);
  }
};

const changeOrderStatusService = async (orderId, payload) => {
  const { status } = payload;
  const order = await Order.findById(orderId);

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  order.status = status;
  if (status === "completed") {
    order.deliveryDate = new Date();
  } else {
    order.deliveryDate = null;
  }
  await order.save();
};

module.exports = {
  createOrderService,
  getAllOrderService,
  deleteOrderService,
  getSingleOrderService,
  updateOrderService,
  changeOrderStatusService,
};
