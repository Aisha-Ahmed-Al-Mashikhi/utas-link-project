import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerCompany } from "../Features/CompanySlice";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { companySchemaValidation } from "../Validations/CompanyValidation";
import "../Styles/CompanyRegister.css";
import companyImg from "../Images/company-man.png";

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
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, isError, isSuccess } = useSelector(
    (state) => state.companies
  );

  // Local state for controlled fields
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
    resolver: yupResolver(companySchemaValidation),
    mode: "onChange",
  });

  // Handle form submission
  const onSubmit = (data) => {
    dispatch(registerCompany(data));
  };

  // Redirects after success or failure
  useEffect(() => {
    if (isSuccess) {
      alert("Company registered successfully!");
      reset();
      navigate("/companyprofile");
    } else if (isError) {
      alert("Registration failed. Please try again.");
    }
  }, [isSuccess, isError, navigate, reset]);

  return (
    <div className="register-page">
      <div className="register-container">
        {/* Left side (Form) */}
        <div className="register-form">
          <h1 className="reg-title">
            Create your <span className="accent">account</span>
          </h1>
          <p className="reg-sub">Please fill in your company details</p>

          {/* Role Switch */}
          <div className="role-switch">
            <Link to="/user-register" className="role-btn">
              Student
            </Link>
            <Link to="/company-register" className="role-btn active">
              Company
            </Link>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Company Name */}
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

            {/* Email */}
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

            {/* Password */}
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

            {/* Industry and Location */}
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

            {/* Founded Date */}
            <label>Founded Date</label>
            <input
              type="date"
              value={foundedDate}
              {...register("foundedDate", {
                onChange: (e) => setFoundedDate(e.target.value),
              })}
            />
            <p className="error">{errors.foundedDate?.message}</p>

            {/* Submit */}
            <button type="submit" className="reg-btn" disabled={isLoading}>
              {isLoading ? "Registering..." : "Sign up"}
            </button>

            <p className="login-text">
              Already have an account?{" "}
              <Link to="/login" className="login-link">
                Log in now!
              </Link>
            </p>
          </form>
        </div>

        {/* Right side (Image) */}
        <div className="register-image">
          <img src={companyImg} alt="Company registration" />
        </div>
      </div>
    </div>
  );
};

export default CompanyRegister;
