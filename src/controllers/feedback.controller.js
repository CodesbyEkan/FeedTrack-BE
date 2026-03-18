import asyncHandler from "express-async-handler";
import Feedback from "../models/feedback.model.js";
import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";

// create feed back
export const createFeedback = asyncHandler(async (req, res) => {
  const { businessId } = req.params;
  const { type, guestName, message } = req.body;

  // Check for duplicate
  const existingFeedback = await Feedback.findOne({
    business: businessId,
    type,
    guestName,
    message
  });

  if (existingFeedback) {
    return res.status(400).json({ success: false, message: "Duplicate feedback already exists" });
  }

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

// get feedbacks
export const getFeedbacks = asyncHandler(async (req, res) => {
  const businessId = req.user.business;

  const { type, status } = req.query;

  // filter object
  const filter = { business: businessId };

  // check if type is present in the query strings and add to the filter object
  if (type) {
    filter.type = type;
  }

  // check if type is present in the query strings and add to the filter object
  if (status) {
    filter.status = status; // open, in-progress, resolved
  }

  const feedbacks = await Feedback.find(filter);

  res.status(200).json({
    success: true,
    count: feedbacks.length,
    feedbacks
  });
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

// assign complaint to the staff
export const assignFeedback = asyncHandler(async (req, res) => {
  const { feedbackId } = req.params;
  const { staffName } = req.body;

  const feedback = await Feedback.findById(feedbackId);
  if (!feedback) {
    return res.status(404).json({ success: false, message: "Feedback not found"});
  }

  if (feedback.type !== "complaint") {
    return res.status(400).json({ success: false, message: "Only complaint can be assigned"});
  }

  feedback.assignedTo = staffName;
  feedback.status = 'in-progress';

  await feedback.save();
  res.status(200).json({ success: true, message: "Feedback assigned successfully", feedback});
});

// resolve complaint
export const resolveFeedback = asyncHandler(async (req, res) => {
  const { feedbackId } = req.params;

  const { notes } = req.body;
  
  const feedback = await Feedback.findById(feedbackId);
  if (!feedback) {
    return res.status(404).json({ success: false, message: "Feedback not found"});
  }

  feedback.status = "resolved";
  feedback.notes = notes;
  feedback.resolvedAt = new Date();

  await feedback.save();

  res.status(200).json({ success: true, message: "Feedback resolved successfully", feedback});
});