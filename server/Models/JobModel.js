import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  jobTitle: String,
  organization: String,
  sector: String,
  category: String,
  description: String,
  skills: String,
  rate: Number,
  rateType: String,
  payout: String,
  postedBy: String,
  postedAt: { type: Date, default: Date.now },
});

export default mongoose.model("Job", jobSchema);
