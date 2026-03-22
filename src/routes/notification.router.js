// import express from "express"
// import { checkAuth } from "../middleware/auth.middleware.js";
// import { getAllNotifications, getSingleNotification } from "../controllers/notification.controller.js";

// const router = express.Router();

// router.get("/", checkAuth, getAllNotifications);
// router.get("/notification", checkAuth, getSingleNotification);

// export default router;

import express from "express";
import { checkAuth } from "../middleware/auth.middleware.js";
import {
  getAllNotifications,
  getSingleNotification,
  markNotificationAsRead,
} from "../controllers/notification.controller.js";

const router = express.Router();

router.get("/", checkAuth, getAllNotifications);
router.get("/:notificationId", checkAuth, getSingleNotification);

// Previously missing — marks a notification as read and emits a socket event
router.patch("/:notificationId/read", checkAuth, markNotificationAsRead);

export default router;
