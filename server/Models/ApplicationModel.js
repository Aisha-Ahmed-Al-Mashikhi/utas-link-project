import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
  jobTitle: { type: String, required: true },
  organization: { type: String, required: true },
  companyEmail: { type: String, required: true },

  applicantEmail: { type: String, required: true },
  applicantName: { type: String, required: true },

  cvLink: { type: String, required: true },  // ⭐ مهم جداً

  status: {
    type: String,
    enum: ["Pending", "Pending Review", "Accepted", "Rejected"],
    default: "Pending",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const ApplicationModel = mongoose.model("Application", applicationSchema);

export default ApplicationModel;
