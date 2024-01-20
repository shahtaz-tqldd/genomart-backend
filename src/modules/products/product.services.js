const { default: mongoose } = require("mongoose");
const {
  calculatePagination,
} = require("../../middlewares/helpers/paginationHelper");
const { productSearchableFields } = require("./product.constant");
const Product = require("./product.model");
const { ApiError } = require("../../middlewares/errors/errors");
const User = require("../user/user.model");

const createProductService = async (payload, imageData) => {
  const requiredFields = ["name", "price", "stock", "category", "description"];

  for (const field of requiredFields) {
    if (!payload[field]) {
      throw new ApiError(400, `Please provide ${field}`);
    }
  }

  const isExistProduct = await Product.findOne({ name: payload.name });

  if (isExistProduct) {
    throw new ApiError(400, "Product already exist");
  }

  const newData = {
    ...payload,
    images: imageData,
  };

  const result = await Product.create(newData);

  return result;
};

const getAllProductService = async (filters, paginationOptions) => {
  const { searchTerm, ...filtersData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    calculatePagination(paginationOptions);
  const aggregationPipeline = [];
  const matchStage = {};

  if (searchTerm) {
    const searchConditions = productSearchableFields.map((field) => ({
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

  const result = await Product.aggregate(aggregationPipeline);
  const total = await Product.countDocuments(matchStage);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const deleteProductService = async (id) => {
  const result = await Product.findByIdAndDelete(id);
  return result;
};

const getSingleProductService = async (productId) => {
  const result = await Product.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(productId),
      },
    },
  ]);

  return result[0];
};

const getAllCategoryService = async () => {
  const result = await Product.aggregate([
    {
      $group: {
        _id: "$category",
        count: { $sum: 1 },
        image: { $first: "$images.url" },
      },
    },
    {
      $project: {
        _id: 0,
        category: "$_id",
        count: 1,
        image: 1,
      },
    },
  ]);

  return result.map((r) => ({
    category: r?.category,
    image: r?.image[0],
    totalProducts: r.count,
  }));
};

// const updateUserService = async(userId, updateData, imageData)=> {
//   const id = new mongoose.Types.ObjectId(userId);

//   if (imageData?.url) {
//     updateData.profileImage = imageData;
//   }

//   try {
//     const result = await User.findByIdAndUpdate(
//       id,
//       { $set: updateData },
//       { new: true }
//     );

//     if (!result) {
//       throw new ApiError(404, "User not found");
//     }

//     return result;
//   } catch (error) {
//     throw new ApiError(500, "Internal Server Error", error);
//   }
// }

const addToWishListService = async (action, userId, productId) => {
  const pObjId = new mongoose.Types.ObjectId(productId);
  let userData = await User.findById({ _id: userId });

  const isExist = userData?.wishList?.includes(pObjId);

  if (action === "add" && isExist) {
    throw new ApiError(400, "Product already exists in your wishlist");
  }
  if (action === "add" && !isExist) {
    userData.wishList.push(pObjId);
  }
  if (action === "remove" && isExist) {
    userData.wishList = userData.wishList.filter((pid) => pid?.toString() !== productId);
  }
  if (action === "remove" && !isExist) {
    throw new ApiError(400, "Product already removed!");
  }
  userData.save();
};

const getAllWishlistService = async (userId) => {
  try {
    const userData = await User.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(userId) },
      },
      {
        $lookup: {
          from: "products",
          localField: "wishList",
          foreignField: "_id",
          as: "wishlistDetails",
        },
      },
      {
        $project: {
          wishlistDetails: {
            _id: 1,
            name: 1,
            price: 1,
            colors: 1,
            sizes: 1,
            brand: 1,
            category: 1,
            stock: 1,
            images: 1,
          },
        },
      },
    ]);

    if (userData.length === 0) {
      throw new Error("User not found");
    }

    // Extract relevant information from the populated wishlist
    const wishlistDetails = userData[0].wishlistDetails.map((product) => ({
      _id: product._id,
      name: product.name,
      price: product.price,
      colors: product.colors,
      sizes: product.sizes,
      brand: product.brand,
      category: product.category,
      stock: product.stock,
      images: product.images,
    }));

    return wishlistDetails;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createProductService,
  getAllProductService,
  deleteProductService,
  getSingleProductService,
  getAllCategoryService,
  // updateUserService,
  addToWishListService,
  getAllWishlistService,
};
