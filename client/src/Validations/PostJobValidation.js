import * as yup from "yup";

export const postJobSchema = yup.object().shape({
  jobTitle: yup
    .string()
    .required("Job title is required")
    .min(8, "Too short — at least 8 characters"),
  organization: yup
    .string()
    .required("Organization name is required")
    .min(8, "Too short — at least 8 characters"),
  sector: yup.string().required("Please select a sector"),
  category: yup.string().required("Please select a category"),
  rate: yup
    .number()
    .typeError("Rate must be a number")
    .required("Rate is required")
    .positive("Rate must be positive"),
  rateType: yup.string().required("Select a rate type"),
  payout: yup.string().required("Select a payout option"),
  skills: yup.string().required("Please add at least one skill"),
  description: yup
    .string()
    .required("Description is required")
    .min(10, "Add more details about the job"),
});
