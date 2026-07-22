const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../Models/User");

// singup
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // check if the user is exist
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        error: "email already registered",
      });
    }
    // encrypt the password
    const salt = await bcrypt.genSalt(10);
    console.log(password);
    
    const hashedPassword = await bcrypt.hash(password, salt);
 console.log(hashedPassword);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: role || "customer",
    });
    const savedUser = await newUser.save();
    res.status(201).json({
      message: "user created ",
      userId: savedUser,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

// login
router.post("/login",async(req,res)=>{
    try{
        const {email,password}=req.body;
        const user =await User.findOne({email});
        if(!user){
            return res.status(400).json({
                error:"Invalid email or password"
            })
        }
        const isMatch=await bcypt.compare(password,user.password)
        if(!isMatch){
            return res.status(400).json({
                error:"Invalid email or password"
            })
        }
        // create a token containing the user's id and role 
        const token=jwt.sign({
            id:user._id,
            role:user.role
        },process.env.JWT_SECRET,{expiresIn:"7d"})
res.status(200).json({
    token,
    user:{id:user.id,name:user.name,role:user.role}
})
    }catch(err){
        res.status(500).json({
            error:err.message
        })
    }
});
module.exports=router;