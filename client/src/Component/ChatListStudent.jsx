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

  useEffect(() => {
    const load = async () => {
      const res = await axios.get(
        `${ENV.SERVER_URL}/applications/${user.email}`
      );
      setApplications(res.data);
    };
    load();
  }, [user.email]);

  return (
    <div className="chatlist-page">
      <h1 className="chatlist-title">
        My <span className="accent">Chats</span>
      </h1>

      {applications.length === 0 ? (
        <p>No chats available.</p>
      ) : (
        <div className="chatlist-grid">
          {applications.map((app) => (
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
      )}
    </div>
  );
};

export default ChatListStudent;
