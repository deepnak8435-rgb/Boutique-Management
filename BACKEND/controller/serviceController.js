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

module.exports = { createService, getAllServices,};