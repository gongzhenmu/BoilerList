const mongoose = require('mongoose');

const postSchema = mongoose.Schema({

  postID:{type: String, required: false},
  title: { type: String, required: true },
  content: { type: String, required: true},
  price: { type: String, required: true},
  owner: { type: String, required: false},
  tags: {type: [String]},
  createdTime:{type: Date, default: Date.now},
  likedBy: {type: String},

  //username: {type: String}
  /*createdDate:{type: Date, required: true},
  userId: {type: String, required: true},
  status: {type: String, required: true},


  image: {type: String},
  favourite: {type: String},

  numOfLike: {type: Int16Array},*/
});

module.exports = mongoose.model('Post',postSchema,'Post');
