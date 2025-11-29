import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema({
  applicationId: {
    type: String,
    required: true,
  },

  from: {
    email: { type: String, required: true },
    name: { type: String, required: true },
    role: { type: String, required: true }
  },

  to: {
    email: { type: String, required: true },
    name: { type: String, required: true },
    role: { type: String, required: true }
  },

  message: {
    text: { type: String, required: true },
    sentAt: { type: Date, default: Date.now }
  }
});

export default mongoose.model("Chat", ChatSchema);
