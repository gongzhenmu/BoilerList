const express = require('express');
const router = express.Router();
const checkAuth = require("../middleware/checkAuth");
const userModel = require("../models/user");

router.post('/getTags', checkAuth, (req, res)  => {
  console.log("Fetching tags");
  userModel.findOne({username: res.locals.username}, (err, user) => {
    if (err) {
      console.log(err);
      res.status(500).send("Could not found user");
      return;
    }
    if (!user) {
      res.status(403).send("Could not found user");
      return;
    }
    console.log(user.userTags);
    res.status(200).send(Array.from(user.userTags))
  });

});

module.exports = router;
