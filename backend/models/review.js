const mongoose = require("mongoose");

const review = mongoose.Schema(
    {
        sellername:{type: String, required: false},
        rate:{type: Number, default: 0},
        content:{type: String, required: false}

    }
);

module.exports = mongoose.model('review',review,'review');
