// ===================== IMPORTS =====================
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, resetState } from "../Features/UserSlice";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { StudentRegisterSchema } from "../Validations/StudentRegisterValidation";
import "../Styles/UserRegister.css";
import registerImg from "../Images/login-side.png";

// ===================== PREDEFINED MAJORS =====================
const MAJORS = [
  "",
  "Information Technology",
  "Business Administration",
  "Engineering",
  "Mass Communication",
];

const StudentRegister = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 🔥 only what we need
  const { isLoading, registerSuccess, isError, message } = useSelector(
    (state) => state.users
  );

  // Controlled states
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [major, setMajor] = useState("");

  // React Hook Form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(StudentRegisterSchema),
  });

  // ===================== RESET STATE ON PAGE LOAD =====================
  useEffect(() => {
    dispatch(resetState());
  }, [dispatch]);

  // ===================== SUBMIT HANDLER =====================
  const onSubmit = (data) => {
    const finalData = {
      ...data,
      role: "student",
    };
    dispatch(registerUser(finalData));
  };

  // ===================== HANDLE REGISTER SUCCESS =====================
  useEffect(() => {
    if (registerSuccess) {
      alert("Student registered successfully!");
      reset();
      dispatch(resetState());
      navigate("/student-profile");
    }
  }, [registerSuccess, reset, navigate, dispatch]);

  // ===================== HANDLE ERROR =====================
  useEffect(() => {
    if (isError && message) {
      alert(message);
      dispatch(resetState());
    }
  }, [isError, message, dispatch]);

  return (
    <div className="register-page">
      <div className="register-container">
        {/* LEFT SIDE - FORM */}
        <div className="register-form">
          <h1 className="reg-title">
            Create your <span className="accent">account</span>
          </h1>
          <p className="reg-sub">Please fill in your details to continue</p>

          {/* ROLE SWITCH */}
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

            {/* EMAIL + PASSWORD */}
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

            {/* SUBMIT */}
            <button type="submit" className="reg-btn" disabled={isLoading}>
              {isLoading ? "Registering..." : "Sign up"}
            </button>

            {/* LOGIN LINK */}
            <p className="login-text">
              Already have an account?
              <Link to="/login" className="login-link">
                {" "}
                Log in now!
              </Link>
            </p>
          </form>
        </div>

        {/* RIGHT SIDE IMAGE */}
        <div className="register-image">
          <img src={registerImg} alt="Registration illustration" />
        </div>
      </div>
    </div>
  );
};

export default StudentRegister;
