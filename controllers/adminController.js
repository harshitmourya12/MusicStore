const User = require("../models/user register")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");





const loadLogin = async (req, res) => {
    try {
        res.render("admin/Login");

    } catch (error) {
        console.log(error.message)
    }
}

  
const loginVerify = async (req, res) => {

    try {

        const email = req.body.email;
        const password = req.body.password;

        const userData = await User.findOne({ email: email });

        if (userData) {
            const passwordMatch = await bcrypt.compare(password, userData.password);

            const token = await userData.generateAuthToken();
            console.log("the token part" + token);

               
            res.cookie("jwt",token, {
                expires:new Date(Date.now() + 900000),
                httpOnly:true
            }); 
            

            if (passwordMatch) {
                if (userData.is_admin === 0) {
                    res.render("admin/Login", { message: "Please verify your mail" });

                }
                else {
                    res.redirect("/admin/home");
                }
            } else {
                res.render("admin/Login", {message: "invalid login details"})
                console.log("invalid login details");
            }

        } else {
            res.render("admin/Login", { message: "invalid login details" });
            console.log("invalid login details");
        }
    } catch (error) {
        console.log(error.message)
    }
}


const loadDashboad = async (req, res) => {
    try {
        const userData = await User.find({is_admin:0});
        res.render("admin/home",{users:userData});
    } catch (error) {
        console.log(error.message)
    }
}


const deleteUser = async(req,res)=> {
    try {
        const id = req.query.id;
       await User.deleteOne({_id:id});
        res.redirect("/admin/home")
    } catch (error) {
        console.log(error.message);
    }
}

const adminLogout = async(req,res) => {
    try {
        req.user.tokens = req.user.tokens.filter((currElement) => {
            return currElement.token != req.token;  
        })
            res.clearCookie("jwt");
            console.log("logout successfully");
           
            await  req.user.save();
                res.render("admin/Login");
        } catch (error) {
            res.status(500).send(error);
        }
        
    };


module.exports = {
    loadLogin,
    loginVerify,
    loadDashboad,
    deleteUser,
    adminLogout
}