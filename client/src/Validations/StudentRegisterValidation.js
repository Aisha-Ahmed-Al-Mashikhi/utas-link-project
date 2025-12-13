// Import Yup validation library
import * as yup from "yup";

// Student registration validation schema
export const StudentRegisterSchema = yup.object({
  // Student full name field
  name: yup
    .string() // Expect string input
    .trim() // Remove extra spaces
    .min(3, "Full name must be at least 3 characters") // Minimum length
    .required("Full name is required"), // Mandatory field

  // Student email field
  email: yup
    .string() // Expect string input
    .trim() // Remove extra spaces
    .email("Please enter a valid email address") // Email format validation
    .required("Email is required"), // Mandatory field

  // Student password field
  password: yup
    .string() // Expect string input
    .min(8, "Password must be at least 8 characters") // Minimum length
    .required("Password is required"), // Mandatory field

  // Student major field
  major: yup
    .string() // Expect string input
    .required("Please select your major"), // Mandatory field

  // Student age field
  age: yup
    .number() // Expect number input
    .typeError("Please enter a valid age") // Enforce numeric value
    .min(19, "Minimum age is 19") // Minimum allowed age
    .max(25, "Maximum age is 25") // Maximum allowed age
    .required("Age is required"), // Mandatory field
});
