const express = require("express");
const router = express.Router();
const { createReview, getAllReviews, deleteReview,} = require("../controller/reviewController");
const { verifyToken, verifyAdmin } = require("../middleware/authMiddleware");

// Public: Get all reviews
router.get("/", getAllReviews);

// Customer: Submit feedback
router.post("/", verifyToken, createReview);

// Admin: Delete feedback
router.delete("/:reviewId", verifyToken, verifyAdmin, deleteReview);

module.exports = router;
