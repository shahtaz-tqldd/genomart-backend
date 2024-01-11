const catchAsync = require("../../utiles/catchAsync");
const sendResponse = require("../../utiles/sendResponse");
const pick = require("../../middlewares/helpers/pick");
const { productFilterableFields } = require("./product.constant");
const ProductService = require("./product.services");
const {
  paginationFields,
} = require("../../middlewares/helpers/paginationHelper");

const createProduct = catchAsync(async (req, res, next) => {
  const images = req.files["images"];
  const imageArray = [];

  if (images && images.length > 0) {
    images.forEach((image) => {
      imageArray.push({
        public_id: image.filename,
        url: image.path,
      });
    });
  }

  if (!imageArray[0]?.url) {
    throw new ApiError(400, `Please upload some product images`);
  }

  const result = await ProductService.createProductService(
    req.body,
    imageArray
  );

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "New product created!",
    data: result,
  });
});

const getAllProducts = catchAsync(async (req, res, next) => {
  const filters = pick(req.query, productFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);
  const result = await ProductService.getAllProductService(
    filters,
    paginationOptions
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Get all products",
    meta: result.meta,
    data: result.data,
  });
});

const deleteProduct = catchAsync(async (req, res, next) => {
  const result = await ProductService.deleteProductService(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Product deleted!",
    data: result,
  });
});

const getSingleProduct = catchAsync(async (req, res, next) => {
  const productId = req.params.id;
  const result = await ProductService.getSingleProductService(productId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Get single product",
    data: result,
  });
});

const getAllCategories = catchAsync(async (req, res, next) => {
  const result = await ProductService.getAllCategoryService();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "All Categories",
    data: result,
  });
});

// const updateProduct = catchAsync(async (req, res, next) => {
//   const file = req.file;

//   let imageData = {};

//   if (file?.path) {
//     imageData = {
//       url: file?.path,
//       public_id: file?.filename,
//     };
//   }

//   const userId = req.params.id;
//   const updateData = req.body;

//   const result = await UserService.updateUserService(
//     userId,
//     updateData,
//     imageData
//   );

//   sendResponse(res, {
//     statusCode: 200,
//     success: true,
//     message: "User updated successfully",
//     data: result,
//   });
// });

module.exports = {
  createProduct,
  getAllProducts,
  deleteProduct,
  getSingleProduct,
  getAllCategories,
  // updateUser,
};
