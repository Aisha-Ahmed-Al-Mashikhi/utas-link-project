import mongoose from "mongoose";

// Define the schema for job applications
const applicationSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job" }, // Connects to the Job that was applied for
  jobTitle: { type: String, required: true }, // Job title
  organization: { type: String, required: true }, // Company name
  applicantEmail: { type: String, required: true }, // Student email
  applicantName: { type: String, required: true }, // Student name
  status: {
    type: String,
    enum: ["Pending Review", "Accepted", "Rejected"], // Possible application states
    default: "Pending Review", // Default state when first applied
  },
  appliedAt: {
    type: Date,
    default: Date.now, // Saves the date when the application was created
  },
});

// Create the model to use this schema in the server
const ApplicationModel = mongoose.model("Application", applicationSchema);

export default ApplicationModel;
