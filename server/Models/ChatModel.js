// Import mongoose
import mongoose from "mongoose";

// Define chat schema
const ChatSchema = new mongoose.Schema({
  // Related application ID
  applicationId: { type: String, required: true },

  // Sender info
  from: {
    // Sender email
    email: String,
    // Sender name
    name: String,
    // Sender role
    role: String,
  },

  // Receiver info
  to: {
    // Receiver email
    email: String,
    // Receiver name
    name: String,
    // Receiver role
    role: String,
  },

  // Message content
  message: {
    // Message text
    text: String,
    // Message time
    sentAt: { type: Date, default: Date.now },
  },
});

// Export Chat model
export default mongoose.model("Chat", ChatSchema);
