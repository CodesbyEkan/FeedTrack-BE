import asyncHandler from "express-async-handler";
import Staff from "../models/staff.model.js";

export const getAllStaff = asyncHandler(async (req, res) => {
  try {
    const businessId = req.user.business;
    if (!businessId) {
      return res.status(501).json({
        status: false,
        message: "Business not found!",
      });
    }

    const staffs = await Staff.find({ business: businessId });

    res.status(200).json({
      status: true,
      count: staffs.length,
      staffs,
    });
  } catch (err) {
    console.error(err);
  }
});

export const getStaff = asyncHandler(async (req, res) => {
  try {
    const staffId = req.params.id;
    const staff = await Staff.findById(staffId);
    if (!staff) {
      return res
        .status(404)
        .json({ status: false, message: "staff with id doesn't exist" });
    }

    res.status(200).json({
      status: true,
      staff,
    });
  } catch (err) {
    console.error(err);
  }
});

export const deleteStaff = asyncHandler(async (req, res) => {
  try {
    const staffId = req.params.staffId;
    const DeletedStaff = await Staff.findByIdAndDelete(staffId);
    if (!DeletedStaff) {
      return res
        .status(404)
        .json({ status: false, message: "staff with id doesn't exist" });
    }

    res.status(200).json({
      status: true,
      message: "Staff successfully deleted",
    });
  } catch (err) {
    console.error(err);
  }
});