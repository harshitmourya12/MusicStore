const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");


const productSchema = new mongoose.Schema({
    user_id: {
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
        
    },
    
    username: {
        type:String,
        required:true    
        
    },
    
    address: {
        type:String,
        required:true
        
    },
    productname: {
        type:String,
        required:true
        
    },       
      
    description: {
        type:String,
        required:true

    },
    quantity:{
        type:Number,
        required:true
            
    },
    prize:{
        type:Number,
        required:true

    }
   

})


//Generating Tokens
productSchema.methods.generateAuthToken = async function(){
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

   module.exports  =  mongoose.model("Product",productSchema); 
