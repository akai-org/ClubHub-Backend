const mongoose = require('mongoose');
const {getCurrTime} = require('../utils/time')
const config = require('config')
const dbURI = config.get('mongoURI')

const connectDB = async () => {
  console.log(getCurrTime(), "Connecting to MongoDB...")
  try {

    mongoose.connection.on('connected', () => console.log(getCurrTime(),'MongoDB connected'));
    mongoose.connection.on('open', () => console.log(getCurrTime(),'MongoDB is open'));
    mongoose.connection.on('disconnected', () => console.log(getCurrTime(),'MongoDB disconnected'));
    mongoose.connection.on('reconnected', () => console.log(getCurrTime(),'MongoDB reconnected'));
    mongoose.connection.on('disconnecting', () => console.log(getCurrTime(),'MongoDB disconnecting'));
    mongoose.connection.on('close', () => console.log(getCurrTime(),'MongoDB is closed'));

    await mongoose.connect(dbURI, {/* options for mongoDB */});

  } catch (err) {
    console.log(getCurrTime(), "MongoDB not connected : ")
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;