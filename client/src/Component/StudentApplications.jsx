// src/Component/StudentApplications.js

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchStudentApplications,
  cancelStudentApplication,
} from "../Features/ApplicationSlice";

import "../Styles/StudentApplications.css";
import { useNavigate } from "react-router-dom";

const StudentApplications = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.users);
  const { studentApplications, isLoading } = useSelector(
    (state) => state.applications
  );

  useEffect(() => {
    if (user?.email) {
      dispatch(fetchStudentApplications(user.email));
    }
  }, [dispatch, user]);

  const handleCancel = (id) => {
    dispatch(cancelStudentApplication(id))
      .unwrap()
      .then(() => alert("Application removed successfully."))
      .catch(() => alert("Error deleting application."));
  };

  return (
    <div className="applications-page">
      <h1 className="applications-title">
        My <span className="accent">Applications</span>
      </h1>

      <p className="applications-sub">
        Track the status of your submitted job applications.
      </p>

      {/* Horizontal Scroll */}
      <div className="applications-scroll">
        {studentApplications.length === 0 ? (
          <div className="empty-state">
            <p>No applications yet.</p>
            <button
              className="findjob-btn"
              onClick={() => navigate("/find-job")}
            >
              Browse Jobs
            </button>
          </div>
        ) : (
          studentApplications.map((app) => (
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
                    <p className="deleted-warning">Job no longer available.</p>
                  )}
                </div>
              </div>

              {/* Buttons Row */}
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
          ))
        )}
      </div>
    </div>
  );
};

export default StudentApplications;
