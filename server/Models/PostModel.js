import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    postMsg: { type: String, required: true },
    email: { type: String, required: true },
    authorName: { type: String, required: true }, // ⭐ جديد
    createdAt: { type: Date, default: Date.now },

    // LOCATION
    location: {
      country: { type: String, default: "" },
      region: { type: String, default: "" },
    },

    // LIKE
    likes: {
      count: { type: Number, default: 0 },
      users: [{ type: String }],
    },

    // DISLIKE
    dislikes: {
      count: { type: Number, default: 0 },
      users: [{ type: String }],
    },
  },
  { timestamps: true }
);

export const PostModel = mongoose.model("posts", PostSchema);
