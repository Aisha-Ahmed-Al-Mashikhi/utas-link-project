// Yup validation library
import * as yup from "yup";

// Current date
const today = new Date();
// Current month in YYYY-MM
const currentMonth = today.toISOString().slice(0, 7);

// Bank card validation schema
export const bankCardSchema = yup.object().shape({
  // Selected bank field
  selectedBank: yup.string().required("Please select your bank"),

  // Card number field
  cardNumber: yup
    .string() // String value
    .required("Card number is required") // Required
    .matches(/^\d{4} \d{4} \d{4} \d{4}$/, "Card number must be 16 digits"), // Format check

  // Cardholder name field
  cardName: yup
    .string() // String value
    .required("Cardholder name is required") // Required
    .min(3, "Name must be at least 3 characters"), // Minimum length

  // Expiry date field
  expiry: yup
    .string() // String value
    .required("Expiration date is required") // Required
    .test(
      "valid-expiry", // Test name
      "Expiration date cannot be in the past", // Error message
      (value) => !value || value >= currentMonth // Date check
    ),

  // CVV field
  cvv: yup
    .string() // String value
    .required("CVV is required") // Required
    .matches(/^\d{3,4}$/, "CVV must be 3 or 4 digits"), // Length check
});
