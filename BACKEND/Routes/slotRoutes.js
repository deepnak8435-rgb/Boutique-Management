const express = require("express");
const router = express.Router();
const {
  createSlot,
  getAllSlots,
  getSlotById,
  getSlotsByServiceId,
  generateSlotsEndpoint,
  getAllSlotsAdmin,
  deleteSlot,
} = require("../controller/slotController");
const { verifyToken, verifyAdmin } = require("../middleware/authMiddleware");

// Admin creates a slot
router.post("/", verifyToken, verifyAdmin, createSlot);
// Generate slots for service
router.post("/generate/:serviceId", generateSlotsEndpoint);
// Customer gets available slots
router.get("/", getAllSlots);
// Admin gets all slots (all dates, booked & available)
router.get("/admin/all", verifyToken, verifyAdmin, getAllSlotsAdmin);
// Customer gets available slots by service
router.get("/service/:serviceId", getSlotsByServiceId);
// Customer gets one slot
router.get("/:slotId", getSlotById);
// Admin deletes slot
router.delete("/:slotId", verifyToken, verifyAdmin, deleteSlot);

module.exports = router;