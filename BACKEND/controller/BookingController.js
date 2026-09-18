const Booking=require("../models/Booking");
const Slot=require("../models/Slot");

async function createBooking(req,res){
    try{
const {slotId}=req.body;
const slot =await Slot.findById(slotId);
if (!slot) return res.status(404).json({
    error:"slot is not found"});
if(slot.isBooked) return res.status(400).json({error:"slot is already booked"})

    const newBooking =new Booking({
        customer:req.user.id,
        slot:slotId,
        status:"pending"
    })
const savedBooking=await newBooking.save();
slot.isBooked=true;
await slot.save();
res.status(201).json(savedBooking);

    }
    catch(err){
        res.status(500).json({error:err.message})
    }

}
module.exports={createBooking}