const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
  token: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const UserSchema = new mongoose.Schema({
  uuid:{
    type:String, 
    required: true,
    unique: true, 
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  firstname: {
    type: String,  
  },
  lastname: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  discrod: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
    required: true
  },
  //auth: [tokenSchema],
});

const User = mongoose.model('user_accounts', UserSchema);

module.exports = {User,tokenSchema};