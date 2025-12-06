import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema({
  applicationId: { type: String, required: true },

  from: {
    email: String,
    name: String,
    role: String,
  },

  to: {
    email: String,
    name: String,
    role: String,
  },

  message: {
    text: String,
    sentAt: { type: Date, default: Date.now },
  },
});

export default mongoose.model("Chat", ChatSchema);
