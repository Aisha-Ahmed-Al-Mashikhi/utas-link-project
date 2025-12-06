import * as yup from "yup";

export const postJobSchema = yup.object().shape({
  jobTitle: yup
    .string()
    .required("Job title is required")
    .min(3, "Too short — at least 3 characters"),

  sector: yup.string().required("Please enter a sector"),
  category: yup.string().required("Please enter a category"),
  rate: yup
    .number()
    .typeError("Rate must be a number")
    .required("Rate is required")
    .positive("Rate must be positive"),
  rateType: yup.string().required("Select a rate type"),
  payout: yup.string().notRequired(),
  skills: yup
    .string()
    .required("Please add at least one skill")
    .min(3, "Please add more skills"),
  description: yup
    .string()
    .required("Description is required")
    .min(10, "Add more details about the job"),
});
