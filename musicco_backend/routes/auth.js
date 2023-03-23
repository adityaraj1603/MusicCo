const express=require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt=require("bcrypt");
const {getToken}=require("../utils/helpers");

router.post("/register", async(req,res)=>{
   
   const {email , password , username , firstName, lastName} = req.body;
   const user = await User.findOne({email: email});
   if(user){
   return res.status(403).json({error:"This email is already in use"});
   }
   const hashedPassword= bcrypt.hash(password,10);
  //  console.log("ABC");
   const newUserData =  { 
     email,
     password:hashedPassword,
     username,
     firstName, 
     lastName,  
    };
    const newUser= await User.create(newUserData);
    const token=await getToken(email,newUser);
    
    const userToReturn={...newUser.toJSON(), token};
    delete userToReturn.password ;
    return res.status(200).json(userToReturn);
});  


router.post("/login", async(req,res)=>{
    const {email,password} = req.body;
    const user = await User.findOne({email:email});
    if(!user){
      return res.status(403).json({err:"Invalid Credentials"});
    }

    const isPasswordValid = await bcrypt.compare(password,user.password);
    
    if(!isPasswordValid){
      return res.status(403).json({err:"Invalid Credentials"});
    }
    const token=await getToken(user.email,user);
    const userToReturn={...user.toJSON(), token};
    delete userToReturn.password ;
    return res.status(200).json(userToReturn);
});

// console.log("abc");
module.exports = router; 