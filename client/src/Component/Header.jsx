// Import Redux hooks
import { useDispatch, useSelector } from "react-redux";
// Import routing tools
import { Link, useNavigate } from "react-router-dom";
// Import logout action
import { logout } from "../Features/UserSlice";
// Import state hook
import { useState } from "react";
// Import styles
import "../Styles/Header.css";

// Import icons
import {
  FiHome,
  FiLogIn,
  FiUserPlus,
  FiUser,
  FiBriefcase,
  FiBookOpen,
  FiMessageCircle,
  FiLogOut,
  FiPlusCircle,
} from "react-icons/fi";

// Define Header component
const Header = () => {
  // Initialize dispatch
  const dispatch = useDispatch();
  // Initialize navigation
  const navigate = useNavigate();

  // Get user and role from Redux
  const { user, role: reduxRole } = useSelector((state) => state.users);
  // Determine current role
  const role = reduxRole || user?.role || localStorage.getItem("role");

  // Handle logout
  const handleLogout = () => {
    // Remove stored user
    localStorage.removeItem("loggedUser");
    // Remove stored role
    localStorage.removeItem("role");
    // Dispatch logout
    dispatch(logout());
    // Navigate to home
    navigate("/", { replace: true });
  };

  // Drawer open state
  const [open, setOpen] = useState(false);

  // Return JSX
  return (
    <>
      {/* Header container */}
      <header className="header">
        {/* Brand section */}
        <div className="brand">
          {/* Logo circle */}
          <div className="logo-circle">UL</div>
          {/* Brand text */}
          <div className="brand-text">
            {/* Main brand */}
            <span className="brand-main">UTAS</span>
            {/* Accent brand */}
            <span className="brand-accent">Link</span>
          </div>
        </div>

        {/* Header links */}
        <div className="header-links">
          {/* Student links */}
          {role === "student" && (
            <>
              <Link to="/">Home</Link>
              <Link to="/find-job">Find Job</Link>
              <Link to="/student-applications">My Applications</Link>
            </>
          )}

          {/* Company links */}
          {role === "company" && (
            <>
              <Link to="/">Home</Link>

              <Link to="/post-job"> Post Job</Link>

              {/* Company jobs */}
              <Link to="/company-jobs">My Jobs</Link>
            </>
          )}
        </div>

        {/* Menu button */}
        <button className="menu-btn" onClick={() => setOpen(true)}>
          ☰
        </button>
      </header>

      {/* Overlay */}
      {open && (
        <div className="drawer-overlay" onClick={() => setOpen(false)}></div>
      )}

      {/* Drawer container */}
      <div className={`drawer ${open ? "drawer-open" : ""}`}>
        {/* Close drawer */}
        <button className="close-btn" onClick={() => setOpen(false)}>
          ×
        </button>

        {/* Welcome box */}
        {role && (
          <div className="welcome-box">
            <p className="welcome-title">Welcome,</p>
            <p className="welcome-name">
              {user?.fullName || user?.name || user?.companyName || "User"}
            </p>
          </div>
        )}

        {/* Drawer navigation */}
        <nav className="drawer-links">
          {/* Guest links */}
          {!role && (
            <>
              <Link to="/" onClick={() => setOpen(false)}>
                <FiHome className="icon" /> Home
              </Link>

              <Link to="/login" onClick={() => setOpen(false)}>
                <FiLogIn className="icon" /> Login
              </Link>

              <Link to="/student-register" onClick={() => setOpen(false)}>
                <FiUserPlus className="icon" /> Register
              </Link>

              <Link to="/developers" onClick={() => setOpen(false)}>
                <FiUser className="icon" /> About Developer
              </Link>
            </>
          )}

          {/* Student links */}
          {role === "student" && (
            <>
              <Link to="/student-profile" onClick={() => setOpen(false)}>
                <FiUser className="icon" /> Profile
              </Link>

              <Link to="/create-post" onClick={() => setOpen(false)}>
                <FiPlusCircle className="icon" /> Create Post
              </Link>

              <Link to="/student-chats" onClick={() => setOpen(false)}>
                <FiMessageCircle className="icon" /> Chats
              </Link>

              <Link to="/developers" onClick={() => setOpen(false)}>
                <FiUser className="icon" /> About Developer
              </Link>

              <button className="drawer-logout" onClick={handleLogout}>
                <FiLogOut className="icon" /> Logout
              </button>
            </>
          )}

          {/* Company links */}
          {role === "company" && (
            <>
              <Link to="/company-profile" onClick={() => setOpen(false)}>
                <FiUser className="icon" /> Company Profile
              </Link>

              <Link to="/create-post" onClick={() => setOpen(false)}>
                <FiPlusCircle className="icon" /> Create Post
              </Link>

              <Link to="/company-chats" onClick={() => setOpen(false)}>
                <FiMessageCircle className="icon" /> Chats
              </Link>

              <Link to="/developers" onClick={() => setOpen(false)}>
                <FiUser className="icon" /> About Developer
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

// Export Header component
export default Header;
