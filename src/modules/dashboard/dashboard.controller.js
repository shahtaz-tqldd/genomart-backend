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
  // const images = [1,2,3];
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

module.exports = {
  getStats,
  createBanner,
};
