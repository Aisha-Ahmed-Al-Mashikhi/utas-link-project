// Import mongoose
import mongoose from "mongoose";

// Create post schema
const PostSchema = new mongoose.Schema(
  {
    // Post content
    postMsg: { type: String, required: true },

    // Author email
    email: { type: String, required: true },

    // Author name
    authorName: { type: String, required: true },

    // Creation date
    createdAt: { type: Date, default: Date.now },

    // Location object
    location: {
      // Country name
      country: { type: String, default: "" },

      // Region name
      region: { type: String, default: "" },
    },

    // Likes info
    likes: {
      // Likes count
      count: { type: Number, default: 0 },

      // Users who liked
      users: [{ type: String }],
    },

    // Dislikes info
    dislikes: {
      // Dislikes count
      count: { type: Number, default: 0 },

      // Users who disliked
      users: [{ type: String }],
    },
  },
  // Enable timestamps
  { timestamps: true }
);

// Export post model
export const PostModel = mongoose.model("posts", PostSchema);
