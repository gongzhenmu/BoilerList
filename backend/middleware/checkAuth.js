const jwt = require("jsonwebtoken");
const userM = require('../models/user');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        jwt.verify(token, "secretKey");
        userM.findOne({token: token}, (err, user) => {
            if (err) {
                res.status(401).send('Invalid use!');
                return
            }
            if (!user) {
                res.status(401).send('User not found!');
                return
            }
            res.locals.username = user.username;
            console.log('the username is middleware', res.locals.username);
            next();
        });
    } catch (error) {
        res.status(401).send('Not authorized');
    }
};
