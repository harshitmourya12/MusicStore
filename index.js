require("dotenv").config();
const mongoose = require("mongoose");

 mongoose.connect("mongodb://localhost:27017/Ecomm",{
     useNewUrlParser:true,
     useUnifiedTopology:true,
    
 }) .then(() => {
    console.log(`connection sucessfull`);
}).catch((e) => {
    console.log(e)   

     
});

const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const ejs = require("ejs");



const config = require("./config/config");

const static_path = path.join(__dirname + "/public");  
app.use(express.static(static_path));


const views_path = path.join(__dirname,"/views");
app.set("view engine","ejs");
app.set("views",views_path); 



app.use(cors());
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
 app.use(cookieParser());




  //for userRoute
const userRoute = require("./routes/userRoute");
 app.use("/",userRoute);


 //for adminRoute
 const adminRoute = require("./routes/adminRoute");
 app.use("/admin",adminRoute);
 
//for cartRoute

const cartRoute = require("./routes/cartRoute");
app.use("/cart/",cartRoute);

app.listen(3000,function(){ 
    console.log("server is running");
});