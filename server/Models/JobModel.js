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
  postedBy: String,
  postedAt: { type: Date, default: Date.now },
  location: {
  type: String,
  required: true,
},

});

export default mongoose.model("Job", jobSchema);
