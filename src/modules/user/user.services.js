const { default: mongoose } = require("mongoose");
const { paginationHelpers } = require("../../middlewares/helpers/paginationHelper");
const { userSearchableFields } = require("./user.constant");
const User = require("./user.model");
const { ApiError } = require("../../middlewares/errors/errors");

const createUserService = async (payload, imageData) => {
  const requiredFields = ["fullName", "email", "password", "role"];

  for (const field of requiredFields) {
    if (!payload[field]) {
      throw new ApiError(400, `Please provide ${field}`);
    }
  }

  const isExistUser = await User.findOne({ email: payload.email });

  if (isExistUser) {
    throw new ApiError(400, "Email already exist");
  }

  if (!imageData.url) {
    throw new ApiError(400, "Please provide profile image");
  }

  const newData = {
    ...payload,
  };

  if (imageData.url) {
    newData.profileImage = imageData;
  }

  const result = await User.create(newData);

  return result;
};

const getAllUsersService = async (filters, paginationOptions) => {
  const { searchTerm, ...filtersData } = filters;

  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const aggregationPipeline = [];
  const matchStage = {};

  if (searchTerm) {
    const searchConditions = userSearchableFields.map((field) => ({
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

  const result = await User.aggregate(aggregationPipeline);
  const total = await User.countDocuments(matchStage);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getMyProfileService = async (userId) => {
  const result = await User.findById(userId);

  if (!result) {
    throw new ApiError(404, "User not found");
  }

  return result;
};

const getSingleUserService = async (userId) => {
  const result = await User.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $project: {
        password: 0,
      },
    },
  ]);

  return result[0];
};


async function updateUserService(userId, updateData, imageData) {
  const id = new mongoose.Types.ObjectId(userId);

  if (imageData?.url) {
    updateData.profileImage = imageData;
  }

  try {
    const result = await User.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );

    if (!result) {
      throw new ApiError(404, "User not found");
    }

    return result;
  } catch (error) {
    throw new ApiError(500, "Internal Server Error", error);
  }
}

module.exports = {
  createUserService,
  getAllUsersService,
  getMyProfileService,
  getSingleUserService,
  updateUserService,
};
