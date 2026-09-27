const express = require("express");
const router = express.Router();
const { getDashboardStats, getAllUsers, updateUserRole, deleteUser,} = require("../controller/adminController");
const { verifyToken, verifyAdmin } = require("../middleware/authMiddleware");

// All routes here require Admin JWT Verification
router.use(verifyToken, verifyAdmin);

// Admin Stats Endpoint
router.get("/stats", getDashboardStats);

// Admin User Management Endpoints
router.get("/users", getAllUsers);
router.put("/users/:userId/role", updateUserRole);
router.delete("/users/:userId", deleteUser);

module.exports = router;
