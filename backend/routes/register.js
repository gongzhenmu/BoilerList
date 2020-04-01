const utility = require('utility');
const express = require('express');
const router = express.Router();

const userModel = require('../models/user');

router.post('/', (req, res, next) => {
  console.log('register request');
  //console.log(req.body);
  /* validation */
  try {
    if (!(req.body.username.length >= 2 &&
      req.body.username.length <= 30)) {
      console.log('register request exception 1');
      throw new Error('name length exception')
    }
  } catch (exception) {
    console.log('register request exception redirect');
    console.log(exception);
    res.status(400).redirect('/register');
    return
  }

  console.log('register request verification');
  //todo validation of http request body
  const newUser = new userModel();
  // newUser.firstName = req.body.firstName;
  // newUser.lastName = req.body.lastName;
  newUser.email = req.body.email;
  newUser.username = req.body.username;
  newUser.password = utility.md5(req.body.password, 'base64');
  newUser.ratings = 0;
  newUser.ratingCount = 0;


  let tempToken = req.body.username;
  tempToken.concat(req.body.password);
  newUser.token = utility.md5(tempToken, 'base64');
  //console.log(newUser);

  newUser.save((err) => {
    if (err) {
      console.log(err);
      res.status(500).send();
      return
    }

    console.log('new user created');
    res.status(201).send()
  })
});

router.post('/checkUsername', (req, res) => {
  console.log('check username availability');
  /* validation */
  try {
    if (req.body.username == null || req.body.username === '') {
      console.log('bad request');
      throw new Error()
    }
  } catch (exception) {
    console.log(exception);
    res.status(400).send('bad request');
    return;
  }

  userModel.findOne({username: req.body.username}, (err, user) => {
    if (err) {console.log('query failed'); res.status(500).send()}
    if (!user) {
      console.log('username not used');
      res.status(200).send();
      return
    }
    console.log('repeated username detected');
    res.status(403).send();
  })

});

router.post('/checkEmail', (req, res) => {
  console.log('check email availability');
  /* validation */
  try {
    if (req.body.email == null || req.body.email === '') {
      console.log('bad request');
      throw new Error()
    }
  } catch (exception) {
    console.log(exception);
    res.status(400).send('bad request');
    return;
  }

  userModel.findOne({email: req.body.email}, (err, user) => {
    if (err) {console.log('query failed'); res.status(500).send()}
    if (!user) {
      console.log('email not used');
      res.status(200).send();
      return
    }
    console.log('repeated email detected');
    res.status(403).send();
  })

});

module.exports = router;
