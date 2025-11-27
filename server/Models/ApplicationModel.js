import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job" },
  jobTitle: { type: String, required: true },
  organization: { type: String, required: true },

  applicantEmail: { type: String, required: true },
  applicantName: { type: String, required: true },

  cvLink: { type: String, required: true },   
  status: {
    type: String,
    enum: ["Pending Review", "Accepted", "Rejected"],
    default: "Pending Review",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const ApplicationModel = mongoose.model("Application", applicationSchema);

export default ApplicationModel;
