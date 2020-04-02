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
  contact: {type: String, default: ''},
  ratings:{type: Number, default: 0},
  ratingCount:{type: Number,default: 0}
});

module.exports = mongoose.model("User",userSchema,'User');
