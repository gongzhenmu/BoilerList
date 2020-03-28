const express = require('express');
const router = express.Router();

const userM = require('../models/user');
const checkAuth = require('../middleware/checkAuth');

router.post('/findUser', checkAuth, (req, res) => {
  const data = req.body;
  try {
    if (data.username == null || data.username === '') {
      console.log('null body property');
      res.status(400).send();
      return;
    }
  }
  catch (e) {
    console.log('bad request');
    res.status(400).send();
    return;
  }

  userM.findOne({username: req.body}, (err, user) => {
    if(err) {
      res.status(500).send('query error');
    }
    if(!user){
      res.status(403).send('Could not find user');
    }
    else {
      console.log('The User is: ', user);
      res.status(200).send(user);
    }
  })

});

module.exports = router;
