import * as yup from "yup";

export const StudentRegisterSchema = yup.object({
  name: yup
    .string()
    .trim()
    .min(3, "Full name must be at least 3 characters")
    .required("Full name is required"),
  email: yup
    .string()
    .trim()
    .email("Please enter a valid email address")
    .required("Email is required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  major: yup.string().required("Please select your major"),
  age: yup
    .number()
    .typeError("Please enter a valid age")
    .min(19, "Minimum age is 19")
    .max(25, "Maximum age is 25")
    .required("Age is required"),
});
