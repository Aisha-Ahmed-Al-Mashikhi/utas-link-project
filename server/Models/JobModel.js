// Import mongoose
import mongoose from "mongoose";

// Create job schema
const jobSchema = new mongoose.Schema(
  {
    // Job title
    jobTitle: String,

    // Job sector
    sector: String,

    // Job category
    category: String,

    // Job description
    description: String,

    // Required skills
    skills: String,

    // Job rate value
    rate: Number,

    // Rate type (hour/day/task)
    rateType: String,

    // Payout info
    payout: String,

    // Company email
    postedBy: String,

    // Company name
    organization: String,

    // Job posting date
    postedAt: { type: Date, default: Date.now },

    // Job location
    location: {
      // Location value
      type: String,

      // Location required
      required: true,
    },
  },
  // Enable timestamps
  { timestamps: true }
);

// Export job model
export default mongoose.model("Job", jobSchema);
