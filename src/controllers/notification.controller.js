import Notification from "../models/notification.model.js";

// get all notifications for logged-in user
export const getAllNotifications = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const notifications = await Notification.find({ recipient: userId }).sort({ createdAt: -1 });
  res.status(200).json({ success: true, notifications });
});

// get single notification by ID
export const getSingleNotification = asyncHandler(async (req, res) => {
  const { notificationId } = req.params;
  const notification = await Notification.findById(notificationId);

  if (!notification) return res.status(404).json({ success: false, message: "Notification not found" });

  res.status(200).json({ success: true, notification });
});