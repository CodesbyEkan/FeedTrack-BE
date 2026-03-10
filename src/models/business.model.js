import mongoose from "mongoose";

const businessSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Business name is required"]
  },
  type: {
    type: String,
    required: [true, "Type is required"]
  },
  location: String,
  phoneNo: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  role: {
    type: String,
    enum: ["owner", "manager", "supervisor"]
  },
  staff: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ]
}, { timestamps: true});

const Business = mongoose.model("Business", businessSchema);

export default Business;