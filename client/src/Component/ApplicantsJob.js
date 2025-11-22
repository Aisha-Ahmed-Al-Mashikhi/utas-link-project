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

  // Get jobId from URL (?jobId=xxxxx)
  const jobId = params.get("jobId");

  // Get applicants from Redux
  const { applicants, isLoading } = useSelector((state) => state.applications);

  // Fetch all applicants for this job
  useEffect(() => {
    if (jobId) dispatch(fetchApplicants(jobId));
  }, [dispatch, jobId]);

  // Accept or Reject applicant
  const handleAction = (applicationId, status) => {
    dispatch(updateApplicantStatus({ applicationId, status }));
  };

  if (isLoading) return <p>Loading applicants...</p>;

  return (
    <div className="applicants-page">
      <h1 className="title">
        Applicants for <span className="accent">Job</span>
      </h1>

      {applicants.length === 0 ? (
        <p className="empty">No applicants yet.</p>
      ) : (
        applicants.map((app) => (
          <div key={app._id} className="applicant-card">
            <div>
              <h3>{app.applicantName}</h3>
              <p>Email: {app.applicantEmail}</p>
              <p>Status: {app.status}</p>
            </div>

            <div className="actions">
              {/* Open chat with this applicant */}
              <button
                className="chat-btn"
                onClick={() => navigate(`/company-chat/${app._id}`)}
              >
                Chat 💬
              </button>

              {/* Accept applicant */}
              <button
                className="accept-btn"
                onClick={() => handleAction(app._id, "Accepted")}
              >
                Accept
              </button>

              {/* Reject applicant */}
              <button
                className="reject-btn"
                onClick={() => handleAction(app._id, "Rejected")}
              >
                Reject
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ApplicantsJob;
