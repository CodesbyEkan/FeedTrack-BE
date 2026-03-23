import express from "express";
import {
  createNewStaff,
  getMe,
  login,
  logout,
  signupOwner,
} from "../controllers/auth.controller.js";

import { checkAuth } from "../middleware/auth.middleware.js";
import {
  authSignupValidator,
  authSigninValidator,
  authResultValidator,
  addStaffValidator,
} from "../middleware/validators.middleware.js";

const router = express.Router();

router.get("/me", checkAuth, getMe);

// Validators are now applied — previously they were defined but never used
router.post(
  "/signup-owner",
  authSignupValidator,
  authResultValidator,
  signupOwner,
);
router.post("/login", authSigninValidator, authResultValidator, login);

router.post(
  "/add-staff",
  addStaffValidator,
  authResultValidator,
  checkAuth,
  createNewStaff,
);
router.post("/logout", logout);

export default router;
