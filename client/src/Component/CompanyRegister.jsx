import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerCompany } from "../Features/CompanySlice";
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
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux state
  const { isLoading, isError, isSuccess } = useSelector(
    (state) => state.companies
  );

  // Local states
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [industry, setIndustry] = useState("");
  const [location, setLocation] = useState("");
  const [foundedDate, setFoundedDate] = useState("");

  // React Hook Form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(CompanyRegisterSchema),
  });

  // Submit handler
  const onSubmit = (data) => {
    const finalData = {
      ...data,
      role: "company",
    };
    dispatch(registerCompany(finalData));
  };

  // Handle register result
  useEffect(() => {
    if (isSuccess) {
      reset();
      navigate("/login"); // بعد التسجيل
    }

    if (isError) {
      alert("Registration failed. Please try again.");
    }
  }, [isSuccess, isError, navigate, reset]);

  return (
    <div className="register-page">
      <div className="register-container">
        {/* Form */}
        <div className="register-form">
          <h1 className="reg-title">
            Create your <span className="accent">company account</span>
          </h1>
          <p className="reg-sub">Please fill in your company details</p>

          {/* Role switch */}
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
                  {INDUSTRIES.map((i, idx) => (
                    <option key={idx} value={i}>
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
                  {LOCATIONS.map((l, idx) => (
                    <option key={idx} value={l}>
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

            <button type="submit" className="reg-btn" disabled={isLoading}>
              {isLoading ? "Registering..." : "Sign up"}
            </button>

            <p className="login-text">
              Already have an account?
              <Link to="/login" className="login-link">
                {" "}
                Log in now!
              </Link>
            </p>
          </form>
        </div>

        {/* Image */}
        <div className="register-image">
          <img src={companyImg} alt="Company registration" />
        </div>
      </div>
    </div>
  );
};

export default CompanyRegister;
