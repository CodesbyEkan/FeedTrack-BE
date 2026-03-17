import { body, validationResult } from "express-validator";

export const authSignupValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("name cannot be empty!")
    .isAlpha()
    .withMessage("Name must be alphabetical characters.")
    .isLength({ min: 4, max: 35 })
    .withMessage("Name should have 4-35 characters.")
    .escape(),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email not valid.")
    .isLength({ max: 35 })
    .escape(),
  body("password")
    .notEmpty()
    .withMessage("Password is required!")
    .isLength({ min: 6, max: 35 })
    .withMessage("Password should contain 6-35 characters")
    .isAscii()
    .escape(),
  body("businessName")
    .trim()
    .notEmpty()
    .withMessage("Business name cannot be empty!")
    .isLength({ min: 4, max: 35 })
    .withMessage("Name should have 4-35 characters.")
    .escape(),
  body("businessType")
    .trim()
    .notEmpty()
    .withMessage("Business type can't be empty!")
    .isAlpha()
    .withMessage("Business type must contain alphabet characters only!")
    .escape(),
  body("businessPhone")
    .trim()
    .notEmpty()
    .withMessage("Business phone number is required!")
    .isLength({ min: 11, max: 17 })
    .matches(/^\+(\d{1,3})[- ]?(\d{1,14})[- ]?(\d{1,14})$/)
    .withMessage("Phone number not valid!. Format: +234 473 422 5773!")
    .escape(),
];

export const authSigninValidator = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required!")
    .isEmail()
    .withMessage("Invalid email format!")
    .escape(),
  body("password").notEmpty().withMessage("Password is required!").escape(),
];

export const authResultValidator = (req, res, next) => {
  const authError = validationResult(req);
  if (!authError.isEmpty()) {
    return res.status(422).json({
      status: false,
      message: "Auth validation failed!",
      errors: authError.array(),
    });
  }
  next();
};
