// Import mongoose library
import mongoose from "mongoose";

// Define application schema
const applicationSchema = new mongoose.Schema({
  // Reference to job ID
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },

  // Job title
  jobTitle: { type: String, required: true },

  // Company name
  organization: { type: String, required: true },

  // Company email
  companyEmail: { type: String, required: true },

  // Applicant email
  applicantEmail: { type: String, required: true },

  // Applicant name
  applicantName: { type: String, required: true },

  // CV file link
  cvLink: { type: String, required: true },

  // Application status
  status: {
    type: String,
    enum: ["Pending", "Pending Review", "Accepted", "Rejected"],
    default: "Pending",
  },

  // Creation date
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create Application model
const ApplicationModel = mongoose.model("Application", applicationSchema);

// Export model
export default ApplicationModel;
