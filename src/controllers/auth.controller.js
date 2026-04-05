import asyncHandler from "express-async-handler";
import { generateAndSetCookie } from "../utils/generateAndSetCookie.js";
import { ENV } from "../config/env.js";
import { createUser, findUserByEmail, findUserWithPassword } from "../services/auth.service.js";
import Business from "../models/business.model.js";
import Staff from "../models/staff.model.js";

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
