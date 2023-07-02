const jwt = require('jsonwebtoken');
const User = require('../models/customer');

const auth = async (req, res, next) => {
    try{
        const curr_token = req.cookies.jwt;
        const verifyToken = await jwt.verify(curr_token, process.env.S_KEY);
        const customerDetails = await User.findOne({_id: verifyToken._id});
        req.token = curr_token;
        req.user = customerDetails;
        next();
    } catch(e) {
        res.status(401).send(e);
    }
}

module.exports = auth;