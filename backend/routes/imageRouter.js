const express = require("express");
const fs = require("fs");
const uuidv4 = require('uuid/v4');
const router = express.Router();
const Image = require('../models/images');
const checkAuth = require("../middleware/checkAuth");

router.post('/Upload', (req, res) => {
  console.log('Upload your pictures: ', req.body[0].postID);
  Image.insertMany(req.body, function(err, data){
    if(err) {
      console.log('Upload image failed.', err);
      return res.status(400).send(err);
    } else {
      console.log('Upload image info success!');
      return res.status(200).send(data);
    }
  })
});

router.delete('/DeleteAll/:postID', (req, res) => {
  console.log('Delete all images of your post: ', req.params.postID);
  Image.deleteMany({ postID: req.params.postID}, function(err, data) {
    if(err) {
      console.log('Delete all images failed.', err);
      return res.status(400).send(err);
    } else {
      console.log('Delete images success!');
      return res.status(200).send(data);
    }
  })
});

router.delete('/DeleteOne/:imgID', (req, res) => {
  console.log(`Delete the ${req.params.imgID} image record`);
  Image.deleteMany({ _id: req.params.imgID }, function(err, data) {
    if(err) {
      console.log('Delete image failed.', err);
      return res.status(400).send(err);
    } else {
      console.log('Delete image success!');
      return res.status(200).send(data);
    }
  })
});
