import * as yup from "yup";

export const companyBankSchema = yup.object().shape({
  selectedBank: yup.string().required("Please select a bank"),
  accountNumber: yup
    .string()
    .matches(/^[0-9 ]+$/, "Numbers only")
    .min(16, "Account number must be at least 16 digits")
    .required("Account number is required"),
  accountHolder: yup.string().required("Cardholder name is required"),
  iban: yup
    .string()
    .matches(/^OM\d{2}[A-Z0-9]{18}$/, "Invalid IBAN format")
    .required("IBAN is required"),
});
