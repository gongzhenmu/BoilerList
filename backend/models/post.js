const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
  postID:{type: String, required: true},
  createDate:{type: Date, required: true},
  userId: {type: String, required: true},
  status: {type: String, required: true},
  title: { type: String, required: true },
  content: { type: String, required: true},
  username: {type: String},
  image: {type: String},
  favourite: {type: String},
  likedBy: {type: String},
  numOfLike: {type: Int16Array},
});

module.exports = mongoose.model('Post',postSchema,'Post');
