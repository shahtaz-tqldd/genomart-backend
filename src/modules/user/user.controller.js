const {
  paginationFields,
} = require("../../middlewares/helpers/paginationHelper");
const config = require("../../../config");
const catchAsync = require("../../utiles/catchAsync");
const pick = require("../../middlewares/helpers/pick");
const sendResponse = require("../../utiles/sendResponse");
const { userFilterableFields } = require("./user.constant");
const UserService = require("./user.services");
const AuthService = require("../auth/auth.service");

const createUser = catchAsync(async (req, res, next) => {
  await UserService.createUserService(req.body);

  const { refreshToken, accessToken, user } = await AuthService.loginService({
    email: req.body.email,
    password: req.body.password,
  });

  const cookieOptions = {
    secure: config.env === "production",
    httpOnly: true,
    sameSite: "strict",
    secure: true,
  };

  res.cookie("refreshToken", refreshToken, cookieOptions);
  res.cookie("accessToken", accessToken, cookieOptions);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "New user created and logged in!",
    data: {
      user,
      token: accessToken,
    },
  });
});

const getAllUsers = catchAsync(async (req, res, next) => {
  const filters = pick(req.query, userFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);
  const result = await UserService.getAllUsersService(
    filters,
    paginationOptions
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "All Users",
    meta: result.meta,
    data: result.data,
  });
});

const getMyProfile = catchAsync(async (req, res, next) => {
  const userId = req.user._id;

  const result = await UserService.getMyProfileService(userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "My Profile",
    data: result,
  });
});

const getSingleUser = catchAsync(async (req, res, next) => {
  const userId = req.params.userId;

  const result = await UserService.getSingleUserService(userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Single User",
    data: result,
  });
});

const updateUser = catchAsync(async (req, res, next) => {
  const file = req.file;

  let imageData = {};

  if (file?.path) {
    imageData = {
      url: file?.path,
      public_id: file?.filename,
    };
  }

  const userId = req.params.id;
  const updateData = req.body;

  const result = await UserService.updateUserService(
    userId,
    updateData,
    imageData
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User updated successfully",
    data: result,
  });
});

module.exports = {
  createUser,
  getAllUsers,
  getMyProfile,
  getSingleUser,
  updateUser,
};
