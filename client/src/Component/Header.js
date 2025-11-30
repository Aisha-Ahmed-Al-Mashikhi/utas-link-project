import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../Features/UserSlice";
import { useState } from "react";
import "../Styles/Header.css";

/* ====== IMPORT ICONS ====== */
import {
  FiHome,
  FiLogIn,
  FiUserPlus,
  FiUser,
  FiBriefcase,
  FiBookOpen,
  FiMessageCircle,
  FiPlusCircle,
  FiLogOut,
} from "react-icons/fi";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, role: reduxRole } = useSelector((state) => state.users);

  // Final role
  const role = reduxRole || user?.role || localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.removeItem("loggedUser");
    localStorage.removeItem("role");
    dispatch(logout());
    navigate("/", { replace: true });
  };

  const [open, setOpen] = useState(false);

  return (
    <>
      {/* ===== HEADER ===== */}
      <header className="header">
        <div className="brand">
          <div className="logo-circle">UL</div>
          <div className="brand-text">
            <span className="brand-main">UTAS</span>
            <span className="brand-accent">Link</span>
          </div>
        </div>

        {/* MENU BUTTON */}
        <button className="menu-btn" onClick={() => setOpen(true)}>
          ☰
        </button>
      </header>

      {/* ===== OVERLAY ===== */}
      {open && <div className="overlay" onClick={() => setOpen(false)}></div>}

      {/* ===== DRAWER ===== */}
      <div className={`drawer ${open ? "drawer-open" : ""}`}>
        <button className="close-btn" onClick={() => setOpen(false)}>
          ×
        </button>

        {/* ===== WELCOME—ONLY IF LOGGED IN ===== */}
        {role && (
          <div className="welcome-box">
            <p className="welcome-title">Welcome,</p>
            <p className="welcome-name">
              {user?.fullName || user?.name || user?.companyName || "User"}
            </p>
          </div>
        )}

        {/* ===== NAVIGATION ===== */}
        <nav className="drawer-links">

          {/* =======================
              NOT LOGGED IN (GUEST)
          ======================= */}
          {!role && (
            <>
              <Link to="/" onClick={() => setOpen(false)}>
                <FiHome className="icon" /> Home
              </Link>

              <Link to="/login" onClick={() => setOpen(false)}>
                <FiLogIn className="icon" /> Login
              </Link>

              <Link to="/register" onClick={() => setOpen(false)}>
                <FiUserPlus className="icon" /> Register
              </Link>
            </>
          )}

          {/* =======================
                STUDENT
          ======================= */}
          {role === "student" && (
            <>
              <Link to="/student-profile" onClick={() => setOpen(false)}>
                <FiUser className="icon" /> Profile
              </Link>

              <Link to="/find-job" onClick={() => setOpen(false)}>
                <FiBriefcase className="icon" /> Find Job
              </Link>

              <Link
                to="/student-applications"
                onClick={() => setOpen(false)}
              >
                <FiBookOpen className="icon" /> My Applications
              </Link>

              <Link to="/student-chats" onClick={() => setOpen(false)}>
                <FiMessageCircle className="icon" /> Chats
              </Link>

              <Link to="/create-post" onClick={() => setOpen(false)}>
                <FiPlusCircle className="icon" /> Create Post
              </Link>

              <button className="drawer-logout" onClick={handleLogout}>
                <FiLogOut className="icon" /> Logout
              </button>
            </>
          )}

          {/* =======================
                COMPANY
          ======================= */}
          {role === "company" && (
            <>
              <Link to="/company-profile" onClick={() => setOpen(false)}>
                <FiUser className="icon" /> Company Profile
              </Link>

              <Link to="/post-job" onClick={() => setOpen(false)}>
                <FiPlusCircle className="icon" /> Post Job
              </Link>

              <Link to="/company-jobs" onClick={() => setOpen(false)}>
                <FiBriefcase className="icon" /> My Jobs
              </Link>

              <Link to="/company-chats" onClick={() => setOpen(false)}>
                <FiMessageCircle className="icon" /> Chats
              </Link>

              <Link to="/create-post" onClick={() => setOpen(false)}>
                <FiPlusCircle className="icon" /> Create Post
              </Link>

              <button className="drawer-logout" onClick={handleLogout}>
                <FiLogOut className="icon" /> Logout
              </button>
            </>
          )}

        </nav>
      </div>
    </>
  );
};

export default Header;
