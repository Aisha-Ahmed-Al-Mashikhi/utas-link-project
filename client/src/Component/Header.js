import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../Features/UserSlice";
import { useState } from "react";
import "../Styles/Header.css";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, role: reduxRole } = useSelector((state) => state.users);
  const role = reduxRole || user?.role || localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.removeItem("loggedUser");
    localStorage.removeItem("role");
    dispatch(logout());
    navigate("/", { replace: true });
  };

  // Drawer state
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* ====== TOP HEADER ====== */}
      <header className="header">
        <div className="brand">
          <div className="logo-circle">UL</div>
          <div className="brand-text">
            <span className="brand-main">UTAS</span>
            <span className="brand-accent">Link</span>
          </div>
        </div>

        <button className="menu-btn" onClick={() => setOpen(true)}>
          ☰
        </button>
      </header>

      {/* ====== OVERLAY ====== */}
      {open && <div className="overlay" onClick={() => setOpen(false)}></div>}

      {/* ====== DRAWER ====== */}
      <div className={`drawer ${open ? "drawer-open" : ""}`}>
        <button className="close-btn" onClick={() => setOpen(false)}>
          ×
        </button>

        <nav className="drawer-links">
          {/* STUDENT */}
          {role === "student" && (
            <>
              <Link to="/student-profile" onClick={() => setOpen(false)}>
                Profile
              </Link>
              <Link to="/find-job" onClick={() => setOpen(false)}>
                Find Job
              </Link>
              <Link
                to="/student-applications"
                onClick={() => setOpen(false)}
              >
                My Applications
              </Link>
              <Link to="/student-chats" onClick={() => setOpen(false)}>
                Chats
              </Link>
              <Link to="/create-post" onClick={() => setOpen(false)}>
                Create Post
              </Link>

              <button className="drawer-logout" onClick={handleLogout}>
                Logout
              </button>
            </>
          )}

          {/* COMPANY */}
          {role === "company" && (
            <>
              <Link to="/company-profile" onClick={() => setOpen(false)}>
                Company Profile
              </Link>
              <Link to="/post-job" onClick={() => setOpen(false)}>
                Post Job
              </Link>
              <Link to="/company-jobs" onClick={() => setOpen(false)}>
                My Jobs
              </Link>
              <Link to="/company-chats" onClick={() => setOpen(false)}>
                Chats
              </Link>
              <Link to="/create-post" onClick={() => setOpen(false)}>
                Create Post
              </Link>

              <button className="drawer-logout" onClick={handleLogout}>
                Logout
              </button>
            </>
          )}
        </nav>
      </div>
    </>
  );
};

export default Header;
