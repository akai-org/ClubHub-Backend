const mongoose = require('mongoose');
const {getCurrTime} = require('../utils/time')
const config = require('config')
const dbURI = config.get('mongodb.URI')

const connectDB = async () => {
  try {
    mongoose.connection.on('connected', () => logger.verbose('MongoDB connected'));
    mongoose.connection.on('open', () => logger.verbose('MongoDB is open'));
    mongoose.connection.on('disconnected', () => logger.verbose('MongoDB disconnected'));
    mongoose.connection.on('reconnected', () => logger.verbose('MongoDB reconnected'));
    mongoose.connection.on('disconnecting', () => logger.verbose('MongoDB disconnecting'));
    mongoose.connection.on('close', () => logger.verbose('MongoDB is closed'));

    await mongoose.connect("dbURI", {/* options for mongoDB */});

  } catch (err) {
    logger.fatal("MongoDB not connected", {error : err.toString()})
    process.exit(1);
  }
};

module.exports = connectDB;