import mongoose from "mongoose";

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
        "Others",
      ],
    },
  },
  { timestamps: true },
);

staffSchema.index({ fullname: 1, business: 1 }, { unique: true }); //recently added to test for unique business
const Staff = mongoose.model("Staff", staffSchema);

export default Staff;