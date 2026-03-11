import asyncHandler from "express-async-handler";
import { generateAndSetCookie } from "../utils/generateAndSetCookie.js";
import { ENV } from "../config/env.js";
import { createUser, findUserByEmail, findUserWithPassword } from "../services/auth.service.js";

export const signup = asyncHandler(async (req, res) => {
  const {name, email, password} = req.body;

  // check if user already registers
  const userAlreadyExist = await findUserByEmail(email);
  if (userAlreadyExist) {
    return res.status(400).json({ success: false, message: "User already Exists"});
  }

  const user = await createUser({
    name,
    email,
    password
  });

  generateAndSetCookie(user, 201, res);
});

export const login = asyncHandler(async (req, res) => {
  const { email, password} = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Email or password can't be empty"});
  }

  const user = await findUserWithPassword(email);
  if (!user) {
    return res.status(401).json({ success: false, message: "Invalid Email or password"});
  }

  const isPasswordVerified = await user.comparePassword(password);
  if (!isPasswordVerified) {
    return res.status(401).json({ success: false, message: "Invalid Email or password"});
  }

  generateAndSetCookie(user, 200, res);
});

export const logout = asyncHandler(async (req, res) => {
  res.clearCookie("accessToken", "", {
    httpOnly: true,
    secure: ENV.NODE_ENV !== "development",
    sameSite: "strict"
  });

  res.status(200).json({ success: true, message: "Logged out successfully"});
});

export const getMe = asyncHandler(async (req, res) => {
  const user = req.user;
  res.status(200).json({ success: true, user });
});