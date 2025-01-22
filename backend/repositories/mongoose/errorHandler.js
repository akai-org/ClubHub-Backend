const erorrs = require('../../utils/appError')

class MongooseErroHandler {

    transformError(err){
        if(err && (err.code === 11000 || err.code===11001)){
            
            console.log(err.keyPattern)
            return new erorrs.AlreadyInUseError(err)
        }
        return new erorrs.NotImplementedError(err);
    }

    isTrusted(err){
        if(err && err.name === "MongoServer"){
            return true
        }
        return false
    }
}

const databaseErrorHandler = new MongooseErroHandler()

module.exports = databaseErrorHandler