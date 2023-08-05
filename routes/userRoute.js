
const express = require('express');
const user_route = express();
const User = require("../models/user register");
const verifyToken  = require("../middleware/auth");



const userController = require("../controllers/userController");
const auth = require('../middleware/auth');

user_route.get("/register",userController.loadregister);
user_route.post("/register",userController.insertUser);
user_route.get("/verify",userController.verifyMail);
 user_route.get("/Login",userController.loginLoad);
 user_route.post("/Login",userController.verifyLogin);
 user_route.get("/index",auth,userController.loadindex);
user_route.get("/secret",auth,userController.loadsecret);
user_route.get("/Logout",auth,userController.userLogout);
user_route.get("/forget",userController.forgetLoad);
user_route.post("/forget",userController.forgetverify);
user_route.get("/forget-password",userController.forgetPasswordLoad);
user_route.post("/forget-password",userController.resetPassword);
user_route.get("/flute",userController.fluteLoad);
user_route.get("/guitar",userController.guitarLoad);



module.exports = user_route;  

