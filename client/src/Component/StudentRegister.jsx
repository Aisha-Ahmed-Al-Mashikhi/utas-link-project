// React core + hooks for managing component state and lifecycle
import React, { useEffect, useState } from "react";
// Redux hooks: dispatch actions + read state from the Redux store
import { useDispatch, useSelector } from "react-redux";
// Redux async thunk: handles student/company registration request
import { registerUser, resetState } from "../Features/UserSlice";
// Router: navigate programmatically + link between pages
import { useNavigate, Link } from "react-router-dom";
// React Hook Form: manages form inputs, validation, and submission
import { useForm } from "react-hook-form";
// Connects Yup validation schema to React Hook Form
import { yupResolver } from "@hookform/resolvers/yup";
// Yup validation schema for validating all registration fields
import { StudentRegisterSchema } from "../Validations/StudentRegisterValidation";
// Component-specific CSS styling
import "../Styles/UserRegister.css";
// Registration page side image (illustration)
import registerImg from "../Images/login-side.png";

// Predefined majors
const MAJORS = [
  "",
  "Information Technology",
  "Business Administration",
  "Engineering",
  "Mass Communication",
];

const StudentRegister = () => {
  // Used to trigger Redux actions (ex: registerUser, login, logout)
  const dispatch = useDispatch();
  // Used to navigate programmatically to another page after an action (ex: redirect after registration)
  const navigate = useNavigate();

  // Read registration status from Redux
  const { isLoading, isError, isSuccess } = useSelector((state) => state.users);

  // Local states (Controlled Components)
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [major, setMajor] = useState("");

  // React Hook Form setup with Yup validation
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(StudentRegisterSchema),
  });

  // Submit handler
  const onSubmit = (data) => {
    const finalData = {
      ...data,
      role: "student", // Assign student role for backend
    };
    dispatch(registerUser(finalData));
  };

  // Handle success or error response
useEffect(() => {
  if (isSuccess && user) {
    localStorage.setItem("loggedUser", JSON.stringify(user));
    localStorage.setItem("role", "student");

    reset();
    navigate("/student-profile");
  }

  if (isError) {
    alert("Registration failed. Please try again.");
  }
}, [isSuccess, isError, user, navigate, reset]);

  return (
    <div className="register-page">
      <div className="register-container">
        {/* Left Side - Registration Form */}
        <div className="register-form">
          <h1 className="reg-title">
            Create your <span className="accent">account</span>
          </h1>
          <p className="reg-sub">Please fill in your details to continue</p>

          {/* Role Switch Buttons */}
          <div className="role-switch">
            <Link to="/student-register" className="role-btn active">
              Student
            </Link>
            <Link to="/company-register" className="role-btn">
              Company
            </Link>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* NAME + AGE */}
            <div className="row-flex">
              {/* FULL NAME */}
              <div className="col-half form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  placeholder="Your name"
                  value={name}
                  {...register("name", {
                    onChange: (e) => setName(e.target.value),
                  })}
                />
                <p className="error">{errors.name?.message}</p>
              </div>

              {/* AGE */}
              <div className="col-half form-group">
                <label>Age</label>
                <input
                  type="number"
                  placeholder="Your age"
                  value={age}
                  {...register("age", {
                    onChange: (e) => setAge(e.target.value),
                  })}
                />
                <p className="error">{errors.age?.message}</p>
              </div>
            </div>

            {/* EMAIL + PASSWORD */}
            <div className="row-flex">
              {/* EMAIL */}
              <div className="col-half form-group">
                <label>Email</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  {...register("email", {
                    onChange: (e) => setEmail(e.target.value),
                  })}
                />
                <p className="error">{errors.email?.message}</p>
              </div>

              {/* PASSWORD */}
              <div className="col-half form-group">
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
              </div>
            </div>

            {/* MAJOR */}
            <div className="form-group">
              <label>Major</label>
              <select
                value={major}
                {...register("major", {
                  onChange: (e) => setMajor(e.target.value),
                })}
              >
                {MAJORS.map((m, i) => (
                  <option key={i} value={m}>
                    {m === "" ? "Select your major" : m}
                  </option>
                ))}
              </select>
              <p className="error">{errors.major?.message}</p>
            </div>

            {/* SUBMIT BUTTON */}
            <button type="submit" className="reg-btn" disabled={isLoading}>
              {isLoading ? "Registering..." : "Sign up"}
            </button>

            {/* SWITCH TO LOGIN */}
            <p className="login-text">
              Already have an account?
              <Link to="/login" className="login-link">
                {" "}
                Log in now!
              </Link>
            </p>
          </form>
        </div>

        {/* Right Side - Image */}
        <div className="register-image">
          <img src={registerImg} alt="Registration illustration" />
        </div>
      </div>
    </div>
  );
};

export default StudentRegister;
