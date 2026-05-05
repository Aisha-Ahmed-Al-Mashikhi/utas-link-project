// Import React library
import React from "react";
// Import footer styles
import "../Styles/Footer.css";

// Define Footer component
const Footer = () => {
  // Return JSX
  return (
    // Footer container
    <footer className="main-footer">
      {/* Footer main row */}
      <div className="footer-row">
        {/* Left section */}
        <div className="footer-left">
          {/* Brand container */}
          <div className="footer-brand">
            {/* Main brand text */}
            <span className="brand-main">UTAS</span>
            {/* Accent brand text */}
            <span className="brand-accent">Link</span>
          </div>

          {/* Footer description */}
          <p className="footer-text">
            Connecting UTAS students with local businesses & ministries for
            flexible, real-world work.
          </p>
        </div>

        {/* Right section */}
        <div className="footer-right">
          {/* Contact title */}
          <p className="contact-title">Get in touch</p>
          {/* Contact email */}
          <p>Utas.Link@gmail.com</p>
          {/* Contact phone */}
          <p>+968 9xxx xxxx</p>
        </div>
      </div>

      {/* Copyright container */}
      <div className="footer-copy">
        © 2025 UTASLink — Developed by Aisha Al-Mashaikhi, Fatema Almaashani. All rights reserved.
      </div>
    </footer>
  );
};

// Export Footer component
export default Footer;
