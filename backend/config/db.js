const mongoose = require('mongoose');
const {getCurrTime} = require('../utils/time')
const config = require('config')
const dbURI = config.get('mongoURI')

const connectDB = async () => {
  console.log(getCurrTime(), "Connecting to database...")
  try {
    await mongoose.connect(dbURI, {/* options for mongoDB */});
    console.log(getCurrTime(), 'MongoDB connected...');
  } catch (err) {
    console.log(getCurrTime(), "Database not connected : ")
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;