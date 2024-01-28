const {
  paginationFields,
} = require("../../middlewares/helpers/paginationHelper");
const jwtHelpers = require("../../middlewares/helpers/helpers");
const config = require("../../../config");
const catchAsync = require("../../utiles/catchAsync");
const pick = require("../../middlewares/helpers/pick");
const sendResponse = require("../../utiles/sendResponse");
const { userFilterableFields } = require("./user.constant");
const UserService = require("./user.services");
const { ApiError } = require("../../middlewares/errors/errors");

const createUser = catchAsync(async (req, res, next) => {
  const result = await UserService.createUserService(req.body);

  const accessToken = jwtHelpers.createToken(
    { _id: result?._id, email: result?.email, role: result?.role },
    config.jwt.secret,
    config.jwt.expires_in
  );

  const refreshToken = jwtHelpers.createToken(
    { _id: result?._id, email: result?.email, role: result?.role },
    config.jwt.refresh_secret,
    config.jwt.refresh_expires_in
  );

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
      user: result,
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

  const result = await UserService.updateUserService(
    req.params.id,
    req.body,
    imageData
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Profile updated!",
    data: result,
  });
});

const disableUser = catchAsync(async (req, res, next) => {
  if (req?.user?.role !== "admin") {
    throw new ApiError(404, "You are not authorize");
  }

  const result = await UserService.disableUserService(
    req?.params?.userId,
    req?.query?.disable
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: `User ${req?.query?.disable ? "disabled" : "enabled"}`,
    data: result,
  });
});

const updateRole = catchAsync(async (req, res, next) => {
  if (req?.user?.role !== "admin") {
    throw new ApiError(404, "You are not authorize");
  }

  const result = await UserService.updateRoleService(
    req?.params?.userId,
    req?.query?.role
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: `User updated to ${req?.query?.role}`,
    data: result,
  });
});

module.exports = {
  createUser,
  getAllUsers,
  getMyProfile,
  getSingleUser,
  updateUser,
  disableUser,
  updateRole,
};
