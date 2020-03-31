const mongoose = require("mongoose");

const imageSchema = mongoose.Schema({
  postID: {type: String, require: true},
  imageID: {type: String, require: false},
  imageData: {type: String, require: true},
  username: {type: String, require: false},
  visible: {type: String, require: false},
  imageURL: {type: String, require: false},
});

module.exports = mongoose.model("Image",imageSchema,'Image');
