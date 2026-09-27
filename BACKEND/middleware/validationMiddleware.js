const { body, validationResult } = require("express-validator");

// Middleware to handle validation result errors
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: errors.array()[0].msg,
      errors: errors.array(),
    });
  }
  next();
};

// Validation rules for Auth Signup
const signupRules = [
  body("name").trim().notEmpty().withMessage("Full name is required"),
  body("email").isEmail().withMessage("Must be a valid email address").normalizeEmail(),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

// Validation rules for Auth Login
const loginRules = [
  body("email").isEmail().withMessage("Must be a valid email address").normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required"),
];

// Validation rules for Service creation
const serviceRules = [
  body("name").trim().notEmpty().withMessage("Service name is required"),
  body("duration")
    .isInt({ min: 15 })
    .withMessage("Duration must be a number of at least 15 minutes"),
  body("price")
    .isFloat({ min: 0 })
    .withMessage("Price must be a non-negative number"),
];

// Validation rules for Product creation
const productRules = [
  body("name").trim().notEmpty().withMessage("Product name is required"),
  body("price")
    .isFloat({ min: 0 })
    .withMessage("Price must be a valid positive number"),
  body("category").notEmpty().withMessage("Category is required"),
];

module.exports = { validate, signupRules, loginRules, serviceRules, productRules,};
