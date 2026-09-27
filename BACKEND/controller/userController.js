const User = require("../models/User");

// Get customer profile
async function getProfile(req, res) {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Update customer profile & body measurements
async function updateProfile(req, res) {
  try {
    const { phone, address, measurements } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (phone !== undefined) user.phone = phone;
    if (address !== undefined) user.address = address;
    if (measurements !== undefined) {
      user.measurements = {
        ...user.measurements,
        ...measurements,
      };
    }

    await user.save();
    const updatedUser = await User.findById(req.user.id).select("-password");
    res.status(200).json({ message: "Profile updated successfully", user: updatedUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  getProfile,
  updateProfile,
};
