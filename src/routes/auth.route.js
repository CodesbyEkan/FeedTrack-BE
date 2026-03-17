import express from "express";
import {
  createNewStaff,
  getMe,
  login,
  logout,
  signupOwnerOwner,
} from "../controllers/auth.controller.js";
import { checkAuth } from "../middleware/auth.middleware.js";
import {
  authSignupValidator,
  authSigninValidator,
  authResultValidator,
} from "../middleware/validators.js";

const router = express.Router();

router.get('/me', checkAuth, getMe);
router.post('/signup-owner', signup);
router.post('/staff', checkAuth, createNewStaff);
router.post('/login', login);
router.post('/logout', logout);

export default router;
