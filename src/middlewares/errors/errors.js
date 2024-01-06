// api error
function ApiError(statusCode, message, stack) {
  Error.call(this);
  this.statusCode = statusCode;
  this.message = message || "An error occurred";
  this.stack = stack || new Error().stack;
}

ApiError.prototype = Object.create(Error.prototype);
ApiError.prototype.constructor = ApiError;

// cast errors
const handleCastError = (error) => {
  const errors = [
    {
      path: error.path,
      message: "Invalid Id",
    },
  ];

  const statusCode = 400;

  return {
    statusCode,
    message: "Cast Error",
    errorMessages: errors,
  };
};

// validation error
const handleValidationError = (error) => {
  const errors = Object.values(error.errors).map((el) => ({
    path: el?.path,
    message: el?.message,
  }));

  const statusCode = 400;

  return {
    statusCode,
    message: errors[0]?.message || error?.message || "Something went wrong!",
    errorMessages: errors,
  };
};

module.exports = {
  ApiError,
  handleValidationError,
  handleCastError,
};
