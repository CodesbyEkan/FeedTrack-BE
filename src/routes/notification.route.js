import express from "express"
import { checkAuth } from "../middleware/auth.middleware.js";
import { getAllNotifications, getSingleNotification } from "../controllers/notification.controller.js";

const router = express.Router();

router.get("/", checkAuth, getAllNotifications);
router.get("/notification", checkAuth, getSingleNotification);

export default router;