import * as yup from "yup";

export const companySchemaValidation = yup.object().shape({
  companyName: yup
    .string()
    .min(3, "Company name must be at least 3 characters")
    .required("Company name is required"),
  email: yup
    .string()
    .email("Enter a valid email address")
    .required("Email is required"),
  industry: yup
    .string()
    .min(2, "Please enter a valid industry type")
    .required("Industry type is required"),
  location: yup
    .string()
    .min(2, "Please enter a valid location")
    .required("Location is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .matches(/[A-Z]/, "Password must include one uppercase letter")
    .matches(/[0-9]/, "Password must include one number")
    .required("Password is required"),
});
