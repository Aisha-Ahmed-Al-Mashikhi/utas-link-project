import * as yup from "yup";

const today = new Date().toISOString().split("T")[0];

export const companySchemaValidation = yup.object({
  companyName: yup
    .string()
    .trim()
    .min(3, "Company name must be at least 3 characters")
    .required("Company Name is required"),

  email: yup
    .string()
    .trim()
    .email("Please enter a valid email address")
    .required("Email is required"),

  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),

  industry: yup.string().required("Please select your industry type"),

  location: yup.string().required("Please select your location"),

  foundedDate: yup
    .string()
    .required("Founded date is required")
    .matches(/^\d{4}-\d{2}-\d{2}$/, "Please select a valid date")
    .test(
      "not-in-future",
      "Founded date cannot be in the future",
      (value) => !value || value <= today
    ),
});
