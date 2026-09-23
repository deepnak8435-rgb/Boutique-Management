const express =require("express");
const router=express.Router();
const { signup, login, makeAdmin } = require("../controller/authController");
const { verifyToken } = require("../middleware/authMiddleware");

router.post("/signup", signup);
router.post("/login", login);
router.put("/make-admin", verifyToken, makeAdmin);

module.exports = router;