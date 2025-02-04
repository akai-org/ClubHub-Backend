const mongoose = require('mongoose');
const config = require('./config')
const {DBconnectionError} = require('../utils/error/appError')

const logger = require('../utils/logger/instance')


const connectDB = async () => {
  try {
    mongoose.connection.on('connected', () => logger.verbose('MongoDB connected'));
    mongoose.connection.on('open', () => logger.verbose('MongoDB is open'));
    mongoose.connection.on('disconnected', () => logger.verbose('MongoDB disconnected'));
    mongoose.connection.on('reconnected', () => logger.verbose('MongoDB reconnected'));
    mongoose.connection.on('disconnecting', () => logger.verbose('MongoDB disconnecting'));
    mongoose.connection.on('close', () => logger.verbose('MongoDB is closed'));
    
    const dbURI =  config.get('mongodb.URI');
    await mongoose.connect(dbURI, {/* options for mongoDB */});

  } catch (err) {
    //logger.fatal("MongoDB not connected", {error : err.toString()})
    throw new DBconnectionError(err.toString())
  }
};

module.exports = connectDB;