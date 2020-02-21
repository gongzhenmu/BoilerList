const mongoose = require("mongoose");
const Schema =mongoose.Schema;

const userSchema = mongoose.Schema({
  // firstName: {type: String, required: true},
  // lastName: {type: String, required: true},
  email: {type: String, required: true, unique:true},
  username: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  token: {type: String}
  // phone: {type : String}
  //registerDate: {type: Date},
  //postInformation: {type: Array},
  //transaction: {type: Array},
  //favouriteList:{type: Array},
  //favouriteLike:{type: Array},
  //favouriteDislike:{type: Array},
  //private: {type: Boolean},
});

module.exports = mongoose.model("User",userSchema,'User');
