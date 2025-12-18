// Import React and hooks
import React, { useEffect, useState, useRef } from "react";
// Import routing hooks
import { useParams, useNavigate } from "react-router-dom";
// Import Redux hooks
import { useDispatch, useSelector } from "react-redux";
// Import chat actions
import { fetchMessages, sendMessage } from "../Features/ChatSlice";
// Import chat styles
import "../Styles/Chat.css";

// Define ChatPageStudent component
const ChatPageStudent = () => {
  // Get applicationId from URL
  const { applicationId } = useParams();
  // Initialize navigation
  const navigate = useNavigate();
  // Initialize dispatch
  const dispatch = useDispatch();

  // Get messages from chat store
  const { messages } = useSelector((s) => s.chat);
  // Get logged-in user data
  const { user } = useSelector((s) => s.users);

  // Store message input text
  const [text, setText] = useState("");
  // Reference to bottom of chat
  const bottomRef = useRef(null);

  // Load messages from server
  useEffect(() => {
    // Dispatch fetch messages action
    dispatch(fetchMessages(applicationId));
  }, [applicationId, dispatch]);

  // Scroll to latest message
  useEffect(() => {
    // Scroll smoothly to bottom
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle send button click
  const handleSend = () => {
    // Prevent sending empty message
    if (!text.trim()) return;

    // Prepare message payload
    const msgData = {
      // Application identifier
      applicationId,
      // Sender information
      from: {
        email: user.email,
        name: user.name,
        role: "student",
      },
      // Receiver information
      to: {
        email: "company@email.com",
        name: "Company",
        role: "company",
      },
      // Message content
      message: {
        text,
        sentAt: new Date(),
      },
    };

    // Dispatch send message action
    dispatch(sendMessage(msgData));
    // Clear input field
    setText("");
  };

  // Return JSX
  return (
    <>
      {/* Background shape */}
      <div className="chat-bg-shape1"></div>
      {/* Background shape */}
      <div className="chat-bg-shape2"></div>

      {/* Main chat wrapper */}
      <div className="chat-wrapper">
        {/* Chat header */}
        <div className="chat-header">
          {/* Header title */}
          <h2>
            {/* Static text */}
            Chat {/* Highlighted text */}
            <span className="accent">Support</span>
          </h2>
          {/* Close chat button */}
          <button className="close-chat" onClick={() => navigate(-1)}>
            ✕
          </button>
        </div>

        {/* Chat messages box */}
        <div className="chat-box">
          {/* Loop through messages */}
          {messages.map((msg, i) => (
            // Message row
            <div
              // Message key
              key={i}
              // Align message by sender
              className={`chat-row ${
                msg.from.email === user.email ? "right" : "left"
              }`}
            >
              {/* Message bubble */}
              <div
                className={`bubble ${
                  msg.from.email === user.email ? "me" : "them"
                }`}
              >
                {/* Message text */}
                <p>{msg.message.text}</p>

                {/* Message time */}
                <span className="time">
                  {new Date(msg.message.sentAt).toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))}

          {/* Scroll anchor */}
          <div ref={bottomRef}></div>
        </div>

        {/* Input area */}
        <div className="chat-input-area">
          {/* Message input */}
          <input
            placeholder="Write a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          {/* Send button */}
          <button className="send-btn" onClick={handleSend}>
            {/* Button label */}
            Send {/* Arrow icon */}
            <span className="arrow">➤</span>
          </button>
        </div>
      </div>
    </>
  );
};

// Export ChatPageStudent component
export default ChatPageStudent;
