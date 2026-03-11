import express from "express"
import { checkAuth } from "../middleware/auth.middleware.js";
import { assignFeedback, createFeedback, getBusinessFeedbacks, getSingleFeedback, resolveFeedback } from "../controllers/feedback.controller.js";

const router = express.Router();

router.post("/", createFeedback);
router.get("/:feedbackId", checkAuth, getSingleFeedback);
router.get("/business/feedback", checkAuth, getBusinessFeedbacks);
router.put("/assign/complaint", checkAuth, assignFeedback);
router.put("/resolve/complaint", checkAuth, resolveFeedback);

export default router;