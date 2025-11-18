import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../Features/UserSlice";
import { useNavigate, Link } from "react-router-dom";
import "../Styles/Login.css";
import loginImg from "../Images/user-register.png";
import { IoIosArrowBack } from "react-icons/io";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, isSuccess } = useSelector((state) => state.users);

  // Handle redirection after a successful login
  useEffect(() => {
    if (isSuccess && user) {
      const role = user.role;
      if (role === "company") {
        navigate("/companyprofile", { state: { email: user.email } });
      } else {
        navigate("/findjob", { state: { email: user.email } });
      }
    }
  }, [isSuccess, user, navigate]);

  // Handle login attempt
  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMsg("Please enter both email and password.");
      return;
    }

    setErrorMsg("");

    try {
      const result = await dispatch(login({ email, password })).unwrap();

      // Save user info locally
      localStorage.setItem("loggedUser", JSON.stringify(result.user));
      localStorage.setItem("role", result.role);

      // Redirect based on user role
      if (result.role === "company") navigate("/companyprofile");
      else navigate("/findjob");
    } catch (err) {
      console.error("Login failed:", err);

      // Display relevant error message
      if (err?.error === "Incorrect password") {
        setErrorMsg("Incorrect password. Please try again.");
      } else if (err?.error === "User not found") {
        setErrorMsg("No account found with this email.");
      } else {
        setErrorMsg("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="login-page">
      <Link to="/" className="back-arrow">
        <IoIosArrowBack size={28} />
      </Link>
      <div className="login-container">
        {/* Left side: Login form */}
        <div className="login-form">
          <h1 className="login-title">
            Welcome <span className="accent">back</span>
          </h1>
          <p className="login-sub">Login to continue</p>

          <form>
            {/* Email input */}
            <label>Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {/* Password input */}
            <label>Password</label>
            <input
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {/* Error message */}
            {errorMsg && <p className="error">{errorMsg}</p>}

            {/* Login button */}
            <button type="button" className="login-btn" onClick={handleLogin}>
              Login
            </button>

            {/* Registration link */}
            <p className="login-text">
              Don’t have an account?{" "}
              <Link to="/user-register" className="login-link">
                Register now!
              </Link>
            </p>
          </form>
        </div>

        {/* Right side: Image */}
        <div className="login-image">
          <img src={loginImg} alt="Login illustration" />
        </div>
      </div>
    </div>
  );
};

export default Login;
