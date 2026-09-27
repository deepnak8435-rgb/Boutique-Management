const express = require("express");
const router = express.Router();
const { getProfile, updateProfile } = require("../controller/userController");
const { verifyToken } = require("../middleware/authMiddleware");

// GET /api/users/profile
router.get("/profile", verifyToken, getProfile);

// PUT /api/users/profile
router.put("/profile", verifyToken, updateProfile);

module.exports = router;
