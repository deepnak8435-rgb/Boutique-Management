const Slot = require("../models/Slot");
const Service = require("../models/Service");
const Booking = require("../models/Booking");

// Helper function to calculate daily booked counts and attach capacity info
async function attachDailyCapacityToSlots(slots) {
  if (!slots || slots.length === 0) return [];

  const dateMap = {};
  for (const slot of slots) {
    if (!slot.date) continue;
    const d = new Date(slot.date);
    const dateKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    if (dateMap[dateKey] === undefined) {
      const startOfDay = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
      const endOfDay = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
      const daySlots = await Slot.find({ date: { $gte: startOfDay, $lte: endOfDay } });
      const daySlotIds = daySlots.map((s) => s._id);
      const count = await Booking.countDocuments({
        slot: { $in: daySlotIds },
        status: { $ne: "cancelled" },
      });
      dateMap[dateKey] = count;
    }}
  return slots.map((slot) => {
    const slotObj = slot.toObject ? slot.toObject() : { ...slot };
    if (slot.date) {
      const d = new Date(slot.date);
      const dateKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      const count = dateMap[dateKey] || 0;
      slotObj.dailyBookedCount = count;
      slotObj.dailyCapacity = 10;
      slotObj.isDayFull = count >= 10;
    } else {
      slotObj.dailyBookedCount = 0;
      slotObj.dailyCapacity = 10;
      slotObj.isDayFull = false; }
    return slotObj;
  });
}
// Helper function to auto-generate 3 default upcoming slots for a service
async function autoGenerateSlotsForServiceId(serviceId) {
  try {
    const service = await Service.findById(serviceId);
    if (!service) return [];
    const defaultTimeSlots = [
      { startTime: "10:00 AM", endTime: "11:30 AM", offsetDays: 1 },
      { startTime: "02:00 PM", endTime: "03:30 PM", offsetDays: 1 },
      { startTime: "05:00 PM", endTime: "06:30 PM", offsetDays: 2 },
    ];

    const slotsToInsert = defaultTimeSlots.map((ts) => {
      const slotDate = new Date();
      slotDate.setDate(slotDate.getDate() + ts.offsetDays);
      slotDate.setHours(0, 0, 0, 0);

      return { service: serviceId, date: slotDate, startTime: ts.startTime, endTime: ts.endTime, isBooked: false, };
    });

    const insertedSlots = await Slot.insertMany(slotsToInsert);
    return await Slot.find({ _id: { $in: insertedSlots.map((s) => s._id) } }).populate("service");
  } catch (err) {
    console.error("Error auto-generating slots:", err);
    return [];
  }
}

// Helper function to auto-generate default upcoming slots if database has no open slots
async function autoGenerateGeneralSlots() {
  try {
    const defaultService = await Service.findOne();
    const serviceId = defaultService ? defaultService._id : null;

    const timeFrames = [
      { startTime: "10:00 AM", endTime: "11:00 AM", offsetDays: 0 },
      { startTime: "11:30 AM", endTime: "12:30 PM", offsetDays: 0 },
      { startTime: "02:00 PM", endTime: "03:00 PM", offsetDays: 0 },
      { startTime: "04:00 PM", endTime: "05:00 PM", offsetDays: 0 },
      { startTime: "10:00 AM", endTime: "11:00 AM", offsetDays: 1 },
      { startTime: "02:00 PM", endTime: "03:00 PM", offsetDays: 1 },
      { startTime: "10:00 AM", endTime: "11:00 AM", offsetDays: 2 },
      { startTime: "02:00 PM", endTime: "03:00 PM", offsetDays: 2 },
    ];

    const slotsToInsert = timeFrames.map((tf) => {
      const d = new Date();
      d.setDate(d.getDate() + tf.offsetDays);
      d.setHours(0, 0, 0, 0);

      return {
        service: serviceId,
        date: d,
        startTime: tf.startTime,
        endTime: tf.endTime,
        isBooked: false,
      };
    });

    const inserted = await Slot.insertMany(slotsToInsert);
    return await Slot.find({ _id: { $in: inserted.map((s) => s._id) } }).populate("service");
  } catch (err) {
    console.error("Auto-generate slots error:", err);
    return [];
  }
}

// Create Slot (Admin)
async function createSlot(req, res) {
  try {
    const newSlot = new Slot(req.body);
    const savedSlot = await newSlot.save();
    const populatedSlot = await Slot.findById(savedSlot._id).populate("service");
    res.status(201).json(populatedSlot);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Get All Available Slots
async function getAllSlots(req, res) {
  try {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    let slots = await Slot.find({ isBooked: false, date: { $gte: startOfToday } })
      .populate("service")
      .sort({ date: 1 });

    if (slots.length === 0) {
      slots = await autoGenerateGeneralSlots();
    }

    const slotsWithCapacity = await attachDailyCapacityToSlots(slots);
    res.status(200).json(slotsWithCapacity);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Get Available Slots and Real-time Daily Capacity for a Specific Date
async function getSlotsByDate(req, res) {
  try {
    const { dateStr } = req.params;
    let chosenDateObj = new Date(dateStr);
    if (isNaN(chosenDateObj.getTime())) {
      chosenDateObj = new Date();
    }
    chosenDateObj.setHours(0, 0, 0, 0);

    const startOfDay = new Date(chosenDateObj.getFullYear(), chosenDateObj.getMonth(), chosenDateObj.getDate(), 0, 0, 0, 0);
    const endOfDay = new Date(chosenDateObj.getFullYear(), chosenDateObj.getMonth(), chosenDateObj.getDate(), 23, 59, 59, 999);

    let slots = await Slot.find({ date: { $gte: startOfDay, $lte: endOfDay }, isBooked: false }).populate("service");

    if (slots.length === 0) {
      const defaultService = await Service.findOne();
      const serviceId = defaultService ? defaultService._id : null;

      const defaultWindows = [
        { startTime: "10:00 AM", endTime: "11:00 AM" },
        { startTime: "11:30 AM", endTime: "12:30 PM" },
        { startTime: "02:00 PM", endTime: "03:00 PM" },
        { startTime: "04:00 PM", endTime: "05:00 PM" },
      ];

      const inserted = await Slot.insertMany(
        defaultWindows.map((w) => ({
          service: serviceId,
          date: chosenDateObj,
          startTime: w.startTime,
          endTime: w.endTime,
          isBooked: false,
        }))
      );
      slots = await Slot.find({ _id: { $in: inserted.map((s) => s._id) } }).populate("service");
    }

    const slotsWithCapacity = await attachDailyCapacityToSlots(slots);

    // Compute total active bookings count for this specific date
    const sameDayAllSlots = await Slot.find({ date: { $gte: startOfDay, $lte: endOfDay } });
    const sameDaySlotIds = sameDayAllSlots.map((s) => s._id);

    const activeBookingsCount = await Booking.countDocuments({
      slot: { $in: sameDaySlotIds },
      status: { $ne: "cancelled" },
    });

    res.status(200).json({
      date: dateStr,
      dailyBookedCount: activeBookingsCount,
      dailyCapacity: 10,
      isDayFull: activeBookingsCount >= 10,
      slots: slotsWithCapacity,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Get One Slot
async function getSlotById(req, res) {
  try {
    const { slotId } = req.params;
    const slot = await Slot.findById(slotId).populate("service");
    if (!slot) {
      return res.status(404).json({ error: "Slot not found" });
    }
    const [slotWithCapacity] = await attachDailyCapacityToSlots([slot]);
    res.status(200).json(slotWithCapacity);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Get Available Slots By Service ID (Auto-generates upcoming slots if none exist!)
async function getSlotsByServiceId(req, res) {
  try {
    const { serviceId } = req.params;

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    let slots = await Slot.find({
      service: serviceId,
      isBooked: false,
      date: { $gte: startOfToday },
    })
      .populate("service")
      .sort({ date: 1 });

    // If no future available slots exist for this service, auto-generate them!
    if (slots.length === 0) {
      slots = await autoGenerateSlotsForServiceId(serviceId);
    }

    const slotsWithCapacity = await attachDailyCapacityToSlots(slots);
    res.status(200).json(slotsWithCapacity);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Endpoint to explicitly trigger slot auto-generation for a service
async function generateSlotsEndpoint(req, res) {
  try {
    const { serviceId } = req.params;
    const slots = await autoGenerateSlotsForServiceId(serviceId);
    res.status(201).json({ message: "Slots generated successfully", slots });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Get All Slots for Admin (Booked & Available)
async function getAllSlotsAdmin(req, res) {
  try {
    const slots = await Slot.find().populate("service").sort({ date: 1 });
    res.status(200).json(slots);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Delete Slot
async function deleteSlot(req, res) {
  try {
    const { slotId } = req.params;
    const deletedSlot = await Slot.findByIdAndDelete(slotId);
    if (!deletedSlot) {
      return res.status(404).json({ error: "Slot not found" });
    }
    res.status(200).json({ message: "Slot deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  createSlot,
  getAllSlots,
  getSlotsByDate,
  getSlotById,
  getSlotsByServiceId,
  generateSlotsEndpoint,
  getAllSlotsAdmin,
  deleteSlot,
};
