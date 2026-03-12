import express from "express"
import { checkAuth } from "../middleware/auth.middleware.js";
import { assignFeedback, createFeedback, 
  getBusinessFeedbacks, getComplaints, getInProgressComplaints, getSingleFeedback, 
  getYourStaff, resolveFeedback } from "../controllers/feedback.controller.js";

const router = express.Router();

router.post("/", createFeedback);
router.get("/:feedbackId", checkAuth, getSingleFeedback);
router.get("/business/feedback", checkAuth, getBusinessFeedbacks);
router.put("/assign/complaint", checkAuth, assignFeedback);

router.put("/resolve/complaint", checkAuth, resolveFeedback);
router.get("/in-progress/complaint", checkAuth, getInProgressComplaints);
router.get("/open/complaint", checkAuth, getInProgressComplaints);

router.get("/staff", checkAuth, getYourStaff);

router.get("/complaints", checkAuth, getComplaints);
router.get("/compliments", checkAuth, getComplaints);
router.get("/suggestions", checkAuth, getComplaints);

export default router;