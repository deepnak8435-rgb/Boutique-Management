const express =require("express");
const router=express.Router();
const {createBooking}=require("../controller/BookingController");
const {verifyToken}=require("../middleware/authMiddleware");
router.post("/",verifyToken,createBooking);
module.exports=router;