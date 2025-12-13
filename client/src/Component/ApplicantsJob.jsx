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

// Define ApplicantsJob component
const ApplicantsJob = () => {
  // Initialize dispatch
  const dispatch = useDispatch();
  // Initialize navigation
  const navigate = useNavigate();
  // Get jobId from URL
  const { jobId } = useParams();

  // Get applicants state
  const { applicants, isLoading } = useSelector((state) => state.applications);

  // Track current page
  const [currentPage, setCurrentPage] = useState(1);
  // Set cards per page
  const cardsPerPage = 6;

  // Fetch applicants on load
  useEffect(() => {
    // Dispatch fetch action
    if (jobId) dispatch(fetchApplicants(jobId));
  }, [dispatch, jobId]);

  // Handle accept or reject
  const handleAction = (applicationId, status) => {
    // Dispatch status update
    dispatch(updateApplicantStatus({ applicationId, status }));
  };

  // Show loading text
  if (isLoading) return <p>Loading applicants...</p>;

  // Calculate last index
  const indexLast = currentPage * cardsPerPage;
  // Calculate first index
  const indexFirst = indexLast - cardsPerPage;
  // Get current cards
  const currentCards = applicants.slice(indexFirst, indexLast);
  // Calculate total pages
  const totalPages = Math.ceil(applicants.length / cardsPerPage);

  // Return JSX
  return (
    // Page container
    <div className="applicants-page">
      {/* Page title */}
      <h1 className="app-title">
        {/* Static title text */}
        Job {/* Highlighted word */}
        <span className="accent">Applicants</span>
      </h1>

      {/* Check if applicants list is empty */}
      {applicants.length === 0 ? (
        // Empty state message
        <p className="empty">No applicants yet.</p>
      ) : (
        <>
          {/* Applicants grid container */}
          <div className="applicants-grid fixed-grid">
            {/* Loop through current applicants */}
            {currentCards.map((app) => (
              // Applicant card
              <div key={app._id} className="applicant-card glass-card">
                {/* Profile row */}
                <div className="profile-row">
                  {/* Profile icon */}
                  <div className="icon-circle">👤</div>
                  {/* Applicant info container */}
                  <div>
                    {/* Applicant name */}
                    <h3 className="applicant-name">{app.applicantName}</h3>
                    {/* Applicant email */}
                    <p className="email">{app.applicantEmail}</p>
                  </div>
                </div>

                {/* Status section */}
                <p className="status">
                  {/* Status label */}
                  Status:
                  {/* Status badge */}
                  <span className={`status-tag ${app.status.toLowerCase()}`}>
                    {app.status}
                  </span>
                </p>

                {/* Action buttons container */}
                <div className="action-row">
                  {/* Check if CV exists */}
                  {app.cvLink && (
                    // CV link
                    <a
                      // CV URL
                      href={`${ENV.SERVER_URL}${app.cvLink}`}
                      // Open in new tab
                      target="_blank"
                      // Security attributes
                      rel="noopener noreferrer"
                      // Button style
                      className="cv-btn"
                    >
                      {/* CV text */}
                      View CV 📄
                    </a>
                  )}

                  {/* Chat button */}
                  <button
                    // Chat button style
                    className="chat-btn"
                    // Navigate to chat page
                    onClick={() => navigate(`/company-chat/${app._id}`)}
                  >
                    {/* Chat label */}
                    Chat 💬
                  </button>

                  {/* Accept button */}
                  <button
                    // Accept button style
                    className="accept-btn"
                    // Accept applicant
                    onClick={() => handleAction(app._id, "Accepted")}
                  >
                    {/* Accept label */}
                    Accept ✔
                  </button>

                  {/* Reject button */}
                  <button
                    // Reject button style
                    className="reject-btn"
                    // Reject applicant
                    onClick={() => handleAction(app._id, "Rejected")}
                  >
                    {/* Reject label */}
                    Reject ✖
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination container */}
          <div className="app-pagination">
            {/* Previous page button */}
            <button
              // Go to previous page
              onClick={() => setCurrentPage((p) => p - 1)}
              // Disable on first page
              disabled={currentPage === 1}
            >
              Prev
            </button>

            {/* Page number buttons */}
            {[...Array(totalPages)].map((_, i) => (
              <button
                // Page key
                key={i}
                // Active page style
                className={currentPage === i + 1 ? "active-page" : ""}
                // Change page
                onClick={() => setCurrentPage(i + 1)}
              >
                {/* Page number */}
                {i + 1}
              </button>
            ))}

            {/* Next page button */}
            <button
              // Go to next page
              onClick={() => setCurrentPage((p) => p + 1)}
              // Disable on last page
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
export default ApplicantsJob;
