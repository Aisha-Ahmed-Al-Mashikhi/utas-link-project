import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchApplicants } from "../Features/ApplicationSlice";
import "../Styles/ChatList.css"; // نستخدم نفس ملف الاستايل
import { useNavigate } from "react-router-dom";

const ChatListCompany = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.users);
  const { applicants } = useSelector((state) => state.applications);

  // Get company email
  const companyEmail =
    user?.email || JSON.parse(localStorage.getItem("loggedUser"))?.email;

  useEffect(() => {
    if (companyEmail) {
      dispatch(fetchApplicants(companyEmail));
    }
  }, [dispatch, companyEmail]);

  return (
    <div className="chatlist-page">
      <h1 className="chatlist-title">
        Company <span className="accent">Chats</span>
      </h1>

      {applicants.length === 0 ? (
        <p>No active chats yet.</p>
      ) : (
        <div className="chatlist-grid">
          {applicants.map((app) => (
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

              <button className="chat-btn">
                Open Chat
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChatListCompany;
