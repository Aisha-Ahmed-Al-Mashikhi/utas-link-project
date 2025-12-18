// Import mongoose
import mongoose from "mongoose";

// Create company schema
const CompanySchema = new mongoose.Schema(
  {
    // Organization name
    organization: String,

    // Company display name
    companyName: String,

    // Company email
    email: String,

    // Hashed password
    password: String,

    // Industry type
    industry: String,

    // Company location
    location: String,

    // Company founded date
    foundedDate: String,

    // License file path
    businessLicense: String,

    // Profile image path
    profileImage: String,
  },
  // Add createdAt & updatedAt
  { timestamps: true }
);

// Export company model
export default mongoose.model("Company", CompanySchema);
