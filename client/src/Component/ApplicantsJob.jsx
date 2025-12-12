// src/Component/ApplicantsJob.js
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchApplicants,
  updateApplicantStatus,
} from "../Features/ApplicationSlice";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import "../Styles/ApplicantsJob.css";

const ApplicantsJob = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { jobId } = useParams();

  const { applicants, isLoading } = useSelector((state) => state.applications);

  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 6; // 3 × 2

  useEffect(() => {
  if (jobId) dispatch(fetchApplicants(jobId));
}, [dispatch, jobId]);

  const handleAction = (applicationId, status) => {
    dispatch(updateApplicantStatus({ applicationId, status }));
  };

  if (isLoading) return <p>Loading applicants...</p>;

  // Pagination logic
  const indexLast = currentPage * cardsPerPage;
  const indexFirst = indexLast - cardsPerPage;
  const currentCards = applicants.slice(indexFirst, indexLast);
  const totalPages = Math.ceil(applicants.length / cardsPerPage);

  return (
    <div className="applicants-page">
      <h1 className="app-title">
        Job <span className="accent">Applicants</span>
      </h1>

      {applicants.length === 0 ? (
        <p className="empty">No applicants yet.</p>
      ) : (
        <>
          {/* 3×2 GRID FIXED */}
          <div className="applicants-grid fixed-grid">
            {currentCards.map((app) => (
              <div key={app._id} className="applicant-card glass-card">
                <div className="profile-row">
                  <div className="icon-circle">👤</div>
                  <div>
                    <h3 className="applicant-name">{app.applicantName}</h3>
                    <p className="email">{app.applicantEmail}</p>
                  </div>
                </div>

                <p className="status">
                  Status:
                  <span className={`status-tag ${app.status.toLowerCase()}`}>
                    {app.status}
                  </span>
                </p>

                <div className="action-row">
                  <button
                    className="chat-btn"
                    onClick={() => navigate(`/company-chat/${app._id}`)}
                  >
                    Chat 💬
                  </button>

                  <button
                    className="accept-btn"
                    onClick={() => handleAction(app._id, "Accepted")}
                  >
                    Accept ✔
                  </button>

                  <button
                    className="reject-btn"
                    onClick={() => handleAction(app._id, "Rejected")}
                  >
                    Reject ✖
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* PAGINATION */}
          <div className="app-pagination">
            <button
              onClick={() => setCurrentPage((p) => p - 1)}
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
              onClick={() => setCurrentPage((p) => p + 1)}
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

export default ApplicantsJob;
