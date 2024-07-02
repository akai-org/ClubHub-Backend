module.exports =  class AppError extends Error {
    constructor(message, statusCode, info) {
      super(message);
      this.statusCode = statusCode;
      this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
      this.isOperational = true;
      Object.assign(this, info);
      Error.captureStackTrace(this, this.constructor);
    }
  }