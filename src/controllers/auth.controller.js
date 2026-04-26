import asyncHandler from "express-async-handler";
import { generateAndSetCookie } from "../utils/generateAndSetCookie.js";
import { ENV } from "../config/env.js";
import { createUser, findUserByEmail, findUserWithPassword } from "../services/auth.service.js";
import Business from "../models/business.model.js";
import Staff from "../models/staff.model.js";
import crypto from "crypto";
import User from "../models/user.model.js";
import transporter from "../utils/mailer.js";


// signup business owner
export const signupOwner = asyncHandler(async (req, res) => {
  const {name, email, password, businessName, businessType, businessPhone } = req.body;

  // check if user already registers
  const userAlreadyExist = await findUserByEmail(email);
  if (userAlreadyExist) {
    return res.status(400).json({ success: false, message: "User already Exists"});
  }

  const owner = await createUser({
    name,
    email,
    password,
    role: "owner"
  });

  const business = await Business.create({
    name: businessName,
    type: businessType,
    phoneNo: businessPhone,
    owner: owner._id
  });

  // assign business to owner
  owner.business = business._id;
  await owner.save()

  generateAndSetCookie(owner, 201, res);
});

// create new staff logic

export const createNewStaff = asyncHandler(async (req, res) => {
  try {
    const { fullname, role } = req.body;
    const businessId = req.user.business;

    if (!businessId) {
      return res.status(400).json({
        success: false,
        message: "You don't have any business - please register",
      });
    }

    const existName = await Staff.findOne({
      fullname: { $regex: `^${fullname}$`, $options: "i" },
      business: businessId,
    });

    if (existName) {
      return res
        .status(400)
        .json({ status: false, message: "Duplicate names not allowed!" });
    }

    const staff = await Staff.create({
      business: businessId,
      fullname,
      role,
    });

    res.status(201).json({
      success: true,
      message: "New staff created and assigned successfully",
      //new input
      data: staff,
    });
  } catch (err) {
    console.log(err);
  }
});

/* export const createNewStaff = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const businessId = req.user.business;

  if (!businessId) {
    return res.status(400).json({ success: false, message: "You dont have any business - please register"})
  }

  // check if user already registers
  const userAlreadyExist = await findUserByEmail(email);
  if (userAlreadyExist) {
    return res.status(400).json({ success: false, message: "User already exists"});
  }

  const staff = await createUser({
    name,
    email,
    password,
    role: "staff",
    business: businessId
  });

  res.status(201).json({ success: true, message: "New staff created and assigned successfully", staff});

}); */

// login controller
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

// logout user
export const logout = asyncHandler(async (req, res) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: ENV.NODE_ENV !== "development",
    sameSite: "strict"
  });

  res.status(200).json({ success: true, message: "Logged out successfully"});
});

// get presently authenticated user
export const getMe = asyncHandler(async (req, res) => {
  const user = req.user;
  res.status(200).json({ success: true, user });
});


//FORGOT PASSWORD

export const forgotPassword = asyncHandler(async (req, res) => {
  const{ email} = req.body;
  if (!email) return res.status(400).json({ message: 'Email is required'})

  
  const SAME_MSG = 'If that email exists, a reset link has been sent.';

  try {
    const user = await User.findOne({ email: email.toLowerCase().trim() });

    // Always 200 — never reveal whether the address is registered
    if (!user) return res.status(200).json({ message: SAME_MSG });

    const token   = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    user.resetPasswordToken   = token;
    user.resetPasswordExpires = expires;
    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    await transporter.sendMail({
      from:    `"GuestPulse" <${process.env.SMTP_USER}>`,
      to:      user.email,
      subject: 'Reset your password',
      html: `
        <p>Hi ${user.name || 'there'},</p>
        <p>Click below to reset your password — link expires in <strong>1 hour</strong>.</p>
        <p><a href="${resetUrl}">Reset my password</a></p>
        <p>If you didn't request this, ignore this email.</p>
      `,
    });

    res.status(200).json({ message: SAME_MSG });

  } catch (err) {
    console.error('forgot-password:', err);
    res.status(500).json({ message: 'Could not send reset email. Please try again.' });
  }
  });


  export const resetPassword = asyncHandler(async(req, res) => {
     const { token, password } = req.body;

  if (!token || !password)
    return res.status(400).json({ message: 'Token and new password are required.' });

  if (password.length < 8)
    return res.status(400).json({ message: 'Password must be at least 8 characters.' });

  try {
    const user = await User.findOne({
      resetPasswordToken:   token,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user)
      return res.status(400).json({ message: 'Reset link is invalid or has expired.' });

    user.password             = password;
    user.resetPasswordToken   = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: 'Password updated. You can now log in.' });

  } catch (err) {
    console.error('reset-password:', err);
    res.status(500).json({ message: 'Could not reset password. Please try again.' });
  }
  });