// src/Component/StudentApplications.js

import React, { useEffect, useState } from "react";
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

  const [currentPage, setCurrentPage] = useState(1);
  const appsPerPage = 6;

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

  if (isLoading) return <p>Loading...</p>;

  // Pagination
  const indexOfLast = currentPage * appsPerPage;
  const indexOfFirst = indexOfLast - appsPerPage;
  const currentApps = studentApplications.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(studentApplications.length / appsPerPage);

  return (
    <div className="applications-page">

      <h1 className="applications-title">
        My <span className="accent">Applications</span>
      </h1>

      <p className="applications-sub">
        Track the status of your submitted job applications.
      </p>

      {/* EMPTY STATE */}
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
        <>
          {/* 3×3 GRID */}
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
                      <p className="deleted-warning">Job no longer available.</p>
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

          {/* PAGINATION */}
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
              onClick={() =>
                setCurrentPage((p) => Math.min(p + 1, totalPages))
              }
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

export default StudentApplications;
