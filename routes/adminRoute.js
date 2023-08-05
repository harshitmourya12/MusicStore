
const express = require("express");
const admin_route = express();
const User = require("../models/user register");

const auth = require('../middleware/auth');






const adminController = require("../controllers/adminController");


admin_route.get("/Login",adminController.loadLogin);
admin_route.post("/Login",adminController.loginVerify);
admin_route.get("/home",auth,adminController.loadDashboad);
admin_route.get("/delete-user",auth,adminController.deleteUser);
admin_route.get("/logout",auth,adminController.adminLogout);



// admin_route.get("*",function(req,res) {
//     res.redirect("/admin")
// })

module.exports = admin_route;