class ApiResponse {
  constructor({ message = "Something went wrong", data, statusCode } = {}) {
    this.message = message;
    this.data = data;
    this.statusCode = statusCode;
  }
}

module.exports = ApiResponse;