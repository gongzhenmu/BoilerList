const express = require('express');
const router = express.Router();

const postM = require('../models/post');
const checkAuth = require('../middleware/checkAuth');
//purchase history
router.get("/purchased",checkAuth,(req,res,next)=>{
  const userData = req.body;
  postM.find({
      status: 'sold',
      buyer: userData.username
  }).then(documents=>{
    res.status(200).json({
      posts: documents
    });
  });
});

//sold history
router.get("/sold",checkAuth,(req,res,next)=>{
  const userData = req.body;
  postM.find({
      status: 'sold',
      owner: userData.username
  }).then(documents=>{
    res.status(200).json({
      posts: documents
    });
  });
});

//pengding
router.get("/pending",checkAuth,(req,res,next)=>{
  const userData = req.body;
  postM.find({
      $or:[{status: 'pending',owner: userData.username},{status: 'pending',buyer: userData.username}]
  }).then(documents=>{
    res.status(200).json({
      posts: documents
    });
  });
});





module.exports = router;






