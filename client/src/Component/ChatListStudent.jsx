import React, { useEffect, useState } from "react";
import axios from "axios";
import * as ENV from "../config";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "../Styles/ChatList.css";

const ChatListStudent = () => {
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.users);

  const [applications, setApplications] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const cardsPerPage = 6; // 3 × 2

  useEffect(() => {
    const load = async () => {
      const res = await axios.get(
        `${ENV.SERVER_URL}/applications/${user.email}`
      );
      setApplications(res.data);
    };
    load();
  }, [user.email]);

  // Pagination logic
  const indexLast = currentPage * cardsPerPage;
  const indexFirst = indexLast - cardsPerPage;
  const currentCards = applications.slice(indexFirst, indexLast);
  const totalPages = Math.ceil(applications.length / cardsPerPage);

  return (
    <div className="chatlist-page">
      <h1 className="chatlist-title">
        My <span className="accent">Chats</span>
      </h1>

      {applications.length === 0 ? (
        <p>No chats available.</p>
      ) : (
        <>
          {/* FIXED 3×2 GRID */}
          <div className="chatlist-grid fixed-grid">
            {currentCards.map((app) => (
              <div
                key={app._id}
                className="chat-card"
                onClick={() => navigate(`/student-chat/${app._id}`)}
              >
                <div className="chat-left">
                  <div className="chat-icon">💬</div>

                  <div>
                    <h3 className="chat-job">{app.jobTitle}</h3>
                    <p className="chat-company">{app.organization}</p>
                  </div>
                </div>

                <button className="chat-btn">Open Chat</button>
              </div>
            ))}
          </div>

          {/* PAGINATION */}
          <div className="chat-pagination">
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

export default ChatListStudent;
