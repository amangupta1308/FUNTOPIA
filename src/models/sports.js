const mongoose = require('mongoose');

const sportsSchema = new mongoose.Schema({
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

const Sport = new mongoose.model("Sport", sportsSchema);

module.exports = Sport;