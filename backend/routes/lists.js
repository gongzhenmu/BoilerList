const express = require('express');
const router = express.Router();

const postM = require('../models/post');
const checkAuth = require('../middleware/checkAuth');
//purchase history
router.get("/purchasehistory",checkAuth,(req,res,next)=>{
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

//owner history
router.get("/soldhistory",checkAuth,(req,res,next)=>{
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





module.exports = router;






