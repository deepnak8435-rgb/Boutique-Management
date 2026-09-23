const express=require("express");
const router=express.Router();
const {
  createService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService,
} = require("../controller/serviceController");
const { verifyToken, verifyAdmin } = require("../middleware/authMiddleware");

router.post("/", verifyToken, verifyAdmin, createService);
router.get("/", getAllServices);
router.get("/:id", getServiceById);
router.put("/:id", verifyToken, verifyAdmin, updateService);
router.delete("/:id", verifyToken, verifyAdmin, deleteService);

module.exports = router;