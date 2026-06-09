import mongoose from "mongoose";
<<<<<<< HEAD
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
=======

const staffSchema = new mongoose.Schema(
  {
    business: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Business",
    },
    fullname: {
      type: String,
      required: true,
      //unique: true,
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
        "Other",
      ],
    },
  },
  { timestamps: true },
);

staffSchema.index({ fullname: 1, business: 1 }, { unique: true }); //recently added to test for unique business
const Staff = mongoose.model("Staff", staffSchema);

export default Staff;
>>>>>>> 1b0eb7826f1a4f1a4611fe1c892ccc706fa7ca51
