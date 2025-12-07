// src/Component/ApplicantsJob.js
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchApplicants,
  updateApplicantStatus,
} from "../Features/ApplicationSlice";
import { useSearchParams, useNavigate } from "react-router-dom";
import "../Styles/ApplicantsJob.css";

const ApplicantsJob = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const jobId = params.get("jobId");

  const { applicants, isLoading } = useSelector((state) => state.applications);

  useEffect(() => {
    if (jobId) dispatch(fetchApplicants(jobId));
  }, [dispatch, jobId]);

  const handleAction = (applicationId, status) => {
    dispatch(updateApplicantStatus({ applicationId, status }));
  };

  if (isLoading) return <p>Loading applicants...</p>;

  return (
    <div className="applicants-page">
      <h1 className="app-title">
        Job <span className="accent">Applicants</span>
      </h1>

      {applicants.length === 0 ? (
        <p className="empty">No applicants yet.</p>
      ) : (
        <div className="applicants-grid">
          {applicants.map((app) => (
            <div key={app._id} className="applicant-card glass-card">
              <div className="profile-row">
                <div className="icon-circle">👤</div>
                <div>
                  <h3 className="applicant-name">{app.applicantName}</h3>
                  <p className="email">{app.applicantEmail}</p>
                </div>
              </div>

              <p className="status">
                Status: <span className={`status-tag ${app.status.toLowerCase()}`}>{app.status}</span>
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
      )}
    </div>
  );
};

export default ApplicantsJob;
