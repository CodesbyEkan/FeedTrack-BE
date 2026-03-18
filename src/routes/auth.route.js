import express from "express";
import {
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
} from "../middleware/validators.middleware.js";

const router = express.Router();

router.get('/me', checkAuth, getMe);
router.post('/signup', authSignupValidator, authResultValidator, signupOwner);
router.post('/login', authSigninValidator, authResultValidator, login);
router.post('/logout', logout);

export default router;
