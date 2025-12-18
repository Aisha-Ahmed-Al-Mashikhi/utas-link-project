// Import React and hooks
import React, { useEffect, useState } from "react";
// Import Redux hooks
import { useDispatch, useSelector } from "react-redux";
// Import fetch applicants action
import { fetchApplicants } from "../Features/ApplicationSlice";
// Import CSS styles
import "../Styles/ChatList.css";
// Import navigation hook
import { useNavigate } from "react-router-dom";

// Define ChatListCompany component
const ChatListCompany = () => {
  // Initialize dispatch
  const dispatch = useDispatch();
  // Initialize navigate
  const navigate = useNavigate();

  // Get logged user from Redux
  const { user } = useSelector((state) => state.users);
  // Get applicants list from Redux
  const { applicants } = useSelector((state) => state.applications);

  // Track current page
  const [currentPage, setCurrentPage] = useState(1);
  // Set cards per page
  const cardsPerPage = 6;

  // Get company email from Redux or localStorage
  const companyEmail =
    user?.email || JSON.parse(localStorage.getItem("loggedUser"))?.email;

  // Fetch applicants when email changes
  useEffect(() => {
    // Dispatch fetch applicants
    if (companyEmail) dispatch(fetchApplicants(companyEmail));
  }, [dispatch, companyEmail]);

  // Calculate last index
  const indexLast = currentPage * cardsPerPage;
  // Calculate first index
  const indexFirst = indexLast - cardsPerPage;
  // Slice applicants for current page
  const currentCards = applicants.slice(indexFirst, indexLast);
  // Calculate total pages
  const totalPages = Math.ceil(applicants.length / cardsPerPage);

  // Return JSX
  return (
    // Main chat list page
    <div className="chatlist-page">
      {/* Page title */}
      <h1 className="chatlist-title">
        {/* Static title text */}
        Company {/* Highlighted word */}
        <span className="accent">Chats</span>
      </h1>

      {/* Check if chats exist */}
      {applicants.length === 0 ? (
        // Empty chats container
        <div className="empty-chats">
          {/* Empty message */}
          No active chats yet.
        </div>
      ) : (
        <>
          {/* Chats grid */}
          <div className="chatlist-grid fixed-grid">
            {/* Loop through chat cards */}
            {currentCards.map((app) => (
              // Single chat card
              <div
                // Unique key
                key={app._id}
                // Card style
                className="chat-card"
                // Navigate to chat page
                onClick={() => navigate(`/company-chat/${app._id}`)}
              >
                {/* Left chat content */}
                <div className="chat-left">
                  {/* User icon */}
                  <div className="chat-icon">👤</div>

                  {/* Text container */}
                  <div>
                    {/* Applicant name */}
                    <h3 className="chat-job">{app.applicantName}</h3>
                    {/* Job title */}
                    <p className="chat-company">{app.jobTitle}</p>
                  </div>
                </div>

                {/* Open chat button */}
                <button className="chat-btn">Open Chat</button>
              </div>
            ))}
          </div>

          {/* Pagination container */}
          <div className="chat-pagination">
            {/* Previous button */}
            <button
              // Go to previous page
              onClick={() => setCurrentPage((p) => p - 1)}
              // Disable on first page
              disabled={currentPage === 1}
            >
              Prev
            </button>

            {/* Page numbers */}
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

            {/* Next button */}
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
export default ChatListCompany;
