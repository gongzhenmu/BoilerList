const express = require("express");
const Post = require('../models/post');
const router = express.Router();
const checkAuth = require('../middleware/checkAuth');
const multer = require("multer");
const fs = require("fs");

const MIMIE_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
}

const image_storage = multer.diskStorage({
  destination: (req, file, cb) => {

    const isValid = MIMIE_TYPE_MAP[file.mimetype];
    const new_directory = file.originalname.toLocaleLowerCase().split('-', 2).join('-');
    let error = new Error("Invalid mime type");
    var path = "backend/images/posts/" + new_directory + "/";
    if( !fs.existsSync(path)){
      fs.mkdirSync(path);
    }
    if (isValid){
      error = null;
    }
    cb(error, path);
  },
  filename: (req, file, cb) => {
    console.log("disk_storage: storing file: " + file.originalname);
    const name = file.originalname.toLocaleLowerCase().split('-')[1];
    const ext = MIMIE_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() + '-' + file.originalname.toLocaleLowerCase().split('-')[2].split('.')[0] + '.' + ext);
  }
});

router.post("", checkAuth, multer({storage: image_storage}).array("images", 9), (req,res,next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    price: req.body.price,
    owner: req.body.owner,
    tags: req.body.tags,
    category: req.body.category,
    condition: req.body.condition,
    status: req.body.status,
    viewCount: parseInt(req.body.viewCount),
    imageUrls: null,
    mainImage: " mainImage"
  });

  var imageUrls = new Array();
  const image_url = req.protocol + "://" + req.get("host");
  const files = req.files;
  if(!files){
    console.log("no file uploaded to backend");
  }
  else{
    for(let i = 0; i < files.length; i++){
      console.log(files[i].filename);
      const imagePath = image_url + "/images/posts/" + post.title + '-' + post.owner + "/"+ files[i].filename;
      imageUrls.push(imagePath);
    }
    var fileNums = files.length;
    while(fileNums <= 3){
      imageUrls.push(image_url + "/images/posts/default/bright4.jpg");
      fileNums++;
    }
  }
  post.imageUrls = imageUrls;
  post.mainImage = imageUrls[0];

  post.save().then(createdPost => {
    res.status(201).json({
      message: "Post added successfully",
      postId: createdPost._id,
      imageUrls: imageUrls,
      mainImage: imageUrls[0],
    });
  });
});

//add post to DB
// router.post("", checkAuth,(req, res, next) => {
//   console.log("adding posts: " + req.body);
//   const post = new Post({
//     title: req.body.title,
//     content: req.body.content,
//     price: req.body.price,
//     owner: req.body.owner,
//     tags: req.body.tags,
//     category: req.body.category,
//     condition: req.body.condition,
//     status: req.body.status,
//     viewCount: number(req.body.viewCount),
//     imageUrls: null,
//     mainImage: " mainImage"
//   });
//   console.log("tags:" + req.body.tags);
//   post.save().then(createdPost => {
//     res.status(201).json({
//       message: "Post added successfully",
//       postId: createdPost._id
//     });
//   });
// });

// add post images to DB
// router.post("/upload-images", multer({storage: image_storage}).array("images", 9), (req, res, next) => {
//   console.log("adding images to postid: " + req.body.test);
//   var imageUrls = new Array();
//   const image_url = req.protocol + "://" + req.get("host");
//   const postid = req.body.postid;
//   const files = req.files;
//   if(!files){
//     console.log("no file uploaded to backend");
//   }
//   else{
//     for(let i = 0; i < files.length; i++){
//       const imagePath = image_url + "/images/posts/" + postid + "/"+ files[i].filename;
//       imageUrls.push(imagePath);
//     }

//     Post.updateOne({_id: postid}, {imageUrls: imageUrls, mainImage: imageUrls[0]},(err, updatedPost) => {
//       if(err){
//         res.status.send("server error when uploading images");
//         return
//       }
//       else{
//         res.status(200).json({
//           message: "post images stored successfully",
//           imageUrls: imageUrls,
//           mainImage: imageUrls[0]
//         });
//       }
//     });

//   }

// });

//get posts from DB
router.get('',checkAuth,(req, res, next) => {
  Post.find().then(documents => {
    res.status(200).json({
      message: 'post fetched',
      posts: documents
    });
  });
});

//update post to DB
router.put("/:id",(req, res, next) => {
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    price: req.body.price,
    owner: req.body.owner,
    tags: req.body.tags,
    category: req.body.category,
    condition: req.body.condition,
    status: req.body.status,
    buyer:req.body.buyer,
    viewCount: req.body.viewCount,
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

//update mainImage
router.post("/updateMainImage", checkAuth, (req,res, next) => {
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    price: req.body.price,
    owner: req.body.owner,
    tags: req.body.tags,
    category: req.body.category,
    condition: req.body.condition,
    status: req.body.status,
    buyer:req.body.buyer,
    viewCount: req.body.viewCount,
    rated:req.body.rated,
    imageUrls: req.body.imageUrls,
    mainImage: req.body.mainImage
  });
  Post.updateOne({_id: req.params.id} , post).then(updatedPost => {
    console.log(updatedPost);
    res.status(201).json({
      message: "Post updated successfully",
    });
  });
})





router.delete("/:id", checkAuth,(req, res, next) => {
  Post.deleteOne({ _id: req.params.id }).then(result => {
    console.log(result);
    res.status(200).json({ message: "Post deleted!" });
  });
});

module.exports = router;
