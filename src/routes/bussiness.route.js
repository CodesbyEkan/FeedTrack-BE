import express from "express";
import asyncHandler from "express-async-handler";
import Business from "../models/business.model.js";
import { checkAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

// NEW: GET /api/v1/business/my-business
// Allows frontend to fetch business name after login on any device
router.get("/my-business", checkAuth, asyncHandler(async (req, res) => {
  const businessId = req.user.business;
  if (!businessId) {
    return res.status(404).json({ success: false, message: "No business linked to this account" });
  }
  const business = await Business.findById(businessId);
  if (!business) {
    return res.status(404).json({ success: false, message: "Business not found" });
  }
  res.status(200).json({ success: true, business });
}));

export default router;