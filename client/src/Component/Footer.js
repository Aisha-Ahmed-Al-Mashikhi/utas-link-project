import React from "react";
import "../Styles/Footer.css";

const Footer = () => {
  return (
    <footer className="main-footer">
      <div className="footer-row">
        {/* LEFT SIDE (Brand + description) */}
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

        {/* RIGHT SIDE (Contact Info) */}
        <div className="footer-right">
          <p className="contact-title">Get in touch</p>
          <p>hello@UTASlink.om</p>
          <p>+968 9xx xxx xx</p>
        </div>
      </div>

      <div className="footer-copy">© 2025 UTASLink. All rights reserved.</div>
    </footer>
  );
};

export default Footer;
