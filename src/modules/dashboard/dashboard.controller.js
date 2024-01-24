const catchAsync = require("../../utiles/catchAsync");
const sendResponse = require("../../utiles/sendResponse");
const pick = require("../../middlewares/helpers/pick");
// const { orderFilterableFields } = require("./order.constant");
const DashboardService = require("./dashboard.services");
const { ApiError } = require("../../middlewares/errors/errors");
const { parse } = require("path");

const getStats = catchAsync(async (req, res, next) => {
  const result = await DashboardService.getStatsService();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Get dashboard stats",
    data: result,
  });
});

const createBanner = catchAsync(async (req, res, next) => {
  const images = req.files["images"];
  const products = JSON.parse(req.body.products);
  const banners = [];

  if (images && images.length > 0) {
    images.forEach((image, i) => {
      banners.push({
        public_id: image.filename,
        url: image.path,
        productId: products[i],
      });
    });
  }

  if (!banners[0]?.url) {
    throw new ApiError(400, `Please upload some product images`);
  }

  const result = await DashboardService.createBannerService(banners);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "create dashboard banner",
    data: result,
  });
});

const addToSpecialOffer = catchAsync(async (req, res, next) => {
  const productId = req.body.productId

  const result = await DashboardService.addToSpecialOfferService(productId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Special product added",
    data: result,
  });
});

const createInfo = catchAsync(async (req, res, next) => {
  const file = req.file;
  let imageData = {};

  if (file?.path) {
    imageData = {
      url: file?.path,
      public_id: file?.filename,
    };
  }
  const result = await DashboardService.createInfoService(req.body, imageData);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Settings updated",
    data: result,
  });
});

const getSettingsInfo = catchAsync(async (req, res, next) => {
  const result = await DashboardService.getSettingsInfoService();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Get Settings Info",
    data: result,
  });
});

module.exports = {
  getStats,
  createBanner,
  createInfo,
  getSettingsInfo,
  addToSpecialOffer
};
