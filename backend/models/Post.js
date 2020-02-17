const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
  createdAt: { type: Date, default: Date.now},
  username: {type: String, required: true},
  content: {type: String, required: true},

  tags:{type: [String]},

  likedByUser: {type: [String]},
  numberOfLikes: {type: Number},

  quoted: {type: Boolean},
  comment: {type: String},
  originName: {type: String}
});
module.exports = mongoose.model("Post", postSchema, 'Post');
