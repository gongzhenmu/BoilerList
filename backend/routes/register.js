const utility = require('utility');
const express  = require('express');
const router = express.Router();
const userM = require('../models/user');

router.post('/', (req, res, next) => {
    console.log('register request');
    //register username request
    try {
        if (!(req.body.username.length >= 2 &&
            req.body.username.length <= 30)) {
            console.log('register request exception 1');
            throw new Error('name length exception')
        }
    } catch (exception) {
        console.log('register request exception redirect');
        console.log(exception);
        res.status(400).redirect('/register');
        return
    }
});
console.log('verification register');
//http request body verification



module.exports = router;
