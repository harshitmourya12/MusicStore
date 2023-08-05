const jwt = require("jsonwebtoken");
const User = require("../models/user register");





const auth = async (req,res,next) =>{
    try {
        const token = req.cookies.jwt;
        const verifyUser = jwt.verify(token, process.env.TOKEN_SECRET);
        console.log(verifyUser);
        
        const user = await User.findOne({_id:verifyUser._id})
        console.log(user);
       
        req.token = token;
        req.user = user;
        next();

         } catch (error) {
        res.status(401).send(error);
    }
}
module.exports = auth;