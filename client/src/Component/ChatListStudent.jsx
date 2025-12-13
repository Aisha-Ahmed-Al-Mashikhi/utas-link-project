// Import React and hooks
import React, { useEffect, useState } from "react";
// Import axios for HTTP requests
import axios from "axios";
// Import environment configuration
import * as ENV from "../config";
// Import Redux selector hook
import { useSelector } from "react-redux";
// Import navigation hook
import { useNavigate } from "react-router-dom";
// Import CSS styles
import "../Styles/ChatList.css";

// Define ChatListStudent component
const ChatListStudent = () => {
  // Initialize navigation
  const navigate = useNavigate();
  // Get logged-in user from Redux
  const { user } = useSelector((s) => s.users);

  // Store applications list
  const [applications, setApplications] = useState([]);
  // Track current page
  const [currentPage, setCurrentPage] = useState(1);

  // Set number of cards per page
  const cardsPerPage = 6;

  // Fetch applications on component load
  useEffect(() => {
    // Define async load function
    const load = async () => {
      // Send GET request for student applications
      const res = await axios.get(
        `${ENV.SERVER_URL}/applications/${user.email}`
      );
      // Update applications state
      setApplications(res.data);
    };
    // Call load function
    load();
  }, [user.email]);

  // Calculate last card index
  const indexLast = currentPage * cardsPerPage;
  // Calculate first card index
  const indexFirst = indexLast - cardsPerPage;
  // Slice applications for current page
  const currentCards = applications.slice(indexFirst, indexLast);
  // Calculate total number of pages
  const totalPages = Math.ceil(applications.length / cardsPerPage);

  // Return JSX
  return (
    // Main chat list page
    <div className="chatlist-page">
      {/* Page title */}
      <h1 className="chatlist-title">
        {/* Static text */}
        My {/* Highlighted text */}
        <span className="accent">Chats</span>
      </h1>

      {/* Check if applications list is empty */}
      {applications.length === 0 ? (
        // Empty chats container
        <div className="empty-chats">
          {/* Empty message */}
          No active chats yet.
        </div>
      ) : (
        <>
          {/* Chats grid container */}
          <div className="chatlist-grid fixed-grid">
            {/* Loop through chat cards */}
            {currentCards.map((app) => (
              // Single chat card
              <div
                // Unique key
                key={app._id}
                // Card style
                className="chat-card"
                // Navigate to student chat
                onClick={() => navigate(`/student-chat/${app._id}`)}
              >
                {/* Left chat content */}
                <div className="chat-left">
                  {/* Chat icon */}
                  <div className="chat-icon">💬</div>

                  {/* Text container */}
                  <div>
                    {/* Job title */}
                    <h3 className="chat-job">{app.jobTitle}</h3>
                    {/* Company name */}
                    <p className="chat-company">{app.organization}</p>
                  </div>
                </div>

                {/* Open chat button */}
                <button className="chat-btn">Open Chat</button>
              </div>
            ))}
          </div>

          {/* Pagination container */}
          <div className="chat-pagination">
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

// Export ChatListStudent component
export default ChatListStudent;
