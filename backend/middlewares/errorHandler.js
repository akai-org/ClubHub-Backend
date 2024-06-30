const { default: AppError } = require('../utils/appError');

require('dotenv').config()

const prodError = (err, res) =>{
    if (err.isOperational) {
        res.status(err.statusCode).json({
          status: err.status,
          message: err.message,
        });
      } else {
        res.status(500).json({
          status: "error",
          message: "something went very wrong!",
        });
      }
}

const devError = (err, res) =>{
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack,
      });
}

const castErrorHandler = (err) =>{
    const message = `Invalid ${err.path}: ${err.value}.`
    return new AppError(message, 400)
}

const duplicateErrorHandler = (err) =>{
    const value = err.message.match(/(["'])(\\?.)*?\1/)[0];
    const message = `field value:${value} aleady exist. please use another`;
    return new AppError(message, 409)
}

const validateErroHandler = (err) =>{
    const errors = Object.values(err.errors).map((el) => el.message);
    const message = `Invalid input data. ${errors.join(". ")}`;
    return new AppError (message, 400);
}

const errorHandler = (err, req, res, next) =>{
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";
    
  if (process.env.NODE_ENV === "development") {
    devError(err, res);
  } else if (process.env.NODE_ENV === "production") {
    if (err.name === "CastError") err = castErrorHandler(err);
    if (err. name === "ValidationError") err = validationErrorHandler (err); //error when not all fields are provided but are required
    if (err.code === 11000 || err.code === 11001) err = duplicateErrorHandler(err) //error code is mongodb specific check mongodb documentation for more info

    prodError(err, res);
  }
}

module.exports = {errorHandler,logErrors}