const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ["Sarees", "Lehengas", "Custom Gowns", "Blouse Designs", "Designer Suits", "Fabrics", "Accessories", "Reference Models"],
    default: "Sarees",
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
  },
  image: {
    type: String,
    default: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80",
  },
  fabric: {
    type: String,
    default: "Silk",
  },
  // Rich Fabric & Material Specifications
  fabricType: {
    type: String,
    default: "Pure Silk",
  },
  flow: {
    type: String,
    default: "Fluid & Soft Drape",
  },
  texture: {
    type: String,
    default: "Silky Smooth",
  },
  dyeable: {
    type: Boolean,
    default: true,
  },
  careInstructions: {
    type: String,
    default: "Dry Wash Only",
  },
  suitableFor: {
    type: String,
    default: "Bridal & Partywear",
  },
  isReferenceModel: {
    type: Boolean,
    default: false,
  },
  stock: {
    type: Number,
    default: 10,
  },
  featured: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Product", productSchema);
