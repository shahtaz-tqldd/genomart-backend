const { default: mongoose } = require("mongoose");
const {
  calculatePagination,
} = require("../../middlewares/helpers/paginationHelper");
const { OrderSearchableFields } = require("./order.constant");
const Order = require("./order.model");
const { ApiError } = require("../../middlewares/errors/errors");
const User = require("../user/user.model");

const createOrderService = async (payload) => {
  const user = await User.findById(payload.customer.id);

  const total = await Order.countDocuments();
  function geenrateId(id) {
    return `#${("0000" + id).slice(-4)}`;
  }
  const sl = geenrateId(total + 1);

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

  // Save the updated user
  await user.save();

  // Create a new order
  const orderData = {
    user: payload.customer.id,
    payment: payload.payment.method,
    cost: payload.payment.total,
    products: payload.products,
    orderSl: sl,
  };

  const result = await Order.create(orderData);

  return result;
};

const getAllOrderService = async (filters, paginationOptions) => {
  const { searchTerm, ...filtersData } = filters;
  const { page, limit, skip, sortBy, sortOrder } = calculatePagination(
    paginationOptions
  );
  const query = {};

  if (searchTerm) {
    const searchConditions = OrderSearchableFields.map((field) => ({
      [field]: {
        $regex: searchTerm,
        $options: "i",
      },
    }));

    query.$or = searchConditions;
  }
  if (Object.keys(filtersData).length) {
    query.$and = Object.entries(filtersData).map(([field, value]) => ({
      [field]: value,
    }));
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

module.exports = {
  createOrderService,
  getAllOrderService,
  deleteOrderService,
  getSingleOrderService,
  updateOrderService,
};
