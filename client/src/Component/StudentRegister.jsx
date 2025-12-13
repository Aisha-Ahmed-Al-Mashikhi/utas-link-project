// Import React and required hooks
import React, { useEffect, useState } from "react";
// Import Redux hooks
import { useDispatch, useSelector } from "react-redux";
// Import register action and reset action
import { registerUser, resetState } from "../Features/UserSlice";
// Import navigation and linking tools
import { useNavigate, Link } from "react-router-dom";
// Import React Hook Form
import { useForm } from "react-hook-form";
// Import Yup resolver
import { yupResolver } from "@hookform/resolvers/yup";
// Import validation schema
import { StudentRegisterSchema } from "../Validations/StudentRegisterValidation";
// Import styles
import "../Styles/UserRegister.css";
// Import registration image
import registerImg from "../Images/login-side.png";

// Define available majors
const MAJORS = [
  "",
  "Information Technology",
  "Business Administration",
  "Engineering",
  "Mass Communication",
];

// Define StudentRegister component
const StudentRegister = () => {
  // Initialize dispatch
  const dispatch = useDispatch();
  // Initialize navigation
  const navigate = useNavigate();

  // Get registration states from Redux
  const { isLoading, registerSuccess, isError, message } = useSelector(
    (state) => state.users
  );

  // Store student name
  const [name, setName] = useState("");
  // Store student age
  const [age, setAge] = useState("");
  // Store student email
  const [email, setEmail] = useState("");
  // Store student password
  const [password, setPassword] = useState("");
  // Store selected major
  const [major, setMajor] = useState("");

  // Initialize React Hook Form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(StudentRegisterSchema),
  });

  // Reset Redux state when page loads
  useEffect(() => {
    dispatch(resetState());
  }, [dispatch]);

  // Handle form submission
  const onSubmit = (data) => {
    // Prepare final data with student role
    const finalData = {
      ...data,
      role: "student",
    };
    // Dispatch register action
    dispatch(registerUser(finalData));
  };

  // Handle successful registration
  useEffect(() => {
    if (registerSuccess) {
      alert("Student registered successfully!");
      reset();
      dispatch(resetState());
      navigate("/student-profile");
    }
  }, [registerSuccess, reset, navigate, dispatch]);

  // Handle registration error
  useEffect(() => {
    if (isError && message) {
      alert(message);
      dispatch(resetState());
    }
  }, [isError, message, dispatch]);

  // Return JSX
  return (
    // Main registration page container
    <div className="register-page">
      <div className="register-container">
        {/* Left side form */}
        <div className="register-form">
          <h1 className="reg-title">
            Create your <span className="accent">account</span>
          </h1>
          <p className="reg-sub">Please fill in your details to continue</p>

          {/* Role switch buttons */}
          <div className="role-switch">
            <Link to="/student-register" className="role-btn active">
              Student
            </Link>
            <Link to="/company-register" className="role-btn">
              Company
            </Link>
          </div>

          {/* Registration form */}
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Name and age row */}
            <div className="row-flex">
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

            {/* Email and password row */}
            <div className="row-flex">
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

            {/* Major selection */}
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

            {/* Submit button */}
            <button type="submit" className="reg-btn" disabled={isLoading}>
              {isLoading ? "Registering..." : "Sign up"}
            </button>

            {/* Login link */}
            <p className="login-text">
              Already have an account?
              <Link to="/login" className="login-link">
                {" "}
                Log in now!
              </Link>
            </p>
          </form>
        </div>

        {/* Right side image */}
        <div className="register-image">
          <img src={registerImg} alt="Registration illustration" />
        </div>
      </div>
    </div>
  );
};

// Export component
export default StudentRegister;
