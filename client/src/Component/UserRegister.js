import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { userRegisterSchema } from "../Validations/UserValidation";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../Styles/UserRegister.css";
import registerImg from "../Images/login-side.png"; // 🔹 الصورة (اللي فيها الطالب والشركة)

const MAJORS = [
  "",
  "Information Technology",
  "Business Administration",
  "Engineering",
  "Mass Communication",
];

const UserRegister = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState("student");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(userRegisterSchema),
  });

  const onSubmit = (data) => {
    localStorage.setItem("userData", JSON.stringify(data));
    alert("Student Registered ✅");
    navigate("/user-profile");
  };

  const handleRoleSwitch = (newRole) => {
    setRole(newRole);
    if (newRole === "company") {
      navigate("/company-register");
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        {/* Left Side - Form */}
        <div className="register-form">
          <h1 className="reg-title">
            Create your <span className="accent">account</span>
          </h1>
          <p className="reg-sub">Please fill in your details to continue</p>

          <div className="role-switch">
            <button
              type="button"
              className={role === "student" ? "role-btn active" : "role-btn"}
              onClick={() => handleRoleSwitch("student")}
            >
              Student
            </button>
            <button
              type="button"
              className={role === "company" ? "role-btn active" : "role-btn"}
              onClick={() => handleRoleSwitch("company")}
            >
              Company
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <label>Full Name</label>
            <input
              type="text"
              placeholder="Your name"
              {...register("fullName")}
            />
            <p className="error">{errors.fullName?.message}</p>

            <label>Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              {...register("email")}
            />
            <p className="error">{errors.email?.message}</p>

            <label>Password</label>
            <input
              type="password"
              placeholder="********"
              {...register("password")}
            />
            <p className="error">{errors.password?.message}</p>

            <div className="row-flex">
              <div className="col-half">
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

              <div className="col-half">
                <label>Age</label>
                <input type="number" min="17" max="45" {...register("age")} />
                <p className="error">{errors.age?.message}</p>
              </div>
            </div>

            <button type="submit" className="reg-btn">
              Sign up
            </button>

            <p className="login-text">
              Already have an account?{" "}
              <Link to="/login" className="login-link">
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
