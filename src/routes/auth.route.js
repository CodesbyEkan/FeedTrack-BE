import express from "express"
import { createNewStaff, getMe, login, logout, signupOwner } from "../controllers/auth.controller.js";
import { checkAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get('/me', checkAuth, getMe);
router.post('/signup-owner', signupOwner);
router.post('/staff', checkAuth, createNewStaff);
router.post('/login', login);
router.post('/logout', logout);

export default router;