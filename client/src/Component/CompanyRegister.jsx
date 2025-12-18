// Import React and hooks
import React, { useEffect, useState } from "react";
// Import Redux hooks
import { useDispatch, useSelector } from "react-redux";
// Import company actions
import { registerCompany, resetState } from "../Features/CompanySlice";
// Import routing utilities
import { useNavigate, Link } from "react-router-dom";
// Import react-hook-form
import { useForm } from "react-hook-form";
// Import yup resolver
import { yupResolver } from "@hookform/resolvers/yup";
// Import validation schema
import { CompanyRegisterSchema } from "../Validations/CompanyRegisterValidation";
// Import styles
import "../Styles/CompanyRegister.css";
// Import image
import companyImg from "../Images/company-man.png";

// Define industries list
const INDUSTRIES = [
  "",
  "Technology",
  "Hospitality / Coffee Shops",
  "Retail / Store",
  "Education",
  "Logistics",
  "Government",
  "Other",
];

// Define locations list
const LOCATIONS = ["", "Salalah", "Taqah", "Mirbat", "Mughsail", "Other"];

// Define CompanyRegister component
const CompanyRegister = () => {
  // Initialize dispatch
  const dispatch = useDispatch();
  // Initialize navigation
  const navigate = useNavigate();

  // Get company state from Redux
  const { isLoading, registerSuccess, isError, message } = useSelector(
    (state) => state.companies
  );

  // Company name state
  const [companyName, setCompanyName] = useState("");
  // Email state
  const [email, setEmail] = useState("");
  // Password state
  const [password, setPassword] = useState("");
  // Industry state
  const [industry, setIndustry] = useState("");
  // Location state
  const [location, setLocation] = useState("");
  // Founded date state
  const [foundedDate, setFoundedDate] = useState("");

  // Initialize form handling
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    // Apply validation schema
    resolver: yupResolver(CompanyRegisterSchema),
    // Validate on change
    mode: "onChange",
  });

  // Reset Redux state on load
  useEffect(() => {
    // Dispatch reset state
    dispatch(resetState());
  }, [dispatch]);

  // Handle form submission
  const onSubmit = (data) => {
    // Dispatch register company
    dispatch(
      registerCompany({
        ...data,
        role: "company",
      })
    );
  };

  // Handle successful registration
  useEffect(() => {
    // Check success flag
    if (registerSuccess) {
      // Show success alert
      alert("Company registered successfully!");
      // Reset form fields
      reset();
      // Reset Redux state
      dispatch(resetState());
      // Navigate to profile
      navigate("/company-profile");
    }
  }, [registerSuccess, reset, navigate, dispatch]);

  // Handle registration error
  useEffect(() => {
    // Check if there is an error from the database
    if (isError && message) {
      const errorText =
        typeof message === "string"
          ? message
          : message.error || "Email already registered";

      alert(errorText);
      dispatch(resetState());
    }
  }, [isError, message, dispatch]);
  // Return JSX
  return (
    // Register page container
    <div className="register-page">
      {/* Register container */}
      <div className="register-container">
        {/* Register form section */}
        <div className="register-form">
          {/* Page title */}
          <h1 className="reg-title">
            Create your <span className="accent">account</span>
          </h1>
          {/* Subtitle */}
          <p className="reg-sub">Please fill in your company details</p>

          {/* Role switch buttons */}
          <div className="role-switch">
            <Link to="/student-register" className="role-btn">
              Student
            </Link>
            <Link to="/company-register" className="role-btn active">
              Company
            </Link>
          </div>

          {/* Registration form */}
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Company name label */}
            <label>Company Name</label>
            <input
              type="text"
              value={companyName}
              {...register("companyName", {
                onChange: (e) => setCompanyName(e.target.value),
              })}
            />
            <p className="error">{errors.companyName?.message}</p>

            {/* Email label */}
            <label>Email</label>
            <input
              type="email"
              value={email}
              {...register("email", {
                onChange: (e) => setEmail(e.target.value),
              })}
            />
            <p className="error">{errors.email?.message}</p>

            {/* Password label */}
            <label>Password</label>
            <input
              type="password"
              value={password}
              {...register("password", {
                onChange: (e) => setPassword(e.target.value),
              })}
            />
            <p className="error">{errors.password?.message}</p>

            {/* Row container */}
            <div className="row-flex">
              {/* Industry column */}
              <div className="col-half">
                <label>Industry Type</label>
                <select
                  value={industry}
                  {...register("industry", {
                    onChange: (e) => setIndustry(e.target.value),
                  })}
                >
                  {INDUSTRIES.map((i, idx) => (
                    <option key={idx} value={i}>
                      {i === "" ? "Select your industry" : i}
                    </option>
                  ))}
                </select>
                <p className="error">{errors.industry?.message}</p>
              </div>

              {/* Location column */}
              <div className="col-half">
                <label>Location</label>
                <select
                  value={location}
                  {...register("location", {
                    onChange: (e) => setLocation(e.target.value),
                  })}
                >
                  {LOCATIONS.map((l, idx) => (
                    <option key={idx} value={l}>
                      {l === "" ? "Select your location" : l}
                    </option>
                  ))}
                </select>
                <p className="error">{errors.location?.message}</p>
              </div>
            </div>

            {/* Founded date label */}
            <label>Founded Date</label>
            <input
              type="date"
              value={foundedDate}
              {...register("foundedDate", {
                onChange: (e) => setFoundedDate(e.target.value),
              })}
            />
            <p className="error">{errors.foundedDate?.message}</p>

            {/* Submit button */}
            <button type="submit" className="reg-btn" disabled={isLoading}>
              {isLoading ? "Registering..." : "Sign up"}
            </button>

            {/* Login redirect */}
            <p className="login-text">
              Already have an account?{" "}
              <Link to="/login" className="login-link">
                Log in now.
              </Link>
            </p>
          </form>
        </div>

        {/* Image section */}
        <div className="register-image">
          <img src={companyImg} alt="Company registration" />
        </div>
      </div>
    </div>
  );
};

// Export CompanyRegister component
export default CompanyRegister;
