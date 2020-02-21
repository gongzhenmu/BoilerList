const express = require("express");
const Post = require('../models/post');
const router = express.Router();
const checkAuth = require('../middleware/checkAuth');

//add post to DB
router.post("", checkAuth,(req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    price: req.body.price,
    owner: req.body.owner
  });
  post.save().then(createdPost => {
    res.status(201).json({
      message: "Post added successfully",
      postId: createdPost._id
    });
  });
});




//get posts from DB
router.get('',checkAuth,(req, res, next) => {
  Post.find().then(documents => {
    res.status(200).json({
      message: 'post fetched',
      posts: documents
    });
  });
});

router.delete("/:id", checkAuth,(req, res, next) => {
  Post.deleteOne({ _id: req.params.id }).then(result => {
    console.log(result);
    res.status(200).json({ message: "Post deleted!" });
  });
});

module.exports = router;
