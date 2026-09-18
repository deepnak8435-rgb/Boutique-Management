const Slot = require("../models/Slot");
// Create Slot
async function createSlot(req, res) {
  try {
    const newSlot = new Slot(req.body);
    const savedSlot = await newSlot.save();
    res.status(201).json(savedSlot);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }}
// Get All Available Slots
async function getAllSlots(req, res) {
  try {
    const slots = await Slot.find({
      isBooked: false,
    }).populate("service");
    res.status(200).json(slots);
  } catch (err) {
    res.status(500).json({ error: err.message,});
  }}
// Get One Slot
async function getSlotById(req, res) {
  try {
    const { slotId } = req.params;
    const slot = await Slot.findById(slotId).populate("service");
    if (!slot) {
      return res.status(404).json({ error: "Slot not found", });
    }
    res.status(200).json(slot);
  } catch (err) {
    res.status(500).json({
      error: err.message,});
  }}
module.exports = { createSlot, getAllSlots, getSlotById,};
