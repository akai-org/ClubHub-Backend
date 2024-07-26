const {BaseError} = require('./appError')

class ErrorHandler {

    logError(error){
        console.log("ERORR")
    }

    async handleError(error){
        // await loger.error
        //sendMailToAdminIfCritical()
        //
    }

    transformError (err) {
        if(!errorHandler.isErrorTrusted(err))
          {
            if(databaseErrorHandler.isTrusted(err)){
              return databaseErrorHandler.transformError(err) //should not check further
            }
          
            return new NotImplementedError(err)
          }
          return err
      }

    isErrorTrusted(error){
        if(error instanceof BaseError){
        return true
        }
        return false
    }
}

const errorHandlerInstance = new ErrorHandler()

module.exports = errorHandlerInstance