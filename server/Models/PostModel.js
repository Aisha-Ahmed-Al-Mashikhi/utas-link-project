import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    name: { type: String, required: false },      // ✔ يظهر اسم المستخدم
    email: { type: String, required: true },
    role: { type: String, default: "student" },   // ✔ لو طالب أو شركة

    postMsg: { type: String, required: true },

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
