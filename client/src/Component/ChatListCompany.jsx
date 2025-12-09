import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchApplicants } from "../Features/ApplicationSlice";
import "../Styles/ChatList.css";
import { useNavigate } from "react-router-dom";

const ChatListCompany = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.users);
  const { applicants } = useSelector((state) => state.applications);

  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 6;

  const companyEmail =
    user?.email || JSON.parse(localStorage.getItem("loggedUser"))?.email;

  useEffect(() => {
    if (companyEmail) dispatch(fetchApplicants(companyEmail));
  }, [dispatch, companyEmail]);

  // pagination
  const indexLast = currentPage * cardsPerPage;
  const indexFirst = indexLast - cardsPerPage;
  const currentCards = applicants.slice(indexFirst, indexLast);
  const totalPages = Math.ceil(applicants.length / cardsPerPage);

  return (
    <div className="chatlist-page">
      <h1 className="chatlist-title">
        Company <span className="accent">Chats</span>
      </h1>

      {applicants.length === 0 ? (
        <div className="empty-chats">
  No active chats yet.
</div>

      ) : (
        <>
          <div className="chatlist-grid fixed-grid">
            {currentCards.map((app) => (
              <div
                key={app._id}
                className="chat-card"
                onClick={() => navigate(`/company-chat/${app._id}`)}
              >
                <div className="chat-left">
                  <div className="chat-icon">👤</div>

                  <div>
                    <h3 className="chat-job">{app.applicantName}</h3>
                    <p className="chat-company">{app.jobTitle}</p>
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

export default ChatListCompany;
