import mongoose from "mongoose";

// Define the schema for company accounts
const companySchema = new mongoose.Schema({
  companyName: { type: String, required: true }, // Company full name
  email: { type: String, required: true, unique: true }, // Company email
  password: { type: String, required: true }, // Encrypted password
  industry: { type: String }, // Business type (e.g., Tech, Education)
  location: { type: String }, // Company city or region
  foundedDate: { type: String }, // Year or date founded
  role: { type: String, default: "Company" }, // Role type for login
  bankInfo: {
    accountHolder: { type: String },
    bankName: { type: String },
    accountNumber: { type: String },
    iban: { type: String },
  }, // Company bank details (optional)
  createdAt: { type: Date, default: Date.now }, // Account creation date
});

// Create the model
const CompanyModel = mongoose.model("Company", companySchema);

export default CompanyModel;
