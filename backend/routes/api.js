const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const db = "mongodb+srv://BoilerListAdmin:cs407project@boilerlist-pfb6u.mongodb.net/test?retryWrites=true&w=majority";

mongoose.set('useCreateIndex', true);
mongoose.connect(db,{ useNewUrlParser: true,  useUnifiedTopology: true  });
mongoose.connection.on("error", function (error) {
  console.log("Fail to connect to mongoDB.", error);
});
mongoose.connection.on("open", function () {
  console.log("Connected to mongoDB!");
});

/* -------------------- authentication part ----------------- */

/* ---- /api/login ---- */
router.use('/login', require('./login'));
/* ---- /api/register ---- */
router.use('/register', require('./register'));




module.exports = router;
