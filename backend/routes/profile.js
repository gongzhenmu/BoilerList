const express = require('express');
const router = express.Router();
const utils = require('utility');

const userM = require('../models/user');
const Post = require('../models/post');

const checkAuth = require('../middleware/checkAuth');
const multer = require("multer");

const MIMIE_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
}

const avatar_storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIMIE_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if (isValid){
      error = null;
    }
    cb(error, "backend/images/avatar");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLocaleLowerCase().split(' ').join('-');
    const ext = MIMIE_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() + '.' + ext);
  }
});

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

//update post to DB
router.put("/update/:id", checkAuth, (req, res, next) => {
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    price: req.body.price,
    owner: req.body.owner,
    tags: req.body.tags,
    category: req.body.category,
    condition: req.body.condition,
    buyer:req.body.buyer,
    status: req.body.status,
    rated:req.body.rated,
    imageUrls: req.body.imageUrls,
    mainImage: req.body.mainImage
  });
  Post.updateOne({_id: req.params.id} , post).then(updatedPost => {
    console.log(updatedPost);
    res.status(201).json({
      message: "Post updated successfully",
      postId: updatedPost._id
    });
  });
});


//store profile avatar
router.post("/avatar-upload", multer({storage: avatar_storage}).single("image"), (req, res, next) => {
  const image_url = req.protocol + "://" + req.get("host");
  const username = req.body.username;
  const file = req.file;
  const imagePath = image_url + "/images/avatar/" + file.filename;
  if(!file){
    console.log(" no images");
  }
  else{
    console.log("image %s received", file.filename);
    userM.updateOne({username: username}, {avatarUrl: imagePath}, (err, user, next) => {
      if(err){
        console.log("error happened when updating user's avatar");
        res.status(500).send("query error");
      }
      else{
          res.status(200).json({
            message: "avatar stored sucessfully!",
            imagePath: imagePath
          });
      }
    })

  }


});


router.post("/verify",checkAuth, (req,res,next) => {

  const userData = req.body;
  userM.findOne({username: userData.username}, (err, user)=> {


    if (err) {
      console.log(err);
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




router.post('/rate',checkAuth,(req,res,next)=>{
  const userData=req.body;
  console.log("rate"+userData.rate);
  userM.findOneAndUpdate({username:userData.username},{$inc : {ratingCount:1, ratings:userData.rate}}).then(updatePost =>{
    res.status(200).send();
  })

});


router.post('/contactUpdate',checkAuth,(req,res,next)=>{
  const userData=req.body;
  console.log("contact here");
  userM.updateOne({username:userData.username},{contact:userData.contact}).then(updatePost =>{
      res.status(200).send();
  });

});








module.exports = router;
