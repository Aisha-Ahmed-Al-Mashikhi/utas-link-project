import * as yup from "yup";

// EXPIRY (YYYY-MM)
const today = new Date();
const currentMonth = today.toISOString().slice(0, 7);

export const bankCardSchema = yup.object().shape({
  selectedBank: yup.string().required("Please select your bank"),

  cardNumber: yup
    .string()
    .required("Card number is required")
    .matches(/^\d{4} \d{4} \d{4} \d{4}$/, "Card number must be 16 digits"),

  cardName: yup
    .string()
    .required("Cardholder name is required")
    .min(3, "Name must be at least 3 characters"),

  expiry: yup
    .string()
    .required("Expiration date is required")
    .test(
      "valid-expiry",
      "Expiration date cannot be in the past",
      (value) => !value || value >= currentMonth
    ),

  cvv: yup
    .string()
    .required("CVV is required")
    .matches(/^\d{3,4}$/, "CVV must be 3 or 4 digits"),
});
