import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchemaValidation } from "../Validations/LoginValidation";
import { Link, useNavigate } from "react-router-dom";
import "../Styles/Login.css";
import loginImg from "../Images/user-register.png"; // الصورة نفسها للجانب الأيمن

const Login = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchemaValidation),
  });

  const onSubmit = (data) => {
    alert("Login successful ✅");
    localStorage.setItem("loggedUser", JSON.stringify(data));
    navigate("/user-profile");
  };

  return (
    <div className="login-page">
      <div className="login-container">
        {/* Left Side - Login Form */}
        <div className="login-form">
          <h1 className="login-title">
            Welcome <span className="accent">back</span>
          </h1>
          <p className="login-sub">Login to continue</p>

          <form onSubmit={handleSubmit(onSubmit)}>
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

            <button type="submit" className="login-btn">
              Login
            </button>

            <p className="login-text">
              Don’t have an account?{" "}
              <Link to="/user-register" className="login-link">
                Register now!
              </Link>
            </p>
          </form>
        </div>

        {/* Right Side - Image */}
        <div className="login-image">
          <img src={loginImg} alt="Login illustration" />
        </div>
      </div>
    </div>
  );
};

export default Login;
