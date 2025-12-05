import React from "react";
import "../Styles/Footer.css";

const Footer = () => {
  return (
    <footer className="main-footer">
      <div className="footer-row">
        {/* LEFT SIDE */}
        <div className="footer-left">
          <div className="footer-brand">
            <span className="brand-main">UTAS</span>
            <span className="brand-accent">Link</span>
          </div>

          <p className="footer-text">
            Connecting UTAS students with local businesses & ministries for
            flexible, real-world work.
          </p>
        </div>

        {/* RIGHT SIDE */}
        <div className="footer-right">
          <p className="contact-title">Get in touch</p>
          <p>utas.link@gmail.com</p>
          <p>+968 9000 9111</p>
        </div>
      </div>

      {/* COPYRIGHT LINE — MUST BE INSIDE A DIV */}
      <div className="footer-copy">
        © 2025 UTASLink — Developed by Aisha Al-Mashikhi. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
