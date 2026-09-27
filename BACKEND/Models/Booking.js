const mongoose =require('mongoose');
const bookingSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  slot: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Slot",
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "confirmed", "cancelled"],
    default: "pending",
  },
  garmentStatus: {
    type: String,
    enum: ["pending", "approved", "stitching", "ready_for_trial", "completed"],
    default: "pending",
  },
  paymentMethod: {
    type: String,
    enum: ["upi", "card", "cod"],
    default: "cod",
  },
  measurements: {
    bust: { type: String, default: "" },
    waist: { type: String, default: "" },
    hips: { type: String, default: "" },
    shoulder: { type: String, default: "" },
    sleeveLength: { type: String, default: "" },
    garmentLength: { type: String, default: "" },
    notes: { type: String, default: "" },
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model("Booking", bookingSchema);