// Import React and hooks
import React, { useState } from "react"; // Import React and hooks
// Import Redux dispatch
import { useDispatch } from "react-redux";
// Import login action
import { login } from "../Features/UserSlice";
// Import router utilities
import { useNavigate, Link } from "react-router-dom"; // Router: navigation + linking
// Import styles
import "../Styles/Login.css";
// Import image asset
import loginImg from "../Images/user-register.png";
// Import icon
import { IoIosArrowBack } from "react-icons/io";

// Define Login component
const Login = () => {
  // ------------------- FORM STATES -------------------
  // Email state
  const [email, setEmail] = useState("");
  // Password state
  const [password, setPassword] = useState("");
  // Error message state
  const [errorMsg, setErrorMsg] = useState("");

  // ------------------- HOOKS -------------------
  // Initialize dispatch
  const dispatch = useDispatch();
  // Initialize navigation
  const navigate = useNavigate();

  // ------------------- LOGIN FUNCTION -------------------
  // Handle login action
  const handleLogin = async () => {
    // Validate inputs
    if (!email || !password) {
      setErrorMsg("Please enter both email and password.");
      return;
    }

    // Clear error message
    setErrorMsg("");

    try {
      // Dispatch login action
      const result = await dispatch(login({ email, password })).unwrap();

      // Store logged user
      localStorage.setItem("loggedUser", JSON.stringify(result.user));
      // Store role
      localStorage.setItem("role", result.role);

      // Navigate based on role
      if (result.role === "company") {
        navigate("/company-profile");
      } else {
        navigate("/student-profile");
      }
    } catch (err) {
      // Log error
      console.error("Login failed:", err);

      // Extract message
      const msg = err?.message || err?.error;

      // Incorrect password case
      if (msg === "Incorrect password") {
        setErrorMsg("Incorrect password. Please try again.");
        // User not found case
      } else if (msg === "User not found") {
        setErrorMsg("No account found with this email.");
        // Generic error
      } else {
        setErrorMsg("Something went wrong. Please try again.");
      }
    }
  };

  // ------------------- PAGE UI -------------------
  // Return JSX
  return (
    // Main login page
    <div className="login-page">
      {/* Back navigation */}
      <Link to="/" className="back-arrow">
        <IoIosArrowBack size={28} />
      </Link>

      {/* Page container */}
      <div className="login-container">
        {/* Left section */}
        <div className="login-form">
          {/* Title */}
          <h1 className="login-title">
            Welcome <span className="accent">back</span>
          </h1>
          {/* Subtitle */}
          <p className="login-sub">Login to continue</p>

          {/* Login form */}
          <form>
            {/* Email label */}
            <label>Email</label>
            {/* Email input */}
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {/* Password label */}
            <label>Password</label>
            {/* Password input */}
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

            {/* Register link */}
            <p className="login-text">
              Don’t have an account?{" "}
              <Link to="/student-register" className="login-link">
                Register now!
              </Link>
            </p>
          </form>
        </div>

        {/* Right section */}
        <div className="login-image">
          <img src={loginImg} alt="Login illustration" />
        </div>
      </div>
    </div>
  );
};

// Export Login component
export default Login;
