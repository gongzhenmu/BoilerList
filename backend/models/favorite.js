const mongoose = require("mongoose");

const favorite = mongoose.Schema(
    {
        favByUserName: {type: String},
        favUserName: {type: String},
        numOfLike: {type: Int16Array}
    }
);

module.exports = mongoose.model('favorite',favorite,'favorite');
