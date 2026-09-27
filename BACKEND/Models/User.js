const mongoose =require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["customer", "admin"],
    default: "customer",
  },
  phone: {
    type: String,
    default: "",
  },
  address: {
    type: String,
    default: "",
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
});
module.exports = mongoose.model("User", userSchema);