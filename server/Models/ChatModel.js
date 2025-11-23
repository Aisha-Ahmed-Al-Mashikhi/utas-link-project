import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
  applicationId: { type: String, required: true },
  senderEmail: { type: String, required: true },
  senderRole: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const ChatModel = mongoose.model("Chat", chatSchema);
export default ChatModel;
