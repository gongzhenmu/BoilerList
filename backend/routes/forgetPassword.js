const express = require("express");
const router = express.Router();
const nodemailer = require('nodemailer');
const utils = require('utility');
const User = require('../models/user');
var generator = require('generate-password');



const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'gzmcsproject@gmail.com',
    pass: 'cs407niubi'
  }
});

router.post('/findPassword', (req, res)=>{
  console.log('Try to find password for the user: ', req.body.email);
  User.findOne({ email: req.body.email },(err, user) =>{
    if(err){
      console.log('Find user failed.', err);
    } else if (!user) {
      console.log('Find user failed.');
      res.status(401).send('Cannot find user');
    } else {
      var password = generator.generate({
        length: 10,
        numbers: true
      });
      var encryptedPass = utils.md5(password, 'base64');
      User.updateOne({email: user.email}, {password:encryptedPass}, (err) => {
        if (err) {
          res.status(500).send('server error');
          return
        }
        res.status(200).send();

      });
      var mailOptions = {
        from: 'gzmcsproject@gmail.com',
        to: user.email,
        subject: 'password info --BoilerList',
        text: 'Your temporary password is: ' + encryptedPass + '\n'+'Please update you password as soon as possible'
      };
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          res.status(501).send();
        } else {
          console.log("sent");
          res.status(200).send();
        }
      });
    }
  })
});




module.exports = router;
