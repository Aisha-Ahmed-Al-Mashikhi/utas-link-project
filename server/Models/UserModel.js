// Import mongoose
import mongoose from "mongoose";

// Create user schema
const userSchema = new mongoose.Schema({
  // Student full name
  name: { type: String, required: true },

  // Student email
  email: { type: String, required: true, unique: true },

  // Encrypted password
  password: { type: String, required: true },

  // Student major
  major: { type: String },

  // Student age
  age: { type: Number },

  // User role
  role: { type: String, default: "Student" },

  // Account creation date
  createdAt: { type: Date, default: Date.now },

  // CV file link
  cvLink: String,
});

// Create user model
const UserModel = mongoose.model("User", userSchema);

// Export model
export default UserModel;
