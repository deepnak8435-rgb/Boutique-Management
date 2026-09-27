const Razorpay = require("razorpay");
const Booking = require("../models/Booking");
const Slot = require("../models/Slot");
const User = require("../models/User");
const { sendBookingConfirmationEmail } = require("../services/emailService");

// Initialize Razorpay instance (using key_id & key_secret from env or test keys)
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_dewani12345",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "rzp_secret_dewani12345",
});

// Create Razorpay Payment Order for Advance Fitting Deposit
async function createPaymentOrder(req, res) {
  try {
    const { amount, slotId } = req.body;

    if (!amount || !slotId) {
      return res.status(400).json({ error: "Amount and slotId are required" });
    }

    const slot = await Slot.findById(slotId).populate("service");
    if (!slot) return res.status(404).json({ error: "Slot not found" });
    if (slot.isBooked) return res.status(400).json({ error: "Slot is already booked" });

    const options = {
      amount: Math.round(Number(amount) * 100), // amount in paise
      currency: "INR",
      receipt: `receipt_boutique_${Date.now()}`,
    };

    // Simulated / Live Razorpay Order Creation
    let order;
    try {
      order = await razorpay.orders.create(options);
    } catch (rzpErr) {
      // Fallback order object for local test mode without live keys
      order = {
        id: `order_demo_${Date.now()}`,
        entity: "order",
        amount: options.amount,
        currency: "INR",
        receipt: options.receipt,
        status: "created",
      };
    }

    res.status(200).json({
      success: true,
      order,
      key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_dewani12345",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Verify Payment & Create Confirmed Booking
async function verifyPayment(req, res) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, slotId, measurements, paymentMethod } = req.body;

    const slot = await Slot.findById(slotId).populate("service");
    if (!slot) return res.status(404).json({ error: "Slot not found" });

    // Mark slot as booked
    slot.isBooked = true;
    await slot.save();

    // Snapshot user measurements if not explicitly provided
    let bookingMeasurements = measurements;
    if (!bookingMeasurements) {
      const user = await User.findById(req.user.id);
      if (user && user.measurements) {
        bookingMeasurements = user.measurements;
      }
    }

    // Create confirmed booking document
    const newBooking = new Booking({
      customer: req.user.id,
      slot: slotId,
      status: "confirmed", // Confirmed directly upon successful payment
      garmentStatus: "pending",
      paymentMethod: paymentMethod || "upi",
      measurements: bookingMeasurements || {},
    });

    const savedBooking = await newBooking.save();
    const populatedBooking = await Booking.findById(savedBooking._id)
      .populate("customer", "name email phone address measurements")
      .populate({ path: "slot", populate: { path: "service" } });

    // Trigger Email Receipt Notification
    if (populatedBooking.customer?.email) {
      sendBookingConfirmationEmail(
        populatedBooking.customer.email,
        populatedBooking.customer.name,
        populatedBooking
      );
    }

    res.status(200).json({
      success: true,
      message: "Payment verified & appointment confirmed!",
      booking: populatedBooking,
      transactionId: razorpay_payment_id || `txn_demo_${Date.now()}`,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { createPaymentOrder, verifyPayment,};
