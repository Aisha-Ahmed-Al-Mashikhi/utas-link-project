import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchMessages, sendMessage } from "../Features/ChatSlice";
import { addIncomingMessage } from "../Features/ChatSlice";
import "../Styles/Chat.css";
import { io } from "socket.io-client";

// Create socket connection
const socket = io("http://localhost:3001");

const ChatPageStudent = () => {
  const { applicationId } = useParams();
  const dispatch = useDispatch();

  const { messages } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.users);

  const [text, setText] = useState("");
  const endRef = useRef(null);

  // Load messages from Mongo
  useEffect(() => {
    dispatch(fetchMessages(applicationId));
  }, [applicationId, dispatch]);

  // Join socket room
  useEffect(() => {
    socket.emit("join_room", applicationId);

    // Listen for real-time incoming messages
    socket.on("receive_message", (msg) => {
      dispatch(addIncomingMessage(msg));
    });

    return () => {
      socket.off("receive_message");
    };
  }, [applicationId, dispatch]);

  // Auto scroll bottom
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send message (DB + socket)
  const handleSend = () => {
    if (!text.trim()) return;

    const msgData = {
      applicationId,
      senderEmail: user.email,
      senderRole: "student",
      message: text,
      createdAt: new Date(),
    };

    // 1) save to DB
    dispatch(sendMessage(msgData));

    // 2) send real-time via socket
    socket.emit("send_message", msgData);

    setText("");
  };

  return (
    <div className="chat-container">
      <h2 className="chat-title">
        Chat <span className="accent">Support</span>
      </h2>

      <div className="chat-box">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`msg-row ${
              msg.senderEmail === user.email ? "msg-right" : "msg-left"
            }`}
          >
            <div
              className={`msg-bubble ${
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
          className="chat-input"
          placeholder="Write a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button className="send-btn" onClick={handleSend}>
          Send ➤
        </button>
      </div>
    </div>
  );
};

export default ChatPageStudent;
