const AppError = require('../utils/appError');

require('dotenv').config()

const prodError = (err, appErr, res) =>{
  console.log("prod Error")
    if (appErr && appErr.isOperational) {
      res.status(appErr.statusCode).json({
        success : false, 
        ...appErr, 
      });
    } else {
      res.status(500).json({
        success : false, 
        status: "error",
        statusCode : 500,
        errType : 'Internal',
        isOperational : false, 
        message: "Internal server error",
      });
    }
}

const devError = (err, appErr, res) =>{
  console.log("dev Error")
  res.status(appErr.statusCode).json({
      success : false, 
      status: err.status,
      ...appErr,
      //more info about error in development mode
      message: err.message,
      stack: err.stack,
      error : err,
  });
}

const castErrorHandler = (err) =>{
    const message = `Invalid ${err.path}: ${err.value}.`
    return new AppError(message, 400,{errType : "cast"})
}

const duplicateErrorHandler = (err) =>{
  const value = err.message.match(/(["'])(\\?.)*?\1/)[0];
  const message = `field value:${value} aleady exist. please use another`;
  return new AppError(message, 409, { errType : 'duplication', duplicatedFields : [value]})
}

const validationErrorHandler = (err) =>{
    const errors = Object.values(err.errors).map((el) => el.message);
    const message = `Invalid input data. ${errors.join(". ")}`;
    return new AppError(message, 400, {errType : "validation"});
}

const logErrors = (err, req, res, next) =>{
  console.error(err)
  next(err)
}

const errorHandler = (err, req, res, next) =>{
  let appErr = new AppError("Internal Error", 500); 
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (err.name === "CastError") appErr = castErrorHandler(err);
  if (err. name === "ValidationError") appErr = validationErrorHandler (err); //error when not all fields are provided but are required
  if (err.code === 11000 || err.code === 11001) appErr = duplicateErrorHandler(err); //error code is mongodb specific check mongodb documentation for more info
  if (err instanceof AppError) appErr = err; 



  if (process.env.NODE_ENV === "development") {
    devError(err,appErr, res);
  }
  if (process.env.NODE_ENV === "production") {
    prodError(err,appErr, res);
  }
}



module.exports = {errorHandler,logErrors}