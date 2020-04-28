const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");

const postM = require('../models/post');
const userM = require('../models/user');
const checkAuth = require('../middleware/checkAuth');
//purchase history
router.get("/purchased",checkAuth,(req,res,next)=>{
  console.log("asking for purchase");
  console.log(req.query.username);
  postM.find({
      status: 'sold',
      buyer: req.query.username
  }).then(documents=>{
    res.status(200).json({
      posts: documents
    });
  });
});

//sold history
router.get("/sold",checkAuth,(req,res,next)=>{

  postM.find({
      status: 'sold',
      owner: req.query.username
  }).then(documents=>{
    res.status(200).json({
      posts: documents
    });
  });
});

//pending
router.get("/pending",checkAuth,(req,res,next)=>{

  postM.find({
      $or:[{status: 'pending',owner: req.query.username},{status: 'pending',buyer: req.query.username}]
  }).then(documents=>{
    res.status(200).json({
      posts: documents
    });
  });
});



//-------favorite list -----------
router.post("/addfavorite",(req,res,next)=>{

  userM.updateOne({username:req.body.username},
    { $addToSet: { userFavorites: mongoose.Types.ObjectId(req.body.postId) }}
  ).then(documents=>{
    res.status(200).send();
  });
});


//-------favorite list -----------
router.get("/favoriteList",(req,res,next)=>{
  // const username = req.body.username;
  userM.findOne({username:req.query.username})
  .then(documents=>{
    postM.find(
      {_id:{ $in: documents.userFavorites}}
    ).then(posts=>{
      res.status(200).json({
        posts:posts
      });
  });
});
});





module.exports = router;
