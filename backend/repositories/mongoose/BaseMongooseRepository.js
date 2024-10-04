const AppError = require('../../utils/error/appError')
const mongoose = require('mongoose')

class BaseMongooseRepository {

    constructor(collectionName, schema){
        this.schema = new mongoose.Schema(schema)
        this.model = mongoose.model(collectionName, this.schema);
    }

    async insert(data){
        throw (new AppError("Method Insert not Implemented", 500))
    }

    async findByUuid(data){
        throw (new AppError("Method findByUuid not Implemented", 500))
    }

    async findAll(data){
        throw (new AppError("Method findAll not Implemented", 500))
    }
}

module.exports = BaseMongooseRepository