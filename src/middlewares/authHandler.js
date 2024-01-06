const jwt = require("jsonwebtoken");
const config = require("../../config");
const User = require("../modules/user/user.model");
const { ApiError } = require("./errors/errors");

const auth =
  (...requiredRoles) =>
  async (req, res, next) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        throw new ApiError(401, "You are not authorized");
      }

      // Verify token
      let verifiedUser = null;
      verifiedUser = jwt.verify(token, config.jwt.secret);

      const user = await User.findById(verifiedUser._id);

      req.user = user;

      if (requiredRoles.length && !requiredRoles.includes(verifiedUser.role)) {
        throw new ApiError(403, "Forbidden");
      }

      next();
    } catch (error) {
      next(error);
    }
  };

module.exports = auth;
