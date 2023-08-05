 const User = require("../models/user register");
 const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const randomstring = require("randomstring");

const config = require("../config/config");



 const securePassword = async(password,confirmpassword)=> {
try {
    const passwordHash = await bcrypt.hash(password,10);
    return passwordHash;
} catch (error) {
    console.log(error);
}
 }


const sendVerifyMail = async(name,email,user_id)=> {
try {
   const transporter = nodemailer.createTransport({
        host:'smtp.gmail.com',
        port:25,
        secure:false,
        requireTLS:true,
        auth:{
            user:config.emailUser,
             pass:config.emailPassword
        }
    });
    const mailOptions = {
        from:config.emailUser,
        to:email,
        subject:'for verification mail',
        html:'<p>Hii '+name+',please click here to <a href = "http://localhost:3000/verify?id='+user_id+'"> Verify </a/ your mail.</p>'
    }
    transporter.sendMail(mailOptions,function(error,info){
            if (error) {
                console.log(error);
            } else {
                console.log("Email has been sent:-",info.response);
            }
    })
} catch (error) {
    console.log(error.message)
}   
}

//for reset password mail

const sendResetPasswordMail = async(name,email,token)=> {
    try {
       const transporter = nodemailer.createTransport({
            host:'smtp.gmail.com',
            port:25,
            secure:false,
            requireTLS:true,
            auth:{
                user:config.emailUser,
                 pass:config.emailPassword
            }
        });
        const mailOptions = {
            from:config.emailUser,
            to:email,
            subject:'for Reset Password',
            html:'<p>Hii '+name+',please click here to <a href = "http://localhost:3000/forget-password?token='+token+'"> Reset </a/ your password.</p>'
        }
        transporter.sendMail(mailOptions,function(error,info){
                if (error) {
                    console.log(error);
                } else {
                    console.log("Email has been sent:-",info.response);
                }
        })
    } catch (error) {
        console.log(error.message)
    }   
    }



const loadregister = async (req, res) => {
    try {
        res.render("users/registration",{
           
        });

    } catch (error) {
        console.log("error in user controller"); 

    }
}

const loadindex = async (req, res) => {
    try {
        res.render("users/index")
    } catch (error) {
        console.log("error in index controller"); 

    }
}
const loadsecret = async (req, res) => {
    try {
        res.render("users/secret");
    } catch (error) {
        console.log("error in index controller"); 

    }
}



const insertUser = async(req,res) => {
      try {       

    
        const alreadyExist = await User.findOne({email: req.body.email});

            if (alreadyExist) {
        
                console.log("userExist");   
                return res.status(409).render("users/registration");         
        };
               
         const spassword = await securePassword(req.body.password);
         
         const user = new User({
            username:req.body.username,
            email:req.body.email,
            // file:req.file.filename,
            password:spassword,
            confirmpassword:spassword,
            is_admin:0,
        }) ;   
      
           console.log("the success part" + user);
           const token  = await user.generateAuthToken()
           
           console.log("the token part" + token);

          const userData = await user.save();
         
     
          if(userData) {

            sendVerifyMail(req.body.username,req.body.email,userData._id); 
            res.render('users/Login',{message:"your registration has been done succesfully."});

          } else {
            
            res.render('users/registration',{message:"your registration has been failed"});
          }
    } catch (error) {
        console.log(error.message);
    }

}

const verifyMail = async(req,res) =>{
    try {
        const updateInfo = await User.updateOne({_id:req.query.id}, {$set:{is_verified:1}});
        console.log(updateInfo)
        res.render("users/email-verified")
    } catch (error) {
        console.log(error.message);
    }
}

// User login methods

const loginLoad = async(req,res)=>{
    try {
        res.render("users/Login");

    } catch (error) {
        console.log(error.message);
    }
} 

const verifyLogin = async(req,res)=> {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const userData = await User.findOne({email:email});

        if (userData) {
            const passwordMatch = await bcrypt.compare(password,userData.password)
          
          
            const token = await userData.generateAuthToken();
            console.log("the token part" + token);
            
             
            res.cookie("jwt",token, {
                expires:new Date(Date.now() + 60000),
                httpOnly:true
            });
        
                if (passwordMatch) {
                    if (userData.is_verified === 0) {
                        res.status(201).render("users/Login", {message: "please verify your mail."});
                    } else {
                        

                        res.status(201).render("users/index")
                    }
                } else {
                    res.render("users/Login",{message:"invalid login details"})
                    
                }


        }
    } catch (error) {
        console.log(error.message);
    }
}


const userLogout = async(req,res) => {
    try {
        req.user.tokens = req.user.tokens.filter((currElement) => {
            return currElement.token != req.token;  
        })
            res.clearCookie("jwt");
            console.log("logout successfully");
           
            await  req.user.save();
                res.render("users/Login");
        } catch (error) {
            res.status(500).send(error);
        }
        
    };

//forget passord load  code start

const forgetLoad =  async(req,res) => {
    try {
        res.render('users/forget')
    } catch (error) {
        console.log(error.message)
    }
}

const forgetverify = async(req,res) => {
    try {
        const email = req.body.email;
        const userData = await User.findOne({email:email});
        if (userData) {
           if (userData.is_verified === 0) {
            res.render("users/forget",{message:"please verify your mail."});
           } else {
            const randomString = randomstring.generate();
            const updatedData = await User.updateOne({email:email},{$set:{Token:randomString}});
            sendResetPasswordMail(userData.name,userData.email,randomString);
            res.render("users/forget",{message:"please check your mail to reset your password."});
           }
        } else {
            res.render("users/forget",{message:"users email is incorrect."});
        }
    } catch (error) {
       console.log(error.message)
    }
}
const forgetPasswordLoad = async(req,res) => {
    try {
        const poken  = req.query.poken
        const TokenData = await User.findOne({poken:poken});
        if (TokenData) {
           
            res.render("users/forget-password",{user_id:TokenData._id});
        } else {
            res.render("users/404",{message:"token is invalid"});
        }
    } catch (error) {
        console.log(error.message)
    }
}

const resetPassword =  async(req,res) =>{
 try {
    
    const password = req.body.password;
    const user_id = req.body.user_id;

    const secure_password = await securePassword(password);
    const updatedPassword = await User.findByIdAndUpdate({_id:user_id},{$set:{password:secure_password,poken:''}})
    res.render("users/Login")
} catch (error) {
        console.log(error.message)    
 }   
}


const fluteLoad = async(req,res) => {
    try {
        res.render("users/flute")
    } catch (error) {
        console.log(error.message);
    }
};

const guitarLoad = async(req,res) => {
    try {
        res.render("users/guitar")
    } catch (error) {
        console.log(error.message);
    }
}



module.exports = {
    loadregister,
    insertUser,
    loadindex,
    loadsecret,
    verifyMail,
    loginLoad,
    verifyLogin,
    userLogout,
    forgetLoad,
    forgetverify,
    forgetPasswordLoad,
    resetPassword,
    fluteLoad,
    guitarLoad 
};



