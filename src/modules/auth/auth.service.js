const bcrypt = require("bcrypt");
const jwtHelpers = require("../../middlewares/helpers/helpers");
const User = require("../user/user.model");
const config = require("../../../config");
const { ApiError } = require("../../middlewares/errors/errors");

const loginService = async (payload) => {
  const { email, password } = payload;

  const isExistUser = await User.findOne({
    email,
  });

  if (!isExistUser) {
    throw new ApiError(400, "User does not exist");
  }

  const { _id, role } = isExistUser;
  
  const isMatchPassword = await bcrypt.compare(password, isExistUser?.password);

  if (!isMatchPassword) {
    throw new ApiError(400, "Password is not correct!");
  }

  const accessToken = jwtHelpers.createToken(
    { _id, email, role },
    config.jwt.secret,
    config.jwt.expires_in
  );

  const refreshToken = jwtHelpers.createToken(
    { _id, email, role },
    config.jwt.refresh_secret,
    config.jwt.refresh_expires_in
  );

  return {
    user: isExistUser,
    accessToken,
    refreshToken,
  };
};

const refreshToken = async (token) => {
  //verify token
  // invalid token - synchronous
  let verifiedToken = null;
  try {
    verifiedToken = jwtHelpers.verifyToken(token, config.jwt.refresh_secret);
  } catch (error) {
    // throw new ApiError(422, "Invalid Refresh Token");
    return {
      error: "Invalid Refresh Token",
      status: 422,
    };
  }

  const { _id } = verifiedToken;

  // tumi delete hye gso  kintu tumar refresh token ase
  // checking deleted user's refresh token

  const isUserExist = await User.findById(_id);
  if (!isUserExist) {
    throw new ApiError(404, "User does not exist");
  }
  //generate new token

  const newAccessToken = jwtHelpers.createToken(
    {
      _id: isUserExist._id,
      email: isUserExist.email,
      role: isUserExist.role,
    },
    config.jwt.secret,
    config.jwt.expires_in
  );

  return {
    accessToken: newAccessToken,
    user: isUserExist,
  };
};

module.exports = {
  loginService,
  refreshToken,
};
