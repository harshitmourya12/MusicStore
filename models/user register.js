const mongoose = require("mongoose");

const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    username: {
        type:String,
        required:true
        
    },
    email: {
        type:String,    
        required:true
        
    },       
      
    password: {
        type:String,
        required:true

    },
    confirmpassword:{
        type:String,
        required:true
            
    },
    is_admin:{
        type:Number,
        required:true

    },
    is_verified:{
        type:Number,
        default:0
    },
    tokens:[{
        token:{
        type:String,
        required:true}
    }],
    poken:{
        type:String,
        default:''

    }
   

})


 
// Generating Tokens
userSchema.methods.generateAuthToken = async function(){
    try {
      console.log(this._id );
       const token = jwt.sign({_id:this._id.toString()},process.env.TOKEN_SECRET ,{expiresIn: "5m"});
   this.tokens = this.tokens.concat({token:token})
   await this.save();
   return token;

   } catch (error) {
      //  res.send("the error part" + error);
       console.log("the error part" + error);
   }
};


  //creating a database collection     
  module.exports  =  mongoose.model("User",userSchema,); 
  