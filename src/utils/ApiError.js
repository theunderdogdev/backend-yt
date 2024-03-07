class ApiError extends Error {
  constructor({
    errors = [],
    message = "Something went wrong",
    stack,
    statusCode,
  } = {}) {
    super(message);
    if (this.stack) {
      this.stack = stack;
    } else {
      this.stack = Error.captureStackTrace(this, this.constructor);
    }
    this.statusCode = statusCode;
    this.data = null;
    this.message = message;
    this.errors = errors;
  }
}
module.exports = ApiError;
