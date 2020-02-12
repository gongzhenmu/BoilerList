const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const Post = require('./models/post');

const app = express();
const db = 'mongodb+srv://BoilerListAdmin:cs407project@boilerlist-pfb6u.mongodb.net/node-angular?retryWrites=true&w=majority';
mongoose.connect(db, {useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => {
    console.log('Connectd to database!');
  })
  .catch(() => {
    console.log('Connection failed');
  });

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  next();
});

//add post to DB
app.post("/posts", (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });
  post.save().then(createdPost => {
    res.status(201).json({
      message: "Post added successfully",
      postId: createdPost._id
    });
  });
});




//get posts from DB
app.get('/posts',(req, res, next) => {
  Post.find().then(documents => {
    res.status(200).json({
      message: 'post fetched',
      posts: documents
    });
  });
});

app.delete("/posts/:id", (req, res, next) => {
  Post.deleteOne({ _id: req.params.id }).then(result => {
    console.log(result);
    res.status(200).json({ message: "Post deleted!" });
  });
});

module.exports = router;
