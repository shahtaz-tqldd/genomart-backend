const { default: mongoose } = require("mongoose");
const {
  calculatePagination,
} = require("../../middlewares/helpers/paginationHelper");
const { OrderSearchableFields } = require("./order.constant");
const Order = require("./order.model");
const { ApiError } = require("../../middlewares/errors/errors");

const createOrderService = async (payload, imageData) => {
  const requiredFields = ["name", "price", "stock", "category", "description"];

  for (const field of requiredFields) {
    if (!payload[field]) {
      throw new ApiError(400, `Please provide ${field}`);
    }
  }

  const isExistProduct = await Order.findOne({ name: payload.name });

  if (isExistProduct) {
    throw new ApiError(400, "Product already exist");
  }

  const newData = {
    ...payload,
    images: imageData,
  };

  const result = await Order.create(newData);

  return result;
};

const getAllOrderService = async (filters, paginationOptions) => {
  const { searchTerm, ...filtersData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    calculatePagination(paginationOptions);
  const aggregationPipeline = [];
  const matchStage = {};

  if (searchTerm) {
    const searchConditions = OrderSearchableFields.map((field) => ({
      [field]: {
        $regex: searchTerm,
        $options: "i",
      },
    }));

    matchStage.$or = searchConditions;
  }
  if (Object.keys(filtersData).length) {
    matchStage.$and = Object.entries(filtersData).map(([field, value]) => ({
      [field]: value,
    }));
  }

  if (Object.keys(matchStage).length > 0) {
    aggregationPipeline.push({ $match: matchStage });
  }

  // Sort Stage
  const sortConditions = {};

  // Dynamic sort needs fields to do sorting
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  // Add Sort Stage to Aggregation Pipeline
  if (Object.keys(sortConditions).length > 0) {
    aggregationPipeline.push({ $sort: sortConditions });
  }

  // Pagination Stage
  aggregationPipeline.push({ $skip: skip });
  aggregationPipeline.push({ $limit: limit });
  aggregationPipeline.push({
    $project: {
      password: 0,
    },
  });

  const result = await Order.aggregate(aggregationPipeline);
  const total = await Order.countDocuments(matchStage);

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

const updateOrderService = async(orderId, payload)=> {
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
}

module.exports = {
  createOrderService,
  getAllOrderService,
  deleteOrderService,
  getSingleOrderService,
  updateOrderService,
};
