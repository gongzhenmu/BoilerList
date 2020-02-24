const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const postRoutes = require("./routes/posts");
const registerRoutes =  require('./routes/register');
const loginRoutes = require('./routes/login');
const profileRoutes = require('./routes/profile');

const cors = require("cors");

const app = express();
const db = 'mongodb+srv://BoilerListAdmin:cs407project@boilerlist-pfb6u.mongodb.net/node-angular?retryWrites=true&w=majority';
mongoose.connect(db, {useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => {
    console.log('Connected to database!');
  })
  .catch(() => {
    console.log('Connection failed');
  });



 app.use(bodyParser.urlencoded({ extended: false }));
 app.use(bodyParser.json());
 app.use(cors());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, GET, DELETE, OPTIONS');
  next();
});

 //--------------------------post----------------------
 app.use("/api/posts",postRoutes);

 //--------------------create account-------------------
 app.use('/api/register', registerRoutes);
//--------------------login-------------------
app.use('/api/login', loginRoutes);

//----------------------profile------------------------
app.use('/api/profile', profileRoutes);


module.exports = app;
