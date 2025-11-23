import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    email: String,
    postMsg: String,

    // LOCATION DATA
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
