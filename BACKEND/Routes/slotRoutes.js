const express = require("express");
const router = express.Router();
const Slot = require("../Models/Slot");

// CREATE a slot (admin adds availability).
router.post("/", async (req, res) => {
  try {
    const newSlot = new Slot(req.body);
    const savedSlot = await newSlot.save();
    res.status(201).json(savedSlot);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

// READ all AVAILABLE slots ,with full service info attached
router.get("/",async(req,res)=>{
    try{
const slots=await Slot.find({isBooked:false}).populate("service")
res.status(200).json(slots)
    }
    catch(err){
        error:err.message
    }
})
module.exports=router;