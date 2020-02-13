const express = require('express');
const router = express.Router();

const userM = require('../models/user');
const postM = require('../models/post');

    userM.findOne({username: req.body.username},(err, user) =>{
    if(err) {

    }
    if(!user){

    }
    else{

    }

});







module.exports = router;
