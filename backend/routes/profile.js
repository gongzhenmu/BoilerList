const express = require('express');
const router = express.Router();

const userM = require('../models/user');
const postM = require('../models/post');
const favM = require('../models/favorite);
const checkAuth = require('../middleware/checkAuth');

router.post('/getOthers', checkAuth, (req, res) => {
    const data = req.body;
    try {
        if (data.username === '' || data.username == null) {
            res.status(400).send();
            return;
        }
    }
    catch (e) {
        res.status(400).send();
        return;
    }

    userM.findOne({username: req.body.username},(err, user) => {
        if (err) {
            console.log('the error is: ', err);
            res.status(500).send(err);
        }
        if (!user) {
            res.status(403).send('cannot find the user');
        } else {
            res.json(user);
        }
    })
});







module.exports = router;
