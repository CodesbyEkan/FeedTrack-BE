import express from "express"
import { checkAuth } from "../middleware/auth.middleware.js";
import { getAllNotifications, getSingleNotification, markNotificationAsRead } from "../controllers/notification.controller.js";

const router = express.Router();

router.get("/", checkAuth, getAllNotifications);
router.get("/:notificationId", checkAuth, getSingleNotification);
router.put("/read/:notificationId", checkAuth, markNotificationAsRead);

export default router;