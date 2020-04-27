const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const postRoutes = require("./routes/posts");
const registerRoutes =  require('./routes/register');
const loginRoutes = require('./routes/login');
const profileRoutes = require('./routes/profile');
const tagsRoutes = require('./routes/tags');
const findUserRoutes = require('./routes/findUser');
const search = require('./routes/search');
const forgetPassword = require('./routes/forgetPassword');


const lists = require('./routes/lists');
const path = require("path");

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
 app.use("/images", express.static(path.join("backend/images")));
//  app.use("/", express.static(path.join(__dirname, "angular")));


// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, GET, DELETE, OPTIONS');
//   next();
// });

 //--------------------------post----------------------
 app.use("/api/posts",postRoutes);

 //--------------------create account-------------------
 app.use('/api/register', registerRoutes);
//--------------------login-------------------
app.use('/api/login', loginRoutes);

//----------------------profile------------------------
app.use('/api/profile', profileRoutes);
//----------------------tags------------------------
app.use('/api/tags', tagsRoutes);
//----------------------tags------------------------
app.use('/api/findUser', findUserRoutes);
//-----------------------------------------
app.use('/api/lists',lists);
//---------------------------------
app.use('/api/search',search);
//--------forgetpassword
app.use('/api/forgetPassword',forgetPassword);




// app.use((req, res, next) => {
//   res.sendFile(path.join(__dirname, "angular", "index.html"));
// });



module.exports = app;
