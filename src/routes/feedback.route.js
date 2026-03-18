import express from "express"
import { checkAuth } from "../middleware/auth.middleware.js";
import { assignFeedback, createFeedback, getFeedbacks, getSingleFeedback, resolveFeedback } from "../controllers/feedback.controller.js";

const router = express.Router();

router.get("/", checkAuth, getFeedbacks);
router.post("/:businessId", createFeedback);
router.get("/:feedbackId", checkAuth, getSingleFeedback);
router.put("/assign/complaint/:feedbackId", checkAuth, assignFeedback);
router.put("/resolve/complaint/:feedbackId", checkAuth, resolveFeedback);

export default router;