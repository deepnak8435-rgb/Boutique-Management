const express =require("express");
const router=express.Router();
const {
  createBooking,
  getUserBookings,
  getAllBookings,
  updateBookingStatus,
  cancelMyBooking,
} = require("../controller/BookingController");
const { verifyToken, verifyAdmin } = require("../middleware/authMiddleware");

// Customer creates booking
router.post("/", verifyToken, createBooking);

// Customer views their own bookings
router.get("/my-bookings", verifyToken, getUserBookings);

// Customer cancels their booking
router.put("/cancel/:bookingId", verifyToken, cancelMyBooking);

// Admin gets all customer bookings
router.get("/admin/all", verifyToken, verifyAdmin, getAllBookings);

// Admin updates booking status
router.put("/admin/:bookingId/status", verifyToken, verifyAdmin, updateBookingStatus);

module.exports = router;