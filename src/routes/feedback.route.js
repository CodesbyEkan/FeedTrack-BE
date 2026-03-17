import express from "express"
import { checkAuth } from "../middleware/auth.middleware.js";
import { assignFeedback, createFeedback, 
  getBusinessFeedbacks, getComplaints, getCompliments, getInProgressComplaints, getSingleFeedback, 
  getSuggestions, 
  resolveFeedback } from "../controllers/feedback.controller.js";

const router = express.Router();

router.post("/create", createFeedback);
router.get("/:feedbackId", checkAuth, getSingleFeedback);
router.get("/business/feedback", checkAuth, getBusinessFeedbacks);
router.put("/assign/complaint", checkAuth, assignFeedback);

router.put("/resolve/complaint", checkAuth, resolveFeedback);
router.get("/in-progress/complaint", checkAuth, getInProgressComplaints);
router.get("/open/complaint", checkAuth, getInProgressComplaints);

router.get("/complaints", checkAuth, getComplaints);
router.get("/compliments", checkAuth, getCompliments);
router.get("/suggestions", checkAuth, getSuggestions);

export default router;