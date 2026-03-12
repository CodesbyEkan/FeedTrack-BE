import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
  business: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Business"
  },
  guestName: { 
    type: String,
  },
  message: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ["open", "in-progress", "resolved"],
    default: 'open'
  },
  type: {
    type: String,
    enum: ["complaint", "compliment", "suggestion"],
    required: true    
  },
  source: String,
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
  },
  notes: {
    type: String
  },
  resolvedAt: {
    type: Date
  }
}, 
{ timestamps: true } // for the createdAt & updatedAt fields
);

const Feedback = mongoose.model("Feedback", feedbackSchema);

export default Feedback;