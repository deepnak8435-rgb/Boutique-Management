const express = require("express");
const router = express.Router();
const {createSlot,getAllSlots,getSlotById,} = require("../controller/slotController");
const {verifyToken,verifyAdmin,} = require("../middleware/authMiddleware");

// Admin creates a slot
router.post( "/",verifyToken,verifyAdmin,createSlot);
// Customer gets available slots
router.get( "/", getAllSlots);
// Customer gets one slot
router.get( "/:slotId", getSlotById);
module.exports = router;