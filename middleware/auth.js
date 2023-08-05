
 const jwt = require("jsonwebtoken");
const User = require("../models/user register");
// const config = process.env;

// const verifyToken = (req, res, next) => {
//   const token =
//     req.body.token || req.query.token || req.headers["x-access-token"];

//   if (!token) {
//     return res.status(403).send("A token is required for authentication");
//   }
//   try {
//     const decoded = jwt.verify(token, process.env.TOKEN_SECRET );
//     req.user = decoded;
//   } catch (err) {
//     return res.status(401).send("Invalid Token");
//   }
//   return next();
// };

// module.exports = verifyToken;
 


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
module.exports = auth


// const isLogin = async(req,res,next)=> {
//     try {
//        if (req.session.user_id) {
        
//        } else {
//         res.render("users/Login");
        
//        } 
//        next();
//     } catch (error) {
//         console.log(error.message);
//     }
// }


// const isLogout = async(req,res,next)=> {
//     try {
//         if(req.session.user_id){
//             res.render("users/index");
//         }
//         next();
//     } catch (error) {
//         console.log(error.message);
//     }
// }

// module.exports = {
//     isLogin,
//     isLogout
// }

