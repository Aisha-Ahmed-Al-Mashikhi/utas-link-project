// Import React library
import React from "react";
// Import home page styles
import "../Styles/Home.css";
// Import Redux selector
import { useSelector } from "react-redux";
// Import navigation hook
import { useNavigate } from "react-router-dom";
// Import Posts component
import Posts from "./Posts.jsx";

// Define Home component
const Home = () => {
  // Initialize navigation
  const navigate = useNavigate();

  // Get user and role from Redux
  const { user, role } = useSelector((state) => state.users);

  // Get stored user from localStorage
  const storedUser = JSON.parse(localStorage.getItem("loggedUser"));
  // Get stored role from localStorage
  const storedRole = localStorage.getItem("role");

  // Handle start button click
  const handleStart = () => {
    // Determine active user
    const activeUser = user || storedUser;
    // Determine active role
    const activeRole = role || storedRole;

    // Redirect to login if no user
    if (!activeUser) {
      navigate("/login");
      // Redirect company to post job
    } else if (activeRole === "company") {
      navigate("/post-job");
      // Redirect student to find job
    } else {
      navigate("/find-job");
    }
  };

  // Return JSX
  return (
    // Main home container
    <div className="home">
      {/* Hero section */}
      <section className="hero">
        {/* Main hero title */}
        <h1 className="hero-title">
          Unlock Your Potential. <span className="accent">Power</span>
        </h1>

        {/* Secondary hero title */}
        <h1 className="hero-title">
          <span className="accent">UTAS Businesses.</span>
        </h1>

        {/* Hero description */}
        <p className="hero-text">
          Connecting ambitious students with Dhofar companies and ministries to
          access flexible, part-time work opportunities.
        </p>

        {/* Call to action button */}
        <button className="hero-btn" onClick={handleStart}>
          {user || storedUser ? "Welcome" : "Get Start"}
        </button>
      </section>

      {/* Posts section */}
      <section className="posts-container">
        {/* Section title */}
        <h2 className="section-title">Recent Posts</h2>
        {/* Posts component */}
        <Posts />
      </section>

      {/* Features section */}
      <section className="features-section">
        {/* Features title */}
        <h2 className="features-title">Why Choose UTASLink?</h2>

        {/* Features grid */}
        <div className="features-grid">
          {/* Feature card */}
          <div className="feature-card">
            <div className="feature-icon">💼</div>
            <h3>Verified Local Jobs</h3>
            <p>
              All job opportunities come from trusted companies and ministries
              within Dhofar.
            </p>
          </div>

          {/* Feature card */}
          <div className="feature-card">
            <div className="feature-icon">⏱️</div>
            <h3>Flexible Work Options</h3>
            <p>
              Part-time, per-task, and hourly jobs designed for UTAS students’
              schedules.
            </p>
          </div>

          {/* Feature card */}
          <div className="feature-card">
            <div className="feature-icon">📱</div>
            <h3>Fast Application Process</h3>
            <p>
              Apply instantly and communicate directly with employers using the
              built-in chat.
            </p>
          </div>

          {/* Feature card */}
          <div className="feature-card">
            <div className="feature-icon">⭐</div>
            <h3>Student-Focused Platform</h3>
            <p>
              Built exclusively for UTAS students to gain experience and earn
              income.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

// Export Home component
export default Home;
