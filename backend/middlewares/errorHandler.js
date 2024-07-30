const errors = require('../utils/appError');

require('dotenv').config()

const prodError = (err, res) =>{
    if (err) {
      res.status(err.statusCode).json({
        error : err.name,
        message : err.description,
        detail : err.detail,
      });
    }
}

const devError = (err, res) =>{
  res.status(err.statusCode).json({
      //more info about error in development mode
      error : err.name,
      message: err.description || err.message,
      detail : err.detail,
      stack: err instanceof errors.NotImplementedError ? err.stack : undefined,

      //error : err,
  });
}

const errorHandlerMiddleware = (err, req, res, next) =>{
  /*
  if(databaseErrorHandler.isTrusted(err)) // => err.name === "MongoServerError"
    err = databaseErrorHandler.transformError(err)
  */

  if((err.name === 'MongoError' || err.name === 'MongoServerError') && err.code === 11000){
    err = new errors.AlreadyInUseError(`keys already in use: ${Object.keys(err.keyValue).join(', ')}`)
  }

  if(err.name === 'MongooseError'){
    console.log("Mongoose Error")
    err = new Error('Mongoose Error')
  }

  if(!(err instanceof errors.BaseError)){
    err = new errors.NotImplementedError(err)
  }

  let apiError = new errors.APIError(err)  

  if (process.env.NODE_ENV === "development") {
    devError(apiError, res);
  }
  if (process.env.NODE_ENV === "production") {
    prodError(apiError, res);
  }

  if(err instanceof errors.NotImplementedError)
    console.log(err)
}



module.exports = {errorHandler: errorHandlerMiddleware}