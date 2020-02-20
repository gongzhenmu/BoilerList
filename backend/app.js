const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const postRoutes = require("./routes/posts");
const registerRoutes =  require('./routes/register');

const cors = require("cors");

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
 app.use(cors());

 //--------------------------post----------------------
 app.use("/api/posts",postRoutes);

 //--------------------create account-------------------
 app.use('/api/register', registerRoutes);



module.exports = app;
