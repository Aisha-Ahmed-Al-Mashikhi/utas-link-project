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
import { io } from "socket.io-client";

const socket = io("http://localhost:3001");

const ChatPageStudent = () => {
  const { applicationId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { messages } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.users);

  const [text, setText] = useState("");
  const endRef = useRef(null);

  useEffect(() => {
    dispatch(fetchMessages(applicationId));
  }, [applicationId, dispatch]);

  useEffect(() => {
    socket.emit("join_room", applicationId);

    socket.on("receive_message", (msg) => {
      dispatch(addIncomingMessage(msg));
    });

    return () => socket.off("receive_message");
  }, [applicationId, dispatch]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!text.trim()) return;

    const msg = {
      applicationId,
      senderEmail: user.email,
      senderRole: "student",
      message: text,
      createdAt: Date.now(),
    };

    dispatch(sendMessage(msg));
    socket.emit("send_message", msg);
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
              msg.senderEmail === user.email ? "right" : "left"
            }`}
          >
            <div
              className={`bubble ${
                msg.senderEmail === user.email ? "me" : "them"
              }`}
            >
              <p>{msg.message}</p>
              <span className="time">
                {new Date(msg.createdAt).toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}

        <div ref={endRef}></div>
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
