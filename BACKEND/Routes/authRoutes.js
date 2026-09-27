const express =require("express");
const router=express.Router();
const { signup, login, makeAdmin } = require("../controller/authController");
const { verifyToken } = require("../middleware/authMiddleware");
const { signupRules, loginRules, validate } = require("../middleware/validationMiddleware");

router.post("/signup", signupRules, validate, signup);
router.post("/login", loginRules, validate, login);
router.put("/make-admin", verifyToken, makeAdmin);

module.exports = router;