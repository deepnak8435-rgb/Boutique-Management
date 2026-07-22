const { json } = require('express');
const jwt =require('jsonwebtoken');
// check that a valid token was sent 
function verifyToken(req,res,next){
    const authHeader =req.headers['authorization'];
    if(!authHeader){
        return res.status(401).json({
            error:"no token is provided"
        })
    }
  const token =authHeader.split("")[1];
   try{
const decoded =jwt.verify(token,process.env.JWT_SECRET)
req.user=decoded;
next();
   } catch(err){
    res.status(401).json({
        error:"invalid or expired token"
    })
   }
}
//    checks that the logged in user is an admin
function verifyAdmin(req,res,next){
    if(req.user.role!=="admin"){
        return res.status(403).json({
            error:"only admin can access"
        })
    }
    next();
}
    
module.exports={verifyToken,verifyAdmin};