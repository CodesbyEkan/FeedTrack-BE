import mongoose from "mongoose"

const notificationSchema = new mongoose.Schema({
  recipient: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  feedback: { // the feedback that triggered it
    type: mongoose.Schema.Types.ObjectId,
    ref: "Feedback",
    required: true
  },
  type: {
    type: String,
    enum: [
      "new_feedback",
      "complaint_assigned",
      "complaint_resolved"
    ],
    required: true
  },
  read: {
    type: Boolean,
    default: false
  }
}, { timestamps: true});

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification