import mongoose from "mongoose"

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  type: {
    type: String,
    enum: [
      "feedback_assigned",
      "feedback_replied",
      "status_updated",
      "feedback_recieved"
    ],
    required: true
  },
  message: {
    type: String,
    required: true
  }
}, { timestamps: true});

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification