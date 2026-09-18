const express=require("express");
const router=express.Router();
const {createService,getAllServices}=require("../controller/serviceController")
const {verifyToken,verifyAdmin}=require("../middleware/authMiddleware")
router.post("/",verifyToken,verifyAdmin,createService);
router.get("/",getAllServices);
module.exports=router;