// import express from "express"
// import { checkAuth } from "../middleware/auth.middleware.js";
// import { assignFeedback, createFeedback, 
//   getBusinessFeedbacks, getComplaints,getCompliments,getSuggestions, getInProgressComplaints, getSingleFeedback, 
//   getYourStaff, resolveFeedback } from "../controllers/feedback.controller.js";

// const router = express.Router();

// router.post("/", createFeedback);
// router.get("/:feedbackId", checkAuth, getSingleFeedback);
// router.get("/business/feedback", checkAuth, getBusinessFeedbacks);
// router.put("/assign/complaint", checkAuth, assignFeedback);

// router.put("/resolve/complaint", checkAuth, resolveFeedback);
// router.get("/in-progress/complaint", checkAuth, getInProgressComplaints);
// router.get("/open/complaint", checkAuth, getInProgressComplaints);

// router.get("/staff", checkAuth, getYourStaff);

// router.get("/complaints", checkAuth, getComplaints);
// router.get("/compliments", checkAuth, getCompliments);
// router.get("/suggestions", checkAuth, getSuggestions);

// export default router;




import express from "express";
import { checkAuth } from "../middleware/auth.middleware.js";
import {
  assignFeedback,
  createFeedback,
  getBusinessFeedbacks,
  getComplaints,
  getCompliments,
  getSuggestions,
  getInProgressComplaints,
  getResolvedComplaints,
  getOpenComplaints,
  getSingleFeedback,
  getYourStaff,
  resolveFeedback,
} from "../controllers/feedback.controller.js";

const router = express.Router();

// --- Public route (called by guest QR scan) ---
router.post("/", createFeedback);

// --- Static routes MUST come before /:feedbackId to avoid wildcard capture ---

// Business-scoped queries
router.get("/business/all", checkAuth, getBusinessFeedbacks);

// Staff
router.get("/staff", checkAuth, getYourStaff);

// Feedback by type
router.get("/complaints", checkAuth, getComplaints);
router.get("/compliments", checkAuth, getCompliments);
router.get("/suggestions", checkAuth, getSuggestions);

// Complaints by status
router.get("/complaints/in-progress", checkAuth, getInProgressComplaints);
router.get("/complaints/resolved", checkAuth, getResolvedComplaints);
router.get("/complaints/open", checkAuth, getOpenComplaints);

// Actions on complaints
router.put("/assign/complaint", checkAuth, assignFeedback);
router.put("/resolve/complaint", checkAuth, resolveFeedback);

// --- Wildcard route LAST — will no longer shadow the routes above ---
router.get("/:feedbackId", checkAuth, getSingleFeedback);

export default router;
