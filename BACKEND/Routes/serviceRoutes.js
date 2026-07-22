const express =require('express');
const service = require('../Models/Service');
const router =express.Router();
const {verifyToken,verifyAdmin}=require("../middleware/authMiddleware")

// create a new service 
router.post('/',verifyToken,verifyAdmin,async(req,res)=>{
    try{
        const newService=new service(req.body);
        const savedService=await newService.save();
        res.status(201).json(savedService)
    }catch(err){
        res.status(500).json({
            error:err.message
        })
    }
});

// read all services
router.get("/",async(req,res)=>{
    try{
        const services =await service.find();
        res.status(200).json(services)

    }catch(error){
        res.status(500).json({
            error:err.message
        })
    }
})

// update a service by ID
router.put("/:id",async(req,res)=>{
    try{
        const updatedService =await service.findByIdAndUpdate(req.params.id,req.body,{new:true});
        res.status(200).json(updatedService)

    }catch(err){
        res.status(500).json({
            error:err.message
        })
    }
})

// delete a service by id
router.delete("/:id",async(req,res)=>{
    try{
await service.findByIdAndDelete(req.params.id);
res.status(200).json({
    message:'service deleted '
})
    }catch(err){
res.status(500).json({
    error:err.message
})
    }
})
module.exports =router