import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchApplicants } from "../Features/ApplicationSlice";
import "../Styles/Chat.css";
import { useNavigate } from "react-router-dom";

const ChatListCompany = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.users);
  const { applicants } = useSelector((state) => state.applications);

  // Get company email safely
  const companyEmail =
    user?.email || JSON.parse(localStorage.getItem("loggedUser"))?.email;

  useEffect(() => {
    if (companyEmail) {
      dispatch(fetchApplicants(companyEmail));
    }
  }, [dispatch, companyEmail]);

  return (
    <div className="chatlist-container">
      <h1 className="chat-title">
        Company <span className="accent">Chats</span>
      </h1>

      {applicants.length === 0 ? (
        <p>No applicants yet.</p>
      ) : (
        <div className="chatlist-box">
          {applicants.map((app) => (
            <div
              key={app._id}
              className="chatlist-card"
              onClick={() => navigate(`/company-chat/${app._id}`)}
            >
              <h3>{app.applicantName}</h3>
              <p>{app.jobTitle}</p>
              <span className="status">{app.status}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChatListCompany;
