const mongoose = require('mongoose');

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
  orderType: {
    type: String,
    enum: ["confirmed", "7_day_hold"],
    default: "confirmed",
  },
  holdExpiresAt: {
    type: Date,
  },
  referenceImage: {
    type: String,
    default: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=800&q=80",
  },
  fabricName: {
    type: String,
    default: "Royal Chiffon Silk",
  },
  fabricDetails: {
    flow: { type: String, default: "Fluid & Soft Drape" },
    texture: { type: String, default: "Silky Smooth" },
    dyeable: { type: Boolean, default: true },
    careInstructions: { type: String, default: "Dry Wash Only" },
    suitableFor: { type: String, default: "Bridal & Partywear" },
  },
  selectedServices: [
    {
      name: { type: String },
      price: { type: Number },
    },
  ],
  status: {
    type: String,
    enum: ["pending", "confirmed", "cancelled", "on_hold"],
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
  advanceAmount: {
    type: Number,
    default: 500,
  },
  totalAmount: {
    type: Number,
    default: 1500,
  },
  remainingBalance: {
    type: Number,
    default: 1000,
  },
  advancePaid: {
    type: Boolean,
    default: false,
  },
  estimatedDeliveryDate: {
    type: Date,
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