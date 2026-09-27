const express = require("express");
const router = express.Router();
const { createPaymentOrder, verifyPayment } = require("../controller/paymentController");
const { verifyToken } = require("../middleware/authMiddleware");

// All payment routes require JWT Auth
router.use(verifyToken);

router.post("/create-order", createPaymentOrder);
router.post("/verify", verifyPayment);

module.exports = router;
