// Import React and hooks
import React, { useEffect, useState } from "react";
// Import Redux hooks
import { useDispatch, useSelector } from "react-redux";
// Import application actions
import {
  fetchStudentApplications,
  cancelStudentApplication,
} from "../Features/ApplicationSlice";
// Import styles
import "../Styles/StudentApplications.css";
// Import navigation hook
import { useNavigate } from "react-router-dom";

// Define StudentApplications component
const StudentApplications = () => {
  // Initialize dispatch
  const dispatch = useDispatch();
  // Initialize navigation
  const navigate = useNavigate();

  // Get user from Redux
  const { user } = useSelector((state) => state.users);
  // Get applications data from Redux
  const { studentApplications, isLoading } = useSelector(
    (state) => state.applications
  );

  // Track current page
  const [currentPage, setCurrentPage] = useState(1);
  // Applications per page
  const appsPerPage = 6;

  // Fetch student applications on load
  useEffect(() => {
    if (user?.email) {
      dispatch(fetchStudentApplications(user.email));
    }
  }, [dispatch, user]);

  // check if the job listing date has passed
  const isJobExpired = (postedAt, duration) => {
    if (!postedAt || !duration) return false;
    const expiryDate = new Date(postedAt);
    expiryDate.setDate(expiryDate.getDate() + Number(duration));
    return expiryDate < new Date();
  };

  // --- FILTER OUT EXPIRED JOBS ---
  // This ensures only active jobs are stored in this variable
  const activeApplications = studentApplications.filter((app) => {
    return !isJobExpired(app.postedAt, app.duration);
  });

  // Handle cancel application
  const handleCancel = (id) => {
    dispatch(cancelStudentApplication(id))
      .unwrap()
      .then(() => alert("Application removed successfully."))
      .catch(() => alert("Error deleting application."));
  };

  // Show loading state
  if (isLoading) return <p>Loading...</p>;

  // Calculate last index
  const indexOfLast = currentPage * appsPerPage;
  // Calculate first index
  const indexOfFirst = indexOfLast - appsPerPage;

  // Slice current applications (using filtered activeApplications)
  const currentApps = activeApplications.slice(indexOfFirst, indexOfLast);
  // Calculate total pages (using filtered activeApplications)
  const totalPages = Math.ceil(activeApplications.length / appsPerPage);

  // Return JSX
  return (
    // Main page container
    <div className="applications-page">
      {/* Page title */}
      <h1 className="applications-title">
        My <span className="accent">Applications</span>
      </h1>

      {/* Page subtitle */}
      <p className="applications-sub">
        Track the status of your submitted job applications.
      </p>

      {/* Check empty state (using filtered activeApplications) */}
      {activeApplications.length === 0 ? (
        // Empty state container
        <div className="empty-state">
          <p>No active applications yet.</p>
          <button className="findjob-btn" onClick={() => navigate("/find-job")}>
            Browse Jobs
          </button>
        </div>
      ) : (
        <>
          {/* Applications grid */}
          <div className="applications-grid-three">
            {currentApps.map((app) => (
              <div className="application-card small-card" key={app._id}>
                <div className="app-info">
                  <div className="app-icon">🏢</div>

                  <div>
                    <h3 className="job-title">{app.jobTitle}</h3>
                    <p className="company">Company: {app.organization}</p>
                    <p className="details">Email: {app.companyEmail}</p>

                    <p className="details">
                      Applied:{" "}
                      {app.createdAt
                        ? new Date(app.createdAt).toLocaleString()
                        : "N/A"}
                    </p>

                    {app.jobDeleted && (
                      <p className="deleted-warning">
                        Job no longer available.
                      </p>
                    )}
                  </div>
                </div>

                <div className="app-actions-row">
                  {!app.jobDeleted && (
                    <button
                      className="chat-btn"
                      onClick={() => navigate(`/student-chat/${app._id}`)}
                    >
                      Chat 💬
                    </button>
                  )}

                  <button
                    className="withdraw-btn"
                    onClick={() => handleCancel(app._id)}
                  >
                    Remove
                  </button>

                  <span className={`status-badge ${app.status?.toLowerCase()}`}>
                    {app.status || "Pending"}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination container */}
          <div className="apps-pagination">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
            >
              Prev
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                className={currentPage === i + 1 ? "active-page" : ""}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

// Export component
export default StudentApplications;
