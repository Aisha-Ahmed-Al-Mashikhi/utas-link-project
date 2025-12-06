import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  jobTitle: String,
  sector: String,
  category: String,
  description: String,
  skills: String,
  rate: Number,
  rateType: String,
  payout: String,

  postedBy: String,          // Email
  organization: String,      // Company Name

  postedAt: { type: Date, default: Date.now },

  // ⭐ Location added — required ✔
  location: {
    type: String,
    required: true,
  },

}, { timestamps: true });

export default mongoose.model("Job", jobSchema);
