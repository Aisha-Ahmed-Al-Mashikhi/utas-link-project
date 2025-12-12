import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerCompany } from "../Features/CompanySlice";
import { resetState } from "../Features/UserSlice";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { CompanyRegisterSchema } from "../Validations/CompanyRegisterValidation";
import "../Styles/CompanyRegister.css";
import companyImg from "../Images/company-man.png";

// Predefined industries and locations
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
const LOCATIONS = ["", "Salalah", "Taqah", "Mirbat", "Mughsail", "Other"];

const CompanyRegister = () => {
  // Used to trigger Redux actions (ex: registerUser, login, logout)
  const dispatch = useDispatch();
  // Used to navigate programmatically to another page after an action (ex: redirect after registration)
  const navigate = useNavigate();

  // Read registration status from Redux
 const { isLoading, isError, isSuccess, user } = useSelector(
  (state) => state.users
);

  // Local states for controlled components
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [industry, setIndustry] = useState("");
  const [location, setLocation] = useState("");
  const [foundedDate, setFoundedDate] = useState("");

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(CompanyRegisterSchema),
    mode: "onChange",
  });

  // Submit handler
  const onSubmit = (data) => {
    const finalData = {
      ...data,
      role: "company", // Assign company role for backend
    };
    dispatch(registerCompany(finalData));
  };

useEffect(() => {
  if (isSuccess && company) {
    localStorage.setItem("loggedUser", JSON.stringify(company));
    localStorage.setItem("role", "company");

    reset();
    navigate("/company-profile");
  }

  if (isError) {
    alert("Registration failed. Please try again.");
  }
}, [isSuccess, isError, company, navigate, reset]);



  return (
    <div className="register-page">
      <div className="register-container">
        {/* Left Side - Registration Form */}
        <div className="register-form">
          <h1 className="reg-title">
            Create your <span className="accent">account</span>
          </h1>
          <p className="reg-sub">Please fill in your company details</p>

          {/* Role Switch Buttons */}
          <div className="role-switch">
            <Link to="/student-register" className="role-btn">
              Student
            </Link>
            <Link to="/company-register" className="role-btn active">
              Company
            </Link>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* COMPANY NAME */}
            <label>Company Name</label>
            <input
              type="text"
              placeholder="Your company name"
              value={companyName}
              {...register("companyName", {
                onChange: (e) => setCompanyName(e.target.value),
              })}
            />
            <p className="error">{errors.companyName?.message}</p>

            {/* EMAIL */}
            <label>Email</label>
            <input
              type="email"
              placeholder="hr@company.com"
              value={email}
              {...register("email", {
                onChange: (e) => setEmail(e.target.value),
              })}
            />
            <p className="error">{errors.email?.message}</p>

            {/* PASSWORD */}
            <label>Password</label>
            <input
              type="password"
              placeholder="********"
              value={password}
              {...register("password", {
                onChange: (e) => setPassword(e.target.value),
              })}
            />
            <p className="error">{errors.password?.message}</p>

            {/* INDUSTRY & LOCATION */}
            <div className="row-flex">
              <div className="col-half">
                <label>Industry Type</label>
                <select
                  value={industry}
                  {...register("industry", {
                    onChange: (e) => setIndustry(e.target.value),
                  })}
                >
                  {INDUSTRIES.map((i, index) => (
                    <option key={index} value={i}>
                      {i === "" ? "Select your industry" : i}
                    </option>
                  ))}
                </select>
                <p className="error">{errors.industry?.message}</p>
              </div>

              <div className="col-half">
                <label>Location</label>
                <select
                  value={location}
                  {...register("location", {
                    onChange: (e) => setLocation(e.target.value),
                  })}
                >
                  {LOCATIONS.map((l, index) => (
                    <option key={index} value={l}>
                      {l === "" ? "Select your location" : l}
                    </option>
                  ))}
                </select>
                <p className="error">{errors.location?.message}</p>
              </div>
            </div>

            {/* FOUNDED DATE */}
            <label>Founded Date</label>
            <input
              type="date"
              value={foundedDate}
              {...register("foundedDate", {
                onChange: (e) => setFoundedDate(e.target.value),
              })}
            />
            <p className="error">{errors.foundedDate?.message}</p>

            {/* SUBMIT BUTTON */}
            <button type="submit" className="reg-btn" disabled={isLoading}>
              {isLoading ? "Registering..." : "Sign up"}
            </button>

            {/* LOGIN LINK */}
            <p className="login-text">
              Already have an account?{" "}
              <Link to="/login" className="login-link">
                Log in now.
              </Link>
            </p>
          </form>
        </div>

        {/* Right Side - Illustration */}
        <div className="register-image">
          <img src={companyImg} alt="Company registration" />
        </div>
      </div>
    </div>
  );
};

export default CompanyRegister;
