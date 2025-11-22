import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchApplications,
  cancelApplication,
} from "../Features/ApplicationSlice";
import "../Styles/StudentApplications.css";
import { useNavigate } from "react-router-dom";

const StudentApplications = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.users);
  const { applications, isLoading } = useSelector(
    (state) => state.applications
  );

  // ----------------------------------------------------------
  // LOAD STUDENT APPLICATIONS (no login check — as requested)
  // ----------------------------------------------------------
  useEffect(() => {
    if (user?.email) {
      dispatch(fetchApplications(user.email));
    }
  }, [dispatch]);

  // ----------------------------------------------------------
  // CANCEL APPLICATION
  // ----------------------------------------------------------
  const handleCancel = (id) => {
    dispatch(cancelApplication(id))
      .unwrap()
      .then(() => alert("Application canceled successfully."))
      .catch(() => alert("Error canceling application."));
  };

  if (isLoading && applications.length === 0) {
    return <p>Loading applications...</p>;
  }

  return (
    <div className="applications-page">
      <h1 className="applications-title">
        My <span className="accent">Applications</span>
      </h1>

      <p className="applications-sub">
        Track the status of your submitted job applications.
      </p>

      <div className="applications-list">
        {applications.length === 0 ? (
          <div className="empty-state">
            <p>No applications yet.</p>
            <button
              className="findjob-btn"
              onClick={() => navigate("/findjob")}
            >
              Browse Jobs
            </button>
          </div>
        ) : (
          applications.map((app) => (
            <div className="application-card" key={app._id}>
              <div className="app-info">
                <div className="app-icon">🏢</div>

                <div>
                  <h3 className="job-title">{app.jobTitle}</h3>
                  <p className="company">Company: {app.organization}</p>
                  <p className="details">Email: {app.applicantEmail}</p>

                  {/* Status badge */}
                  <p className={`status-badge ${app.status?.toLowerCase()}`}>
                    {app.status || "Pending Review"}
                  </p>
                </div>
              </div>

              {/* ACTIONS */}
              <div className="app-actions">
                {app.status === "Pending Review" ? (
                  <button
                    className="withdraw-btn"
                    onClick={() => handleCancel(app._id)}
                  >
                    Cancel
                  </button>
                ) : app.status === "Accepted" ? (
                  <span className="accepted-label">Accepted</span>
                ) : app.status === "Rejected" ? (
                  <span className="rejected-label">Rejected</span>
                ) : null}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default StudentApplications;
