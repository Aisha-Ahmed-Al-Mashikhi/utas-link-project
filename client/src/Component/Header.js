import { useDispatch, useSelector } from "react-redux"; // Redux: dispatch actions + read user state
import { Link, useNavigate } from "react-router-dom"; // Routing: navigation + links
import { logout } from "../Features/UserSlice"; // Redux action: clears user data on logout
import "../Styles/Header.css"; // Component styling

const Header = () => {
  // Used to run Redux actions (logout)
  const dispatch = useDispatch();

  // Used for redirecting after logout
  const navigate = useNavigate();

  // Read full user data + role from Redux
  const { user, role: reduxRole } = useSelector((state) => state.users);

  // Final role comes from Redux first, then localStorage
  const role = reduxRole || user?.role || localStorage.getItem("role");

  // Handle logout
  const handleLogout = () => {
    // Clear saved login data
    localStorage.removeItem("loggedUser");
    localStorage.removeItem("role");

    // Reset Redux user state
    dispatch(logout());

    // Redirect to the Home page
    navigate("/", { replace: true });
  };

  return (
    <header className="header">
      {/* -------- Website Branding (Logo + Title) -------- */}
      <div className="brand">
        <div className="logo-circle">UL</div>
        <div className="brand-text">
          <span className="brand-main">UTAS</span>
          <span className="brand-accent">Link</span>
        </div>
      </div>

      {/* -------- Navigation Links Based on Role -------- */}
      <nav className="nav-links">
        {/* ---------- STUDENT NAVIGATION ---------- */}
        {role === "student" && (
          <>
            <Link to="/student-profile">Profile</Link>
            <Link to="/find-job">Find Job</Link>
            <Link to="/student-applications">My Applications</Link>

            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </>
        )}

        {/* ---------- COMPANY NAVIGATION ---------- */}
        {role === "company" && (
          <>
            <Link to="/company-profile">Company Profile</Link>
            <Link to="/post-job">Post Job</Link>
            <Link to="/company-jobs">My Jobs</Link>
            <Link to="/applicants-job">Applicants</Link>

            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
