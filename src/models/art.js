const mongoose = require('mongoose');

const artSchema = new mongoose.Schema({
    sid: {
        type: Number,
        unique: true
    },
    name: {
        type: String,
    },
    price: {
        type: Number
    },
    type: {
        type: String
    },
    desc: {
        type: String
    },
    img_add: {
        type: String
    }
})

const Art = new mongoose.model("Art", artSchema);

module.exports = Art;