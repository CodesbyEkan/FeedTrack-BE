import asyncHandler from "express-async-handler";
import Feedback from "../models/feedback.model.js";
import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";

// create feed back
export const createFeedback = asyncHandler(async (req, res) => {
  const { businessId, type, guestName, message } = req.body;

  const feedback = await Feedback.create({
    business: businessId,
    type,
    guestName,
    message
  });

  // find business owner
  const owner = await User.findOne({ business: businessId, role: "owner"});
  if (owner) {
    // create a notification
    await Notification.create({
      recipient: owner._id,
      feedback: feedback._id,
      type: "new_feedback"
    })
  }

  res.status(201).json({ success: true, message: "Feedback submitted successfully", feedback})
});

// get single feedback
export const getSingleFeedback = asyncHandler(async (req, res) => {
  const { feedbackId } = req.params;

  const feedback = await Feedback.findById(feedbackId).populate("business", "name");
  if (!feedback) {
    return res.status(404).json({ success: false, message: "Feedback not found"});
  }

  res.status(200).json(feedback);
});

// get all feedbacks related to the business
export const getBusinessFeedbacks = asyncHandler(async (req, res) => {
  const businessId = req.user.business;

  const feedback = await Feedback.find({ business: businessId })
  .populate("assignedTo", "name email").sort({ createdAt: -1 });

  res.status(200).json(feedback);
});

// assign complaint to the staff
export const assignFeedback = asyncHandler(async (req, res) => {
  const { feedbackId, staffId, notes } = req.body;

  const feedback = await Feedback.findById(feedbackId);
  if (!feedback) {
    return res.status(404).json({ success: false, message: "Feedback not found"});
  }

  if (feedback.type !== "complaint") {
    return res.status(400).json({ success: false, message: "Only complaint can be assigned"});
  }

  feedback.assignedTo = staffId;
  feedback.status = 'in-progress';
  feedback.notes = notes;

  await feedback.save();

  // send notification to staff
  await Notification.create({
    recipient: staffId,
    feedback: feedback._id,
    type: "feedback_assigned"
  });

  res.status(200).json({ success: true, message: "Feedback assigned successfully", feedback});
});

// resolve complaint
export const resolveFeedback = asyncHandler(async (req, res) => {
  const { feedbackId } = req.body;
  
  const feedback = await Feedback.findById(feedbackId);
  if (!feedback) {
    return res.status(404).json({ success: false, message: "Feedback not found"});
  }

  feedback.status = "resolved";
  feedback.resolvedAt = new Date();

  await feedback.save();

  res.status(200).json({ success: true, message: "Feedback resolved successfully", feedback});
});

// todo:
// generate qrcodes
// get in-progress complaint
// get resolved complaint
// get open complaint
// get your staff
// get complaint
// get compliment
// get suggestion
// get all notifications
// get single notification