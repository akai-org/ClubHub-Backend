const errors = require('../utils/error/appError');
const {getCurrTime} = require('../utils/time')

require('dotenv').config()

const prodError = (err, res) =>{
    if (err) {
      res.status(err.statusCode).json({
        error : err.name,
        message : err.description,
      });
    }
}

const devError = (err, res) =>{
  res.status(err.statusCode).json({
      dev : true, 
      timestamp : getCurrTime(), 
      error : err.name,
      message: err.description || err.message,
      stack: err instanceof errors.NotImplementedError ? err.stack : undefined,
      //originalError :  err.originalError 
  });
}

const testError = (err, res) =>{
  res.status(err.statusCode).json(err)
}

function handleMongoErrors(err){ 
  if((err.name === 'MongoError' || err.name === 'MongoServerError') && err.code === 11000){
    err = new errors.AlreadyInUseError(`keys already in use: ${Object.keys(err.keyValue).join(', ')}`)
  }

  if(err.name === 'MongooseError'){
    err = new Error('Mongoose Error')
  }

  // if(err.name === 'ValidationError'){
  //   err = new errors.ValidationError(err.message)
  // }
  return err
}

const errorHandlerMiddleware = (err, req, res, next) =>{

  console.log("error:", err.stack)

  err = handleMongoErrors(err)

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
  if(process.env.NODE_ENV === "test"){
    testError(apiError, res);
  }
  devError(apiError, res);
}



module.exports = {errorHandler: errorHandlerMiddleware}