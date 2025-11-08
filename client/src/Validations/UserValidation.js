// Validation schema for student registration (user)
import * as yup from "yup";

export const userRegisterSchema = yup.object().shape({
  fullName: yup
    .string()
    .min(5, "Full name must be at least 5 characters")
    .required("Full name is required"),
  email: yup
    .string()
    .email("Please enter a valid email address")
    .required("Email is required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  major: yup
    .string()
    .test("not-empty", "Please select your major", (v) => v && v.trim() !== "")
    .required("Please select your major"),
  age: yup
    .number()
    .typeError("Please enter your age")
    .min(19, "Minimum age is 19")
    .max(25, "Maximum age is 25")
    .required("Age is required"),
});
