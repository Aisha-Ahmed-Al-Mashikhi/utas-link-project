// src/Component/ChatPageStudent.js

import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMessages,
  sendMessage,
  addIncomingMessage,
} from "../Features/ChatSlice";
import "../Styles/Chat.css";

const ChatPageStudent = () => {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { messages } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.users);

  const [text, setText] = useState("");
  const bottomRef = useRef(null);

  // Load messages when page opens
  useEffect(() => {
    dispatch(fetchMessages(applicationId));
  }, [applicationId, dispatch]);

  // Auto scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle SEND
  const handleSend = () => {
    if (!text.trim()) return;

    const msgData = {
      applicationId,

      from: {
        email: user.email,
        name: user.name,
        role: "student",
      },

      to: {
        email: "company@email.com", // سيتم تغييره عند الاسترجاع من التطبيق
        name: "Company",
        role: "company",
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
          Chat <span className="accent">Support</span>
        </h2>

        <button className="close-chat" onClick={() => navigate(-1)}>
          ✕
        </button>
      </div>

      <div className="chat-box">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`chat-row ${
              msg.from.email === user.email ? "right" : "left"
            }`}
          >
            <div
              className={`bubble ${
                msg.from.email === user.email ? "me" : "them"
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
          placeholder="Write a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <button onClick={handleSend}>Send ➤</button>
      </div>
    </div>
  );
};

export default ChatPageStudent;
