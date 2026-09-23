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
// Get Bookings for Currently Logged-in Customer
async function getUserBookings(req, res) {
  try {
    const bookings = await Booking.find({ customer: req.user.id })
      .populate({
        path: "slot",
        populate: { path: "service" },
      })
      .sort({ createAt: -1 });

    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Get All Bookings for Admin Overview
async function getAllBookings(req, res) {
  try {
    const bookings = await Booking.find()
      .populate("customer", "name email")
      .populate({
        path: "slot",
        populate: { path: "service" },
      })
      .sort({ createAt: -1 });

    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Admin Update Booking Status (pending, confirmed, cancelled)
async function updateBookingStatus(req, res) {
  try {
    const { bookingId } = req.params;
    const { status } = req.body;

    if (!["pending", "confirmed", "cancelled"].includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    booking.status = status;
    await booking.save();

    // If cancelled by admin, free up the slot
    if (status === "cancelled" && booking.slot) {
      await Slot.findByIdAndUpdate(booking.slot, { isBooked: false });
    }

    const updatedBooking = await Booking.findById(bookingId)
      .populate("customer", "name email")
      .populate({
        path: "slot",
        populate: { path: "service" },
      });

    res.status(200).json({ message: "Booking status updated", booking: updatedBooking });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Customer Cancel Booking
async function cancelMyBooking(req, res) {
  try {
    const { bookingId } = req.params;
    const booking = await Booking.findOne({ _id: bookingId, customer: req.user.id });

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    booking.status = "cancelled";
    await booking.save();

    if (booking.slot) {
      await Slot.findByIdAndUpdate(booking.slot, { isBooked: false });
    }

    res.status(200).json({ message: "Booking cancelled successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  createBooking,
  getUserBookings,
  getAllBookings,
  updateBookingStatus,
  cancelMyBooking,
};