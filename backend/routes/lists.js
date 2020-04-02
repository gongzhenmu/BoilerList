const express = require('express');
const router = express.Router();

const postM = require('../models/post');
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

//pengding
router.get("/pending",checkAuth,(req,res,next)=>{

  postM.find({
      $or:[{status: 'pending',owner: req.query.username},{status: 'pending',buyer: req.query.username}]
  }).then(documents=>{
    res.status(200).json({
      posts: documents
    });
  });
});





module.exports = router;






