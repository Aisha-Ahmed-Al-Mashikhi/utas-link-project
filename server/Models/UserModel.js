import mongoose from "mongoose";

// Define the schema for students
const userSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Student full name
  email: { type: String, required: true, unique: true }, // Student email
  password: { type: String, required: true }, // Encrypted password
  major: { type: String }, // Student major or department
  age: { type: Number }, // Student age
  role: { type: String, default: "Student" }, // User role type
  createdAt: { type: Date, default: Date.now }, // Account creation date
  cvLink: String,
  // BANK CARD FIELDS
  cardNumber: String,
  cardName: String,
  expiry: String,
  cvv: String,
  bankName: String,
});

// Create the model
const UserModel = mongoose.model("User", userSchema);

export default UserModel;
