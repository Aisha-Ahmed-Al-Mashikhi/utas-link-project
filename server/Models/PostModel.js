import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    // WHO POSTED
    name: { type: String, required: true },        // ← مهم !!
    email: { type: String, required: true },       // ← مهم !!
    role: { type: String, default: "student" },    // student / company

    // MESSAGE
    postMsg: { type: String, required: true },

    // PROFILE IMAGE (OPTIONAL)
    profileImage: { type: String, default: "" },

    // LOCATION DATA
    location: {
      country: { type: String, default: "" },
      region: { type: String, default: "" },
    },

    // LIKE SYSTEM
    likes: {
      count: { type: Number, default: 0 },
      users: [{ type: String }], // array of emails
    },

    // DISLIKE SYSTEM
    dislikes: {
      count: { type: Number, default: 0 },
      users: [{ type: String }],
    },
  },
  { timestamps: true }
);

export const PostModel = mongoose.model("posts", PostSchema);
