import express from "express";
import {
  getAllStaff,
  getStaff,
  deleteStaff,
} from "../controllers/staff.controller.js";
import { checkAuth } from "../middleware/auth.middleware.js";

const staffRouter = express.Router();

staffRouter.get("/get-all-staffs", checkAuth, getAllStaff);
staffRouter.get("/:staffId", checkAuth, getStaff);
staffRouter.delete("/:staffId", checkAuth, deleteStaff);

export default staffRouter;