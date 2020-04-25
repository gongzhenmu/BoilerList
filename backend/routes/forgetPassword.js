const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require('../models/user');
const email = require("emailjs");
const jwt = require('jsonwebtoken');
const checkAuth = require("../middleware/checkAuth");
const utility = require('utility');

const server = email.server.connect({
  user: "",
  password: "",
  host: "",
  ssl: true
});

router.post('/findPassword', (req, res)=>{
  console.log('Try to find password for the user: ', req.body.username);
  User.findOne({ username: req.body.username },(err, user) =>{
    if(err){
      console.log('Find user failed.', err);
    } else if (!user) {
      console.log('Find user failed.');
      res.status(401).send('Cannot find user');
    } else {
      server.send({
        text: 'Your password is: ' + user.password,
        from: "",
        to: user.email,
        cc: "",
        subject: "BoilerList:Password Recovery Email",
      }, function(err, message) {
        if (err) {
          console.log('Send email failed.', err);
          res.status(200).send(err);
        } else {
          console.log('Send email success!');
          res.status(200).send(message);
        }
      });
    }
  })
});


router.post('/updatePassword', (req, res)=> {
  console.log('the header:', req.headers);
  User.updateOne(
    {
      username: req.body.username,
      password: req.body.oldPassword
    }, {
      password: req.body.newPassword

    },
    function(err, data){

      if(err) {
        console.log('update info failed.', err);
        return res.status(400).send(err);
      } else {
        console.log('update info success!');
        return res.status(200).send(data);
      }
    })
});


module.exports = router;
