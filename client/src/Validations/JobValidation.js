import * as yup from "yup";

export const postJobSchema = yup.object({
  jobTitle: yup.string().trim().required("Job title is required"),
  organization: yup.string().trim().required("Organization name is required"),
  category: yup.string().trim().required("Category is required"),
  sector: yup.string().trim().required("Sector is required"),
  rate: yup
    .number()
    .typeError("Rate must be a number")
    .positive("Rate must be greater than zero")
    .required("Rate is required"),
  rateType: yup.string().required("Please select a rate type"),
  skills: yup.string().trim().required("Please specify required skills"),
  description: yup
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters")
    .required("Description is required"),
  payout: yup.string().trim().optional(),
});
