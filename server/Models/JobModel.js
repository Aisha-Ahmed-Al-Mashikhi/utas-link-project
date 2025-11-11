import mongoose from "mongoose";

// Define the structure of each job post in MongoDB
const jobSchema = new mongoose.Schema({
  jobTitle: { type: String, required: true }, // Title of the job
  organization: { type: String, required: true }, // Company or ministry name
  sector: { type: String }, // Field or sector (e.g., Education, IT)
  category: { type: String }, // Job type (part-time, internship, etc.)
  description: { type: String }, // Job details or responsibilities
  skills: { type: String }, // Required skills
  rate: { type: Number }, // Salary or hourly rate
  rateType: { type: String }, // Type (per hour, per task, etc.)
  payout: { type: String }, // Payment method (optional)
  postedBy: { type: String }, // Email of the company that posted the job
  postedAt: { type: Date, default: Date.now }, // Date the job was created
});

// Create and export the Job model
const JobModel = mongoose.model("Job", jobSchema);

export default JobModel;
