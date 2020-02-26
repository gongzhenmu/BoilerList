const express = require('express');
const router = express.Router();
const utils = require('utility');

const userM = require('../models/user');
const Post = require('../models/post');

const checkAuth = require('../middleware/checkAuth');


// router.post('/getOthers', checkAuth, (req, res) => {
//     const data = req.body;
//     try {
//         if (data.username === '' || data.username == null) {
//             res.status(400).send();
//             return;
//         }
//     }
//     catch (e) {
//         res.status(400).send();
//         return;
//     }

//get current user's uploaded posts from DB
router.get('', checkAuth, (req, res, next) =>{
  const current_user = req.body;
  console.log("getting my posts in profile for user: %s", req.query.username);
  Post.find({owner: req.query.username}).then(documents => {
    userM.findOne({username: req.query.username},(err, user) => {
      if (err) {
        console.log('the error is: ', err);
        res.status(500).send(err);
      }
      if (!user) {
        res.status(403).send('cannot find the user');
      } else {
        res.status(200).json({
          message: 'profile: post fetched',
          posts: documents,
          user: user
        });
      }
    })

  });
});

//delete post
router.delete("/delete/:id", checkAuth,(req, res, next) => {
  Post.deleteOne({ _id: req.params.id }).then(result => {
    console.log(result);
    res.status(200).json({ message: "Post deleted!" });
  });
});


router.post("/verify",checkAuth, (req,res,next) => {

  const userData = req.body;
  userM.findOne({username: userData.username}, (err, user)=> {


    if (err) {
      console.log('query err occurred');
      res.status(500).send('query error');
      return
   }

   if (utils.md5(userData.password, 'base64') !== user.password) {
    console.log("password verify failed , username: " + user.username);
    res.status(401).send('Invalid password entered!');
   }else{
    res.status(200).send();


   }

  });

});

router.post("/changePassword",checkAuth, (req,res,next) => {
  const userData = req.body;
  const encryptedPass = utils.md5(userData.password, 'base64');



  userM.findOne({username: userData.username}, (err, user)=> {


    if (err) {
      res.status(500).send('server error');
      return
    }

   if (encryptedPass !== user.password) {
    userM.updateOne({username: userData.username}, {password:encryptedPass}, (err) => {
      if (err) {
        res.status(500).send('server error');
        return
      }
      res.status(200).send();

    });

   }else{
    res.status(401).send('Please use another password!');
   }

  });





});










module.exports = router;
