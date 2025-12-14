// Import React and hooks
import React, { useEffect, useState } from "react";

// Import Redux hooks
import { useDispatch, useSelector } from "react-redux";

// Import Redux actions
import {
  fetchApplicants,
  updateApplicantStatus,
} from "../Features/ApplicationSlice";

// Import router utilities
import { useNavigate, useParams } from "react-router-dom";

// Import environment variables
import * as ENV from "../config";

// Import CSS styles
import "../Styles/ApplicantsJob.css";

const ApplicantsJob = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { jobId } = useParams();

  const { applicants, isLoading } = useSelector(
    (state) => state.applications
  );

  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 6;

  useEffect(() => {
    if (jobId) dispatch(fetchApplicants(jobId));
  }, [dispatch, jobId]);

  const handleAction = (applicationId, status) => {
    dispatch(updateApplicantStatus({ applicationId, status }));
  };

  if (isLoading) return <p>Loading applicants...</p>;

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
          <div className="applicants-grid fixed-grid">
            {currentCards.map((app) => (
              <div key={app._id} className="applicant-card glass-card">
                {/* PROFILE */}
                <div className="profile-row">
                  <div className="icon-circle">👤</div>
                  <div>
                    <h3 className="applicant-name">
                      {app.applicantName}
                    </h3>
                    <p className="email">{app.applicantEmail}</p>
                  </div>
                </div>

                {/* STATUS */}
                <p className="status">
                  Status:
                  <span
                    className={`status-tag ${app.status.toLowerCase()}`}
                  >
                    {app.status}
                  </span>
                </p>

                {/* ACTION BUTTONS */}
                <div className="action-row">
                  {app.cvLink && (
                    <a
                      href={`${ENV.SERVER_URL}${app.cvLink}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cv-btn"
                    >
                      CV
                    </a>
                  )}

                  <button
                    className="chat-btn"
                    onClick={() =>
                      navigate(`/company-chat/${app._id}`)
                    }
                  >
                    Chat
                  </button>

                  <button
                    className="accept-btn"
                    onClick={() =>
                      handleAction(app._id, "Accepted")
                    }
                  >
                    Accept
                  </button>

                  <button
                    className="reject-btn"
                    onClick={() =>
                      handleAction(app._id, "Rejected")
                    }
                  >
                    Reject
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
                className={
                  currentPage === i + 1 ? "active-page" : ""
                }
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
