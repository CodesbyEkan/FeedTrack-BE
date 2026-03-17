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
} from "../middleware/validators.js";

const router = express.Router();

router.get("/me", checkAuth, getMe);
router.post(
  "/signup-owner",
  authSignupValidator,
  authResultValidator,
  signupOwner,
);
router.post("/signup-staff", checkAuth, createNewStaff);
router.post(
  "/login",
  authSigninValidator,
  authResultValidator,
  checkAuth,
  login,
);
router.post("/logout", logout);

export default router;
