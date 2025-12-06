import React, { useState } from "react"; // Import React and hooks
// Redux: login action + selecting state
import { useDispatch } from "react-redux";
import { login } from "../Features/UserSlice";
import { useNavigate, Link } from "react-router-dom"; // Router: navigation + linking
// Page styling and assets
import "../Styles/Login.css";
import loginImg from "../Images/user-register.png";
import { IoIosArrowBack } from "react-icons/io";

const Login = () => {
  // ------------------- FORM STATES -------------------
  // Track email, password, and error messages displayed to the user
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // ------------------- HOOKS -------------------
  // Used to run Redux actions (login)
  const dispatch = useDispatch();

  // Used to redirect users after successful login
  const navigate = useNavigate();

  // ------------------- LOGIN FUNCTION -------------------
  const handleLogin = async () => {
  if (!email || !password) {
    setErrorMsg("Please enter both email and password.");
    return;
  }

  setErrorMsg(""); // clear previous error

  try {
    const result = await dispatch(login({ email, password })).unwrap();

    localStorage.setItem("loggedUser", JSON.stringify(result.user));
    localStorage.setItem("role", result.role);

    if (result.role === "company") {
      navigate("/company-profile");
    } else {
      navigate("/student-profile");
    }

  } catch (err) {
    console.error("Login failed:", err);

    const msg = err?.message || err?.error;

    if (msg === "Incorrect password") {
      setErrorMsg("Incorrect password. Please try again.");
    } else if (msg === "User not found") {
      setErrorMsg("No account found with this email.");
    } else {
      setErrorMsg("Something went wrong. Please try again.");
    }
  }
};

  // ------------------- PAGE UI -------------------
  return (
    <div className="login-page">
      {/* Back arrow to return to Home */}
      <Link to="/" className="back-arrow">
        <IoIosArrowBack size={28} />
      </Link>

      <div className="login-container">
        {/* ---------- LEFT SIDE: Login Form ---------- */}
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
              <Link to="/student-register" className="login-link">
                Register now!
              </Link>
            </p>
          </form>
        </div>

        {/* ---------- RIGHT SIDE: Image ---------- */}
        <div className="login-image">
          <img src={loginImg} alt="Login illustration" />
        </div>
      </div>
    </div>
  );
};

export default Login;
