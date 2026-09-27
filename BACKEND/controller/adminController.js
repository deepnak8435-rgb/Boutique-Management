const User = require("../models/User");
const Product = require("../models/Product");
const Service = require("../models/Service");
const Slot = require("../models/Slot");
const Booking = require("../models/Booking");

// Get Unified Admin Dashboard Overview Statistics using MongoDB Aggregation Pipelines
async function getDashboardStats(req, res) {
  try {
    const [
      totalProducts,
      totalServices,
      totalSlots,
      totalUsers,
      allBookings,
      productCategoryStats,
      bookingStatusStats,
    ] = await Promise.all([
      Product.countDocuments(),
      Service.countDocuments(),
      Slot.countDocuments(),
      User.countDocuments(),
      Booking.find()
        .populate("customer", "name email")
        .populate({
          path: "slot",
          populate: { path: "service" },
        })
        .sort({ createAt: -1 }),

      // MongoDB Aggregation Pipeline 1: Group products by Category
      Product.aggregate([
        {
          $group: {
            _id: "$category",
            count: { $sum: 1 },
            avgPrice: { $avg: "$price" },
          },
        },
        { $sort: { count: -1 } },
      ]),

      // MongoDB Aggregation Pipeline 2: Group bookings by Status
      Booking.aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ]),
    ]);

    const pendingBookings = allBookings.filter(
      (b) => b.status === "pending",
    ).length;
    const confirmedBookings = allBookings.filter(
      (b) => b.status === "confirmed",
    ).length;
    const cancelledBookings = allBookings.filter(
      (b) => b.status === "cancelled",
    ).length;

    const totalRevenue = allBookings
      .filter((b) => b.status === "confirmed")
      .reduce((sum, b) => sum + (b.slot?.service?.price || 0), 0);

    res.status(200).json({
      totalProducts,
      totalServices,
      totalSlots,
      totalUsers,
      totalBookings: allBookings.length,
      pendingBookings,
      confirmedBookings,
      cancelledBookings,
      totalRevenue,
      recentBookings: allBookings.slice(0, 5),
      analytics: {
        productCategoryStats,
        bookingStatusStats,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Get All Users (Admin)
async function getAllUsers(req, res) {
  try {
    const users = await User.find().select("-password").sort({ _id: -1 });
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Update User Role (Admin)
async function updateUserRole(req, res) {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!["customer", "admin"].includes(role)) {
      return res.status(400).json({ error: "Invalid role value" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true },
    ).select("-password");

    if (!updatedUser) return res.status(404).json({ error: "User not found" });

    res
      .status(200)
      .json({ message: "User role updated successfully", user: updatedUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Delete User (Admin)
async function deleteUser(req, res) {
  try {
    const { userId } = req.params;
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) return res.status(404).json({ error: "User not found" });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  getDashboardStats,
  getAllUsers,
  updateUserRole,
  deleteUser,
};
