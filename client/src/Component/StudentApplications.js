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

  // نستخدم studentApplications بدال applications
  const { studentApplications, isLoading } = useSelector(
    (state) => state.applications
  );

  // ----------------------------------------------------------
  // LOAD STUDENT APPLICATIONS
  // ----------------------------------------------------------
  useEffect(() => {
    if (user?.email) {
      dispatch(fetchStudentApplications(user.email));
    }
  }, [dispatch, user]);

  // ----------------------------------------------------------
  // CANCEL APPLICATION
  // ----------------------------------------------------------
  const handleCancel = (id) => {
    dispatch(cancelStudentApplication(id))
      .unwrap()
      .then(() => alert("Application removed successfully."))
      .catch(() => alert("Error deleting application."));
  };

  if (isLoading && studentApplications.length === 0) {
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
            <div className="application-card" key={app._id}>
              <div className="app-info">
                <div className="app-icon">🏢</div>

                <div>
                  <h3 className="job-title">{app.jobTitle}</h3>
                  <p className="company">Company: {app.organization}</p>
                  <p className="details">Email: {app.applicantEmail}</p>
                  <p className="details">
  Applied on: {new Date(app.appliedAt).toLocaleString()}
</p>

                  {/* status badge */}
                  <p className={`status-badge ${app.status?.toLowerCase()}`}>
                    {app.status || "Pending Review"}
                  </p>

                  {/* If job deleted by company */}
                  {app.jobDeleted && (
                    <p className="deleted-warning">
                      This job is no longer available.
                    </p>
                  )}
                </div>
              </div>

              {/* ACTIONS */}
              <div className="app-actions">
                {/* CHAT BUTTON — يظهر بس إذا الوظيفة موجودة */}
                {!app.jobDeleted && (
                  <button
                    className="chat-btn"
                    onClick={() => navigate(`/student-chat/${app._id}`)}
                  >
                    Chat 💬
                  </button>
                )}

                {/* CANCEL BUTTON — يظهر دائمًا */}
                <button
                  className="withdraw-btn"
                  onClick={() => handleCancel(app._id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default StudentApplications;
