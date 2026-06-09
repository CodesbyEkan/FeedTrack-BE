import mongoose from "mongoose";
import { type } from "node:os";

const staffSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: [
      "Front Desk",
      "Waiter",
      "House keeping",
      "Security",
      "Chef",
      "Manager",
      "Bartender",
      "Driver",
      "Others",
    ],
  },
});
