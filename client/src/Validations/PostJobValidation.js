// Import Yup validation library
import * as yup from "yup";

// Job posting validation schema
export const postJobSchema = yup.object().shape({
  // Job title field
  jobTitle: yup
    .string() // Expect string
    .required("Job title is required") // Mandatory field
    .min(3, "Too short — at least 3 characters"), // Minimum length

  // Job sector field
  sector: yup
    .string() // Expect string
    .required("Please enter a sector"), // Mandatory field

  // Job category field
  category: yup
    .string() // Expect string
    .required("Please enter a category"), // Mandatory field

  // Job rate field
  rate: yup
    .number() // Expect number
    .typeError("Rate must be a number") // Enforce numeric input
    .required("Rate is required") // Mandatory field
    .positive("Rate must be positive"), // Must be greater than zero

  // Rate type field
  rateType: yup
    .string() // Expect string
    .required("Select a rate type"), // Mandatory field

  // Optional payout field
  payout: yup
    .string() // Expect string
    .notRequired(), // Optional field

  // Skills field
  skills: yup
    .string() // Expect string
    .required("Please add at least one skill") // Mandatory field
    .min(3, "Please add more skills"), // Minimum length

  // Job description field
  description: yup
    .string() // Expect string
    .required("Description is required") // Mandatory field
    .min(10, "Add more details about the job"), // Minimum length

  // Duration
  postDuration: yup
    .number()
    .typeError("Must be a number")
    .required("Duration is required")
    .min(1, "Minimum 1 day")
    .max(90, "Maximum 90 days"),
});
