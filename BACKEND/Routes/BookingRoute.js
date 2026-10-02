const express = require("express");
const router = express.Router();
const {
  createBooking,
  createCustomBooking,
  confirmHoldBooking,
  getUserBookings,
  getAllBookings,
  updateBookingStatus,
  updateGarmentStatus,
  cancelMyBooking,
  rescheduleBooking,
} = require("../controller/BookingController");
const { verifyToken, verifyAdmin } = require("../middleware/authMiddleware");

// Customer creates standard booking
router.post("/", verifyToken, createBooking);

// Customer submits multi-step custom design & tailoring order
router.post("/custom-order", verifyToken, createCustomBooking);

// Customer converts a 7-Day Hold into a confirmed order with advance payment
router.put("/confirm-hold/:bookingId", verifyToken, confirmHoldBooking);

// Customer views their own bookings
router.get("/my-bookings", verifyToken, getUserBookings);

// Customer reschedules their appointment slot
router.put("/reschedule/:bookingId", verifyToken, rescheduleBooking);

// Customer cancels their booking
router.put("/cancel/:bookingId", verifyToken, cancelMyBooking);

// Admin gets all customer bookings
router.get("/admin/all", verifyToken, verifyAdmin, getAllBookings);

// Admin updates appointment booking status
router.put("/admin/:bookingId/status", verifyToken, verifyAdmin, updateBookingStatus);

// Admin updates garment stitching/tailoring status
router.put("/admin/:bookingId/garment-status", verifyToken, verifyAdmin, updateGarmentStatus);

module.exports = router;