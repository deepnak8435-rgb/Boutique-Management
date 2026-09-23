const Slot = require("../models/Slot");
const Service = require("../models/Service");

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

      return {
        service: serviceId,
        date: slotDate,
        startTime: ts.startTime,
        endTime: ts.endTime,
        isBooked: false,
      };
    });

    const insertedSlots = await Slot.insertMany(slotsToInsert);
    return await Slot.find({ _id: { $in: insertedSlots.map((s) => s._id) } }).populate("service");
  } catch (err) {
    console.error("Error auto-generating slots:", err);
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
    const slots = await Slot.find({ isBooked: false }).populate("service");
    res.status(200).json(slots);
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
    res.status(200).json(slot);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Get Available Slots By Service ID (Auto-generates if none exist!)
async function getSlotsByServiceId(req, res) {
  try {
    const { serviceId } = req.params;
    let slots = await Slot.find({ service: serviceId, isBooked: false }).populate("service");

    // If no available slots exist for this service, auto-generate them!
    if (slots.length === 0) {
      slots = await autoGenerateSlotsForServiceId(serviceId);
    }

    res.status(200).json(slots);
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
  getSlotById,
  getSlotsByServiceId,
  generateSlotsEndpoint,
  getAllSlotsAdmin,
  deleteSlot,
};
