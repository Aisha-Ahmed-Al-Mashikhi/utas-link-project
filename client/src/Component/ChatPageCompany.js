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
import { io } from "socket.io-client";

const socket = io("http://localhost:3001");

const ChatPageCompany = () => {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { messages } = useSelector((state) => state.chat);
  const { company } = useSelector((state) => state.companies);

  const [text, setText] = useState("");
  const bottomRef = useRef(null);

  // Load messages on mount
  useEffect(() => {
    dispatch(fetchMessages(applicationId));
  }, [applicationId, dispatch]);

  // Join Socket room + listen for incoming messages
  useEffect(() => {
    socket.emit("join_room", applicationId);

    socket.on("receive_message", (msg) => {
      dispatch(addIncomingMessage(msg));
    });

    return () => socket.off("receive_message");
  }, [applicationId, dispatch]);

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ===== FIX: ALWAYS GET VALID COMPANY EMAIL =====
  const getCompanyEmail = () => {
    return (
      company?.email ||
      JSON.parse(localStorage.getItem("loggedUser"))?.email ||
      null
    );
  };

  const handleSend = () => {
    if (!text.trim()) return;

    const senderEmail = getCompanyEmail();

    // Protect from sending invalid message
    if (!senderEmail) {
      alert("Company email not loaded yet! Try again.");
      return;
    }

    const msg = {
      applicationId,
      senderEmail,
      senderRole: "company",
      message: text,
      createdAt: new Date(),
    };

    // Save to DB
    dispatch(sendMessage(msg));

    // Real-time
    socket.emit("send_message", msg);

    setText("");
  };

  return (
    <div className="chat-wrapper">
      {/* HEADER */}
      <div className="chat-header">
        <h2>
          Chat with <span className="accent">Applicant</span>
        </h2>

        {/* CLOSE BUTTON */}
        <button className="close-chat" onClick={() => navigate(-1)}>
          ✕
        </button>
      </div>

      {/* CHAT AREA */}
      <div className="chat-box">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`chat-row ${
              msg.senderEmail === getCompanyEmail() ? "right" : "left"
            }`}
          >
            <div
              className={`bubble ${
                msg.senderEmail === getCompanyEmail() ? "me" : "them"
              }`}
            >
              <p>{msg.message}</p>
              <span className="time">
                {new Date(msg.createdAt).toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}

        <div ref={bottomRef}></div>
      </div>

      {/* INPUT */}
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
