import React from "react";
import { Link } from "react-router-dom";
import "../Styles/Header.css";

const Header = () => {
  return (
    <header className="header">
      {/* Logo + Branding */}
      <div className="brand">
        <div className="logo-circle">UL</div>
        <span className="brand-text">
          <span className="brand-main">UTAS</span>
          <span className="brand-accent">Link</span>
        </span>
      </div>
      <nav className="nav-links">
        <Link to="/">Home &nbsp; </Link>
        <Link to="/login">Login &nbsp; </Link>
        <Link to="/user-register">User Register &nbsp; </Link>
        <Link to="/company-register">Company Register &nbsp; </Link>
        <Link to="/post-job">Post Job &nbsp; </Link>
        <Link to="/find-job">Find Job &nbsp; </Link>
        <Link to="/company-jobs">Company Jobs &nbsp; </Link>
        <Link to="/my-app">My Applications &nbsp; </Link>
        <Link to="/user-profile">User Profile &nbsp; </Link>
        <Link to="/company-profile">Company Profile &nbsp; </Link>
        <Link to="/job-app">Applicants Job</Link>
      </nav>
    </header>
  );
};

export default Header;
