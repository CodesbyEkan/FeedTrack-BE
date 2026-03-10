import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
  business: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Business"
  },
  authorName: { 
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ["open", "in-progress", "closed"],
    default: 'open'
  },
  type: {
    type: String,
    enum: ["complaint", "compliment", "suggestion"],
    required: true    
  },
  source: String
}, 
{ timestamps: true } // for the createdAt & updatedAt fields
);

const Feedback = mongoose.model("Feedback", feedbackSchema);

export default Feedback;