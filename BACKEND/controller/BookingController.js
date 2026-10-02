const Booking = require("../models/Booking");
const Slot = require("../models/Slot");
const User = require("../models/User");
const Service = require("../models/Service");

// Helper function to check if maximum daily booking capacity (10 bookings/day) is reached for a given slot date
async function checkDailyBookingCapacity(slotDate, excludeBookingId = null) {
  const dateObj = new Date(slotDate);
  const startOfDay = new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate(), 0, 0, 0, 0);
  const endOfDay = new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate(), 23, 59, 59, 999);

  const sameDaySlots = await Slot.find({ date: { $gte: startOfDay, $lte: endOfDay } });
  const sameDaySlotIds = sameDaySlots.map((s) => s._id);

  const query = {
    slot: { $in: sameDaySlotIds },
    status: { $ne: "cancelled" },
  };

  if (excludeBookingId) {
    query._id = { $ne: excludeBookingId };
  }

  const activeBookingsCount = await Booking.countDocuments(query);
  return {
    count: activeBookingsCount,
    isFull: activeBookingsCount >= 10,
  };
}

async function createBooking(req, res) {
  try {
    const { slotId, measurements, paymentMethod } = req.body;
    const slot = await Slot.findById(slotId).populate("service");
    if (!slot) return res.status(404).json({ error: "slot is not found" });
    if (slot.isBooked) return res.status(400).json({ error: "slot is already booked" });

    // Check per-day capacity limit (Max 10 bookings/day)
    const capacityInfo = await checkDailyBookingCapacity(slot.date);
    if (capacityInfo.isFull) {
      return res.status(400).json({
        error: "Daily boutique capacity (10 customers/day) reached for this date. Slot filling! Please select another date.",
      });
    }

    // Retrieve user measurements as default snapshot if not explicitly provided
    let bookingMeasurements = measurements;
    if (!bookingMeasurements) {
      const user = await User.findById(req.user.id);
      if (user && user.measurements) {
        bookingMeasurements = user.measurements;
      }
    }

    const slotDate = slot.date ? new Date(slot.date) : new Date();
    const estimatedDelivery = new Date(slotDate);
    estimatedDelivery.setDate(estimatedDelivery.getDate() + 7);

    const total = slot.service ? slot.service.price : 1500;
    const advance = 500;

    const newBooking = new Booking({
      customer: req.user.id,
      slot: slotId,
      orderType: "confirmed",
      status: "confirmed",
      garmentStatus: "pending",
      paymentMethod: paymentMethod || "cod",
      totalAmount: total,
      advanceAmount: advance,
      remainingBalance: Math.max(0, total - advance),
      advancePaid: true,
      estimatedDeliveryDate: estimatedDelivery,
      measurements: bookingMeasurements || {},
    });

    const savedBooking = await newBooking.save();
    slot.isBooked = true;
    await slot.save();
    res.status(201).json(savedBooking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Multi-Step Custom Design & Tailoring Order Submission
async function createCustomBooking(req, res) {
  try {
    const {
      slotId,
      manualDate,
      referenceImage,
      fabricName,
      fabricDetails,
      selectedServices,
      orderType, // "confirmed" or "7_day_hold"
      paymentMethod,
      advanceAmount,
      totalAmount,
      measurements,
    } = req.body;

    let slot = null;
    if (slotId) {
      slot = await Slot.findById(slotId).populate("service");
    }

    const defaultService = await Service.findOne();
    const defaultServiceId = defaultService ? defaultService._id : null;

    if (!slot && manualDate) {
      const chosenDateObj = new Date(manualDate);
      const startOfDay = new Date(chosenDateObj.getFullYear(), chosenDateObj.getMonth(), chosenDateObj.getDate(), 0, 0, 0, 0);
      const endOfDay = new Date(chosenDateObj.getFullYear(), chosenDateObj.getMonth(), chosenDateObj.getDate(), 23, 59, 59, 999);

      slot = await Slot.findOne({ date: { $gte: startOfDay, $lte: endOfDay }, isBooked: false }).populate("service");
      if (!slot) {
        slot = new Slot({
          service: defaultServiceId,
          date: chosenDateObj,
          startTime: "10:00 AM",
          endTime: "11:00 AM",
          isBooked: false,
        });
        await slot.save();
      }
    }

    if (!slot) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      slot = new Slot({
        service: defaultServiceId,
        date: tomorrow,
        startTime: "10:00 AM",
        endTime: "11:00 AM",
        isBooked: false,
      });
      await slot.save();
    }

    if (slot.isBooked && String(slot._id) !== String(slotId)) {
      // Create new open slot for user if existing is booked
      slot = new Slot({
        service: defaultServiceId,
        date: slot.date || new Date(),
        startTime: "11:00 AM",
        endTime: "12:00 PM",
        isBooked: false,
      });
      await slot.save();
    }

    // Check per-day capacity limit (Max 10 bookings/day)
    const capacityInfo = await checkDailyBookingCapacity(slot.date);
    if (capacityInfo.isFull) {
      return res.status(400).json({
        error: "Daily boutique capacity (10 customers/day) reached for this date. Slot filling! Please select another date.",
      });
    }

    let bookingMeasurements = measurements;
    if (!bookingMeasurements) {
      const user = await User.findById(req.user.id);
      if (user && user.measurements) {
        bookingMeasurements = user.measurements;
      }
    }

    const slotDate = slot.date ? new Date(slot.date) : new Date();
    const estimatedDelivery = new Date(slotDate);
    estimatedDelivery.setDate(estimatedDelivery.getDate() + 7);

    const isHold = orderType === "7_day_hold";
    const holdExpiry = isHold ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) : null;

    const total = Number(totalAmount) || (slot.service ? slot.service.price : 1500);
    const advance = isHold ? 0 : (Number(advanceAmount) || 500);
    const remaining = Math.max(0, total - advance);

    const newBooking = new Booking({
      customer: req.user.id,
      slot: slot._id,
      orderType: isHold ? "7_day_hold" : "confirmed",
      holdExpiresAt: holdExpiry,
      referenceImage: referenceImage || "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=800&q=80",
      fabricName: fabricName || "Royal Chiffon Silk",
      fabricDetails: fabricDetails || {
        flow: "Fluid & Soft Drape",
        texture: "Silky Smooth",
        dyeable: true,
        careInstructions: "Dry Wash Only",
        suitableFor: "Bridal & Partywear",
      },
      selectedServices: selectedServices || [],
      status: isHold ? "on_hold" : "confirmed",
      garmentStatus: "pending",
      paymentMethod: paymentMethod || "cod",
      advanceAmount: advance,
      totalAmount: total,
      remainingBalance: remaining,
      advancePaid: !isHold,
      estimatedDeliveryDate: estimatedDelivery,
      measurements: bookingMeasurements || {},
    });

    const savedBooking = await newBooking.save();
    slot.isBooked = true;
    await slot.save();

    res.status(201).json(savedBooking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Convert 7-Day Hold into Confirmed Order with Advance Payment
async function confirmHoldBooking(req, res) {
  try {
    const { bookingId } = req.params;
    const { paymentMethod, advanceAmount } = req.body;

    const booking = await Booking.findOne({ _id: bookingId, customer: req.user.id });
    if (!booking) return res.status(404).json({ error: "Booking on hold not found" });

    booking.orderType = "confirmed";
    booking.status = "confirmed";
    booking.paymentMethod = paymentMethod || booking.paymentMethod;
    const advance = Number(advanceAmount) || 500;
    booking.advanceAmount = advance;
    booking.remainingBalance = Math.max(0, booking.totalAmount - advance);
    booking.advancePaid = true;
    booking.holdExpiresAt = null;

    await booking.save();
    res.status(200).json({ message: "7-Day Hold order confirmed with advance payment!", booking });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Get Bookings for Currently Logged-in Customer
async function getUserBookings(req, res) {
  try {
    const userId = req.user.id || req.user._id;
    const bookings = await Booking.find({ customer: userId })
      .populate({
        path: "slot",
        populate: { path: "service" },
      })
      .sort({ createAt: -1 });

    const bookingsWithCount = await Promise.all(
      bookings.map(async (b) => {
        const bObj = b.toObject();
        if (b.slot && b.slot.date) {
          const d = new Date(b.slot.date);
          const startOfDay = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
          const endOfDay = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);

          const sameDaySlots = await Slot.find({ date: { $gte: startOfDay, $lte: endOfDay } });
          const sameDaySlotIds = sameDaySlots.map((s) => s._id);

          const count = await Booking.countDocuments({
            slot: { $in: sameDaySlotIds },
            status: { $ne: "cancelled" },
          });

          bObj.sameDayBookedCount = count || 1;
        } else {
          bObj.sameDayBookedCount = 1;
        }
        return bObj;
      })
    );

    res.status(200).json(bookingsWithCount);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Get All Bookings for Admin Overview
async function getAllBookings(req, res) {
  try {
    const bookings = await Booking.find()
      .populate("customer", "name email phone address measurements")
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

// Admin Update Booking Status (pending, confirmed, cancelled, on_hold)
async function updateBookingStatus(req, res) {
  try {
    const { bookingId } = req.params;
    const { status } = req.body;

    if (!["pending", "confirmed", "cancelled", "on_hold"].includes(status)) {
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
      .populate("customer", "name email phone address measurements")
      .populate({
        path: "slot",
        populate: { path: "service" },
      });

    res.status(200).json({ message: "Booking status updated", booking: updatedBooking });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Admin Update Garment Tailoring Status (pending, approved, stitching, ready_for_trial, completed)
async function updateGarmentStatus(req, res) {
  try {
    const { bookingId } = req.params;
    const { garmentStatus } = req.body;

    const validStatuses = ["pending", "approved", "stitching", "ready_for_trial", "completed"];
    if (!validStatuses.includes(garmentStatus)) {
      return res.status(400).json({ error: "Invalid garment status value" });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    booking.garmentStatus = garmentStatus;
    await booking.save();

    const updatedBooking = await Booking.findById(bookingId)
      .populate("customer", "name email phone address measurements")
      .populate({
        path: "slot",
        populate: { path: "service" },
      });

    res.status(200).json({ message: "Garment status updated", booking: updatedBooking });
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

    res.status(200).json({ message: "Booking cancelled successfully", booking });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Customer Reschedule / Edit Appointment Slot
async function rescheduleBooking(req, res) {
  try {
    const { bookingId } = req.params;
    const { newSlotId } = req.body;

    if (!newSlotId) {
      return res.status(400).json({ error: "New slot selection is required for rescheduling" });
    }

    const booking = await Booking.findOne({ _id: bookingId, customer: req.user.id });
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    if (booking.status === "cancelled") {
      return res.status(400).json({ error: "Cannot reschedule a cancelled booking" });
    }

    const newSlot = await Slot.findById(newSlotId).populate("service");
    if (!newSlot) {
      return res.status(404).json({ error: "New slot not found" });
    }

    if (newSlot.isBooked && String(newSlot._id) !== String(booking.slot)) {
      return res.status(400).json({ error: "Selected slot is already booked" });
    }

    // Check per-day capacity limit (Max 10 bookings/day) for new date excluding current booking
    const capacityInfo = await checkDailyBookingCapacity(newSlot.date, booking._id);
    if (capacityInfo.isFull) {
      return res.status(400).json({
        error: "Daily boutique capacity limit (10 customers/day) reached for this date. Please select another date.",
      });
    }

    // Free previous slot if changed
    if (booking.slot && String(booking.slot) !== String(newSlot._id)) {
      await Slot.findByIdAndUpdate(booking.slot, { isBooked: false });
    }

    // Reserve new slot
    newSlot.isBooked = true;
    await newSlot.save();

    // Calculate new estimated delivery date (+7 days from new slot date)
    const slotDate = newSlot.date ? new Date(newSlot.date) : new Date();
    const estimatedDelivery = new Date(slotDate);
    estimatedDelivery.setDate(estimatedDelivery.getDate() + 7);

    booking.slot = newSlot._id;
    booking.estimatedDeliveryDate = estimatedDelivery;
    await booking.save();

    const updatedBooking = await Booking.findById(booking._id).populate({
      path: "slot",
      populate: { path: "service" },
    });

    res.status(200).json({
      message: "Appointment slot rescheduled successfully!",
      booking: updatedBooking,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  createBooking,
  createCustomBooking,
  confirmHoldBooking,
  getUserBookings,
  getAllBookings,
  updateBookingStatus,
  updateGarmentStatus,
  cancelMyBooking,
  rescheduleBooking,
};