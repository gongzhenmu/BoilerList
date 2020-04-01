const mongoose = require("mongoose");
const Schema =mongoose.Schema;

const userSchema = mongoose.Schema({
  email: {type: String, required: true, unique:true},
  username: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  token: {type: String},
  avatarUrl: {type: String, required: false, default: "http://localhost:3000/images/avatar/default.jpg "},
  userPosts:[{type:Schema.ObjectId, ref: 'Post'}],
  // userTags:{type:[String]},
  userFavorites: [{type: Schema.ObjectId, ref: 'Favorite'}],
  phone: {type: Number},
  ratings:{type: Number},
  ratingCount:{type: Number}
});

module.exports = mongoose.model("User",userSchema,'User');
