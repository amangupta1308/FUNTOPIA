const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
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

const Service = new mongoose.model("Service", serviceSchema);

module.exports = Service;