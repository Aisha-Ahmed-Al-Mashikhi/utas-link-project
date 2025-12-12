import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerCompany, resetState } from "../Features/CompanySlice";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { CompanyRegisterSchema } from "../Validations/CompanyRegisterValidation";
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

  const { isLoading, registerSuccess, isError, message } = useSelector(
    (state) => state.companies
  );

  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [industry, setIndustry] = useState("");
  const [location, setLocation] = useState("");
  const [foundedDate, setFoundedDate] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(CompanyRegisterSchema),
    mode: "onChange",
  });

  // 🔥 reset redux state when page opens
  useEffect(() => {
    dispatch(resetState());
  }, [dispatch]);

  const onSubmit = (data) => {
    dispatch(
      registerCompany({
        ...data,
        role: "company",
      })
    );
  };

  // ✅ success only after submit
  useEffect(() => {
    if (registerSuccess) {
      alert("Company registered successfully!");
      reset();
      dispatch(resetState());
      navigate("/company-profile");
    }
  }, [registerSuccess, reset, navigate, dispatch]);

  // ❌ error handling
 useEffect(() => {
  if (isError && message) {
    alert(
      typeof message === "string"
        ? message
        : message.msg || "Registration failed"
    );
    dispatch(resetState());
  }
}, [isError, message, dispatch]);

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-form">
          <h1 className="reg-title">
            Create your <span className="accent">account</span>
          </h1>
          <p className="reg-sub">Please fill in your company details</p>

          <div className="role-switch">
            <Link to="/student-register" className="role-btn">
              Student
            </Link>
            <Link to="/company-register" className="role-btn active">
              Company
            </Link>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <label>Company Name</label>
            <input
              type="text"
              value={companyName}
              {...register("companyName", {
                onChange: (e) => setCompanyName(e.target.value),
              })}
            />
            <p className="error">{errors.companyName?.message}</p>

            <label>Email</label>
            <input
              type="email"
              value={email}
              {...register("email", {
                onChange: (e) => setEmail(e.target.value),
              })}
            />
            <p className="error">{errors.email?.message}</p>

            <label>Password</label>
            <input
              type="password"
              value={password}
              {...register("password", {
                onChange: (e) => setPassword(e.target.value),
              })}
            />
            <p className="error">{errors.password?.message}</p>

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
              Already have an account?{" "}
              <Link to="/login" className="login-link">
                Log in now.
              </Link>
            </p>
          </form>
        </div>

        <div className="register-image">
          <img src={companyImg} alt="Company registration" />
        </div>
      </div>
    </div>
  );
};

export default CompanyRegister;
