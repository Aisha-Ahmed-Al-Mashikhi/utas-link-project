import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../Features/UserSlice";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { userRegisterSchema } from "../Validations/UserValidation";
import "../Styles/UserRegister.css";
import registerImg from "../Images/login-side.png";

const MAJORS = [
  "",
  "Information Technology",
  "Business Administration",
  "Engineering",
  "Mass Communication",
];

const UserRegister = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, isError, isSuccess } = useSelector((state) => state.users);

  // Input states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [major, setMajor] = useState("");
  const [age, setAge] = useState("");

  // React Hook Form configuration
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(userRegisterSchema),
  });

  // Submit form
  const onSubmit = (data) => {
    dispatch(registerUser(data));
  };

  // Handle registration response
  useEffect(() => {
    if (isSuccess) {
      alert("Student registered successfully!");
      reset();
      navigate("/user-profile");
    } else if (isError) {
      alert("Registration failed. Please try again.");
    }
  }, [isSuccess, isError, navigate, reset]);

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
            <Link to="/user-register" className="role-btn active">
              Student
            </Link>
            <Link to="/company-register" className="role-btn">
              Company
            </Link>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* NAME + AGE */}
            <div className="row-flex">
              <div className="col-half form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  placeholder="Your name"
                  {...register("name")}
                />
                <p className="error">{errors.name?.message}</p>
              </div>

              <div className="col-half form-group">
                <label>Age</label>
                <input
                  type="number"
                  placeholder="Your age"
                  {...register("age")}
                />
                <p className="error">{errors.age?.message}</p>
              </div>
            </div>

            {/* EMAIL + PASSWORD */}
            <div className="row-flex">
              <div className="col-half form-group">
                <label>Email</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  {...register("email")}
                />
                <p className="error">{errors.email?.message}</p>
              </div>

              <div className="col-half form-group">
                <label>Password</label>
                <input
                  type="password"
                  placeholder="********"
                  {...register("password")}
                />
                <p className="error">{errors.password?.message}</p>
              </div>
            </div>

            {/* MAJOR */}
            <div className="form-group">
              <label>Major</label>
              <select {...register("major")}>
                {MAJORS.map((m, i) => (
                  <option key={i} value={m}>
                    {m === "" ? "Select your major" : m}
                  </option>
                ))}
              </select>
              <p className="error">{errors.major?.message}</p>
            </div>

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

        {/* Right Side - Image */}
        <div className="register-image">
          <img src={registerImg} alt="Registration illustration" />
        </div>
      </div>
    </div>
  );
};

export default UserRegister;
