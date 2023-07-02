const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    fname:{
        type: String,
        required: true
    },
    lname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    gender: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true,
        unique: true
    },
    age: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    conf_password: {
        type: String,
    },
    cart: [{
        sid: {
            type: Number
        },
        name: {
            type: String 
        },
        img_add: {
            type: String
        },
        cost: {
            type: Number
        },
        quantity: {
            type: Number
        },
        price: {
            type: Number
        },
        extra: {
            type: String
        }
    }],
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    t_price: {
        type: Number,
        default: 0,
    }
})

userSchema.methods.generateAuthToken = async function(){
    try{
        const curr_token = await jwt.sign({_id: this._id.toString()}, process.env.S_KEY);
        this.tokens = this.tokens.concat({token: curr_token});
        await this.save();
        return curr_token;
    } catch(e){
        res.send(e);
    }   
}

const User = new mongoose.model('User', userSchema);

module.exports = User;