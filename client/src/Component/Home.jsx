import React from "react";
import "../Styles/Home.css";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Posts from "./Posts.jsx";

const Home = () => {
  const navigate = useNavigate();
  const { user, role } = useSelector((state) => state.users);
const handleStart = () => {
  if (!user) {
    navigate("/login");
  } else if (user.role === "company") {
    navigate("/post-job");
  } else {
    navigate("/find-job");
  }
};



  return (
    <div className="home">
      {/* ------------ HERO SECTION ------------ */}
      <section className="hero">
        <h1 className="hero-title">
          Unlock Your Potential. <span className="accent">Power</span>
        </h1>

        <h1 className="hero-title">
          <span className="accent">UTAS Businesses.</span>
        </h1>

        <p className="hero-text">
          Connecting ambitious students with Dhofar companies and ministries to
          access flexible, part-time work opportunities.
        </p>

        <button className="hero-btn" onClick={handleStart}>
          {user ? "Welcome" : "Get Start"}
        </button>
      </section>

      {/* ------------ POSTS BOX SECTION ------------ */}
      <section className="posts-container">
        <h2 className="section-title">Recent Posts</h2>
        <Posts />
      </section>

      <section className="features-section">
        <h2 className="features-title">Why Choose UTASLink?</h2>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">💼</div>
            <h3>Verified Local Jobs</h3>
            <p>All job opportunities come from trusted companies and ministries within Dhofar.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">⏱️</div>
            <h3>Flexible Work Options</h3>
            <p>Part-time, per-task, and hourly jobs designed for UTAS students’ schedules.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📱</div>
            <h3>Fast Application Process</h3>
            <p>Apply instantly and communicate directly with employers using the built-in chat.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">⭐</div>
            <h3>Student-Focused Platform</h3>
            <p>Built exclusively for UTAS students to gain experience and earn income.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
