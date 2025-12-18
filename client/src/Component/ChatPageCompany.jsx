// Import React and hooks
import React, { useEffect, useState, useRef } from "react";
// Import routing hooks
import { useParams, useNavigate } from "react-router-dom";
// Import Redux hooks
import { useDispatch, useSelector } from "react-redux";
// Import chat actions
import { fetchMessages, sendMessage } from "../Features/ChatSlice";
// Import CSS styles
import "../Styles/Chat.css";

// Define ChatPageCompany component
const ChatPageCompany = () => {
  // Get applicationId from URL
  const { applicationId } = useParams();
  // Initialize navigation
  const navigate = useNavigate();
  // Initialize dispatch
  const dispatch = useDispatch();

  // Get messages from Redux
  const { messages } = useSelector((s) => s.chat);
  // Get company data from Redux
  const { company } = useSelector((s) => s.companies);

  // Store message text
  const [text, setText] = useState("");
  // Reference to bottom of chat
  const bottomRef = useRef(null);

  // Fetch messages on load
  useEffect(() => {
    // Dispatch fetch messages
    dispatch(fetchMessages(applicationId));
  }, [applicationId, dispatch]);

  // Scroll to bottom when messages change
  useEffect(() => {
    // Auto scroll behavior
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle sending message
  const handleSend = () => {
    // Prevent empty messages
    if (!text.trim()) return;

    // Build message data
    const msgData = {
      // Set application id
      applicationId,
      // Sender info
      from: {
        email: company.email,
        name: company.companyName,
        role: "company",
      },
      // Receiver info
      to: {
        email: "student@email.com",
        name: "Student",
        role: "student",
      },
      // Message content
      message: {
        text,
        sentAt: new Date(),
      },
    };

    // Dispatch send message
    dispatch(sendMessage(msgData));
    // Clear input
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
            Chat with {/* Highlighted text */}
            <span className="accent">Applicant</span>
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
              // Align message based on sender
              className={`chat-row ${
                msg.from.email === company.email ? "right" : "left"
              }`}
            >
              {/* Message bubble */}
              <div
                className={`bubble ${
                  msg.from.email === company.email ? "me" : "them"
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
            {/* Button text */}
            Send {/* Arrow icon */}
            <span className="arrow">➤</span>
          </button>
        </div>
      </div>
    </>
  );
};

// Export component
export default ChatPageCompany;
