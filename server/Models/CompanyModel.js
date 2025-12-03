import mongoose from "mongoose";

const CompanySchema = new mongoose.Schema(
  {
    companyName: String, // Company name
    email: String, // Company email
    password: String, // Encrypted password
    industry: String, // Industry type
    location: String, // City or region
    foundedDate: String, // Established date

    // FILES
    tradeLicense: String, // Optional license document
    profileImage: String, // Company profile image
  },
  { timestamps: true }
);

export default mongoose.model("Company", CompanySchema);
