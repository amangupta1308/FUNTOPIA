const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
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

const Food = new mongoose.model("Food", foodSchema);

module.exports = Food;