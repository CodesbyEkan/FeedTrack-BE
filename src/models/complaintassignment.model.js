import mongoose from "mongoose";

const complaintAssignmentSchema = new mongoose.Schema({
  feedback: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Feedback",
    required: true
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // staff or manager handling the complaint
    required: true
  },
  business: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Business",
    required: true
  },
  status: {
    type: String,
    enum: ["pending", "in-progress", "resolved"],
    default: "pending"
  },
  notes: {
    type: String // message from the staff
  },
  resolvedAt: {
    type: Date
  }
}, { timestamps: true });

const complaintAssignment = mongoose.model("ComplaintAssignment", complaintAssignmentSchema);

export default complaintAssignment;