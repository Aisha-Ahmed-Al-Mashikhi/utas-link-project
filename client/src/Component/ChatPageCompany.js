// src/Component/ChatPageCompany.js

import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMessages,
  sendMessage,
  addIncomingMessage,
} from "../Features/ChatSlice";
import "../Styles/Chat.css";

const ChatPageCompany = () => {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { messages } = useSelector((state) => state.chat);
  const { company } = useSelector((state) => state.companies);

  const [text, setText] = useState("");
  const bottomRef = useRef(null);

  // Fetch messages on mount
  useEffect(() => {
    dispatch(fetchMessages(applicationId));
  }, [applicationId, dispatch]);

  // Scroll to bottom when new messages come
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!text.trim()) return;

    const msgData = {
      applicationId,

      from: {
        email: company.email,
        name: company.companyName,
        role: "company",
      },

      to: {
        email: "student@email.com", // سيتم تغييره من الـ application
        name: "Student",
        role: "student",
      },

      message: {
        text: text,
        sentAt: new Date(),
      },
    };

    dispatch(sendMessage(msgData));
    setText("");
  };

  return (
    <div className="chat-wrapper">
      <div className="chat-header">
        <h2>
          Chat with <span className="accent">Applicant</span>
        </h2>

        <button className="close-chat" onClick={() => navigate(-1)}>
          ✕
        </button>
      </div>

      <div className="chat-box">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`chat-row ${
              msg.from.email === company.email ? "right" : "left"
            }`}
          >
            <div
              className={`bubble ${
                msg.from.email === company.email ? "me" : "them"
              }`}
            >
              <p>{msg.message.text}</p>
              <span className="time">
                {new Date(msg.message.sentAt).toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}

        <div ref={bottomRef}></div>
      </div>

      <div className="chat-input-area">
        <input
          type="text"
          placeholder="Write a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <button onClick={handleSend}>Send ➤</button>
      </div>
    </div>
  );
};

export default ChatPageCompany;
