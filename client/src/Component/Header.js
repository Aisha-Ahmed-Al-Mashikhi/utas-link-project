import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../Features/UserSlice";
import "../Styles/Header.css";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.users);
  const [role, setRole] = useState(localStorage.getItem("role") || null);
  const fetchedOnce = useRef(false);

  // Always synchronize the role with localStorage for reliability
  useEffect(() => {
    const savedRole = localStorage.getItem("role");
    if (savedRole) {
      setRole(savedRole);
    } else if (user?.role) {
      setRole(user.role);
    }
  }, [user]);

  // Fetch full user or company data once if not already available
  useEffect(() => {
    if (
      !fetchedOnce.current &&
      user?.email &&
      !user?.name &&
      !user?.companyName
    ) {
      fetchedOnce.current = true;
      const savedRole = localStorage.getItem("role");
      const endpoint =
        savedRole === "company"
          ? `http://localhost:3001/company/${user.email}`
          : `http://localhost:3001/user/${user.email}`;

      fetch(endpoint)
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch profile");
          return res.json();
        })
        .then((data) =>
          dispatch({ type: "users/fetchUser/fulfilled", payload: data })
        )
        .catch((err) => console.error(err));
    }
  }, [user?.email, user?.name, user?.companyName, dispatch]);

  // Handle logout
  const handleLogout = () => {
    // Clear stored user data
    localStorage.removeItem("loggedUser");
    localStorage.removeItem("role");

    // Reset Redux state
    dispatch(logout());

    // Hide role-specific navigation links immediately
    setRole(null);

    // Navigate back to home page
    navigate("/", { replace: true });

    // Force reload to ensure Home.jsx is displayed correctly
    setTimeout(() => {
      window.location.href = "/";
    }, 100);
  };

  return (
    <header className="header">
      {/* Website Branding */}
      <div className="brand">
        <div className="logo-circle">UL</div>
        <div className="brand-text">
          <span className="brand-main">UTAS</span>
          <span className="brand-accent">Link</span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="nav-links">
        {/* Student Navigation */}
        {role === "student" && (
          <>
            <Link to="/findjob">Find Job</Link>
            <Link to="/myapplications">My Applications</Link>
            <Link to="/userprofile">Profile</Link>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </>
        )}

        {/* Company Navigation */}
        {role === "company" && (
          <>
            <Link to="/companyprofile">Company Profile</Link>
            <Link to="/postjob">Post Job</Link>
            <Link to="/companyjobs">My Jobs</Link>
            <Link to="/applicantsjob">Applicants</Link>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </>
        )}

        {/* Guest Navigation */}
        {!role && (
          <>
            <Link to="/"></Link>
            {/* "Get Started" button and other public actions are inside Home.jsx */}
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
