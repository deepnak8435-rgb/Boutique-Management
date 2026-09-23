const Service = require("../models/Service");

// Create Service
async function createService(req, res) {
  try {
    const { name, description, duration, price } = req.body;

    // Basic validation
    if (!name || !duration || price === undefined) {
      return res.status(400).json({
        error: "Name, duration and price are required",
      });
    }

    const newService = new Service({name, description, duration, price,});
    const savedService = await newService.save();
    res.status(201).json({
      message: "Service created successfully",
      service: savedService,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }}

// Get All Services
async function getAllServices(req, res) {
  try {
    const services = await Service.find();
    res.status(200).json(services);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }}

// Get Service By ID
async function getServiceById(req, res) {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ error: "Service not found" });
    res.status(200).json(service);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Update Service
async function updateService(req, res) {
  try {
    const { name, description, duration, price } = req.body;
    const updatedService = await Service.findByIdAndUpdate(
      req.params.id,
      { name, description, duration, price },
      { new: true, runValidators: true }
    );
    if (!updatedService) {
      return res.status(404).json({ error: "Service not found" });
    }
    res.status(200).json({
      message: "Service updated successfully",
      service: updatedService,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Delete Service
async function deleteService(req, res) {
  try {
    const deletedService = await Service.findByIdAndDelete(req.params.id);
    if (!deletedService) {
      return res.status(404).json({ error: "Service not found" });
    }
    res.status(200).json({ message: "Service deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  createService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService,
};