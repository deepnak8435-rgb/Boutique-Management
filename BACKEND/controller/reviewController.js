const Review = require("../models/Review");
// Create Review / Feedback (Authenticated customer)
async function createReview(req, res) {
  try {
    const { rating, comment, productName } = req.body;
    if (!rating || !comment) {
      return res.status(400).json({ error: "Rating and comment are required" });
    }
    const newReview = new Review({
      customer: req.user.id,
      rating: Number(rating),
      comment,
      productName: productName || "",
    });
    const savedReview = await newReview.save();
    const populatedReview = await Review.findById(savedReview._id).populate("customer", "name email");
    res.status(201).json({
      message: "Feedback submitted successfully!",
      review: populatedReview,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Get All Reviews (Public)
async function getAllReviews(req, res) {
  try {
    const reviews = await Review.find().populate("customer", "name email").sort({ createdAt: -1 });
    res.status(200).json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }}
// Delete Review (Admin)
async function deleteReview(req, res) {
  try {
    const { reviewId } = req.params;
    const deletedReview = await Review.findByIdAndDelete(reviewId);
    if (!deletedReview) {
      return res.status(404).json({ error: "Review not found" });
    }
    res.status(200).json({ message: "Review deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }}
module.exports = { createReview,getAllReviews,deleteReview,};
