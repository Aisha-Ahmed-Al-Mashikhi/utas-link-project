// Yup validation library
import * as yup from "yup";

// Job post validation schema
export const postJobSchema = yup.object({
  // Job title field
  jobTitle: yup
    .string() // String value
    .trim() // Remove spaces
    .required("Job title is required"), // Required

  // Organization name field
  organization: yup
    .string() // String value
    .trim() // Remove spaces
    .required("Organization name is required"), // Required

  // Category field
  category: yup
    .string() // String value
    .trim() // Remove spaces
    .required("Category is required"), // Required

  // Sector field
  sector: yup
    .string() // String value
    .trim() // Remove spaces
    .required("Sector is required"), // Required

  // Rate field
  rate: yup
    .number() // Numeric value
    .typeError("Rate must be a number") // Must be number
    .positive("Rate must be greater than zero") // Must be positive
    .required("Rate is required"), // Required

  // Rate type field
  rateType: yup
    .string() // String value
    .required("Please select a rate type"), // Required

  // Skills field
  skills: yup
    .string() // String value
    .trim() // Remove spaces
    .required("Please specify required skills"), // Required

  // Description field
  description: yup
    .string() // String value
    .trim() // Remove spaces
    .min(10, "Description must be at least 10 characters") // Min length
    .required("Description is required"), // Required

  // Payout field (optional)
  payout: yup
    .string() // String value
    .trim() // Remove spaces
    .optional(), // Optional
});
