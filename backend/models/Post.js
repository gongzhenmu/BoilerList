const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
  createdAt: { type: Date, default: Date.now},
  username: {type: String, required: true},
  content: {type: String, required: true},
});
module.exports = mongoose.model("Post", postSchema, 'Post');
