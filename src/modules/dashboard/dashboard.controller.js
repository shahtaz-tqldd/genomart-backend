const catchAsync = require("../../utiles/catchAsync");
const sendResponse = require("../../utiles/sendResponse");
const pick = require("../../middlewares/helpers/pick");
// const { orderFilterableFields } = require("./order.constant");
const DashboardService = require("./dashboard.services");

const getStats = catchAsync(async (req, res, next) => {
  const result = await DashboardService.getStatsService();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Get dashboard stats",
    data: result,
  });
});

module.exports = {
  getStats,
};
