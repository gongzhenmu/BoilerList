const express = require('express');
const router = express.Router();
const utils = require('utility');
const jwt = require('jsonwebtoken');

const userModel = require('../models/user');
//POST /LOGIN LOGIN REQUEST

router.post('/', (req,res,next) => {




    })

const postSchema = mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true}
});

module.exports = mongoose.model('Post',postSchema);
