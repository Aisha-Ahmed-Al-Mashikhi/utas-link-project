// Yup validation library
import * as yup from "yup";

// Today date (YYYY-MM-DD)
const today = new Date().toISOString().split("T")[0];

// Company register validation schema
export const CompanyRegisterSchema = yup.object({
  // Company name field
  companyName: yup
    .string() // String value
    .trim() // Remove spaces
    .min(3, "Company name must be at least 3 characters") // Minimum length
    .required("Company Name is required"), // Required

  // Email field
  email: yup
    .string() // String value
    .trim() // Remove spaces
    .email("Please enter a valid email address") // Email format
    .required("Email is required"), // Required

  // Password field
  password: yup
    .string() // String value
    .min(8, "Password must be at least 8 characters") // Minimum length
    .required("Password is required"), // Required

  // Industry field
  industry: yup.string().required("Please select your industry type"), // Required

  // Location field
  location: yup.string().required("Please select your location"), // Required

  // Founded date field
  foundedDate: yup
    .string() // String value
    .required("Founded date is required") // Required
    .matches(/^\d{4}-\d{2}-\d{2}$/, "Please select a valid date") // Date format
    .test(
      "not-in-future", // Test name
      "Founded date cannot be in the future", // Error message
      (value) => !value || value <= today // Date check
    ),
});
