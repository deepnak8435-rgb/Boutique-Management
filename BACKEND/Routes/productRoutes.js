const express = require("express");
const router = express.Router();
const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controller/productController");
const { verifyToken, verifyAdmin } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const { productRules, validate } = require("../middleware/validationMiddleware");

// Public routes
router.get("/", getAllProducts);
router.get("/:id", getProductById);

// Admin routes (Supports Multer file upload & input validation)
router.post(
  "/",
  verifyToken,
  verifyAdmin,
  upload.single("image"),
  productRules,
  validate,
  createProduct
);

router.put(
  "/:id",
  verifyToken,
  verifyAdmin,
  upload.single("image"),
  updateProduct
);

router.delete("/:id", verifyToken, verifyAdmin, deleteProduct);

module.exports = router;
