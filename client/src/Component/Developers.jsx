// Import React library
import React from "react";
// Import developers page styles
import "../Styles/Developers.css";

// Define Developer component
const Developers = () => {
  // Return JSX
  return (
    // Main developers container
    <div className="dev-container">
      {/* Page title */}
      <h1 className="dev-title">
        {/* Static title text */}
        Project {/* Highlighted text */}
        <span>Developers</span>
      </h1>

      {/* Developer section container */}
      <div className="dev-grid">
        {/* Developer card */}
        <div className="dev-card">
          {/* Developer names */}
          <h3>Aisha Al-Mashikhi</h3>

          {/* Developer role */}
          <p className="role">Full-Stack Developer</p>

          {/* Description text */}
          <p className="desc">
            This project was fully developed by Aisha Al-Mashikhi covering all aspects including:
          </p>

          {/* Skills list */}
          <ul className="dev-list">
            {/* Front-end item */}
            <li>Front-end development (React, Redux, UI/UX)</li>
            {/* Back-end item */}
            <li>Back-end development (Node.js, Express)</li>
            {/* Database item */}
            <li>Database design and modeling (MongoDB)</li>
            {/* API item */}
            <li>REST API creation and integration</li>
            {/* Security item */}
            <li>Authentication & Authorization</li>
            {/* Deployment item */}
            <li>Deployment and production configuration</li>
            {/* Testing item */}
            <li>Testing, debugging, and performance optimization</li>
          </ul>

          {/* Additional description */}
          <p className="desc">
            The system features job posting, applications, messaging, file
            uploads, and a social posting module — all designed and implemented
            by a both developers.
          </p>
        </div>
      </div>

      {/* References section */}
      <div className="references">
        {/* References title */}
        <h2>References & Resources</h2>

        {/* References list */}
        <ul>
          {/* React reference */}
          <li>ReactJS Documentation — https://react.dev</li>
          {/* Redux reference */}
          <li>Redux Toolkit Docs — https://redux-toolkit.js.org</li>
          {/* Node reference */}
          <li>Node.js + Express Documentation — https://expressjs.com</li>
          {/* MongoDB reference */}
          <li>MongoDB Documentation — https://mongodb.com/docs</li>
          {/* W3Schools reference */}
          <li>W3Schools Web Development Tutorials</li>
          {/* StackOverflow reference */}
          <li>StackOverflow — troubleshooting and optimization</li>
          {/* MDN reference */}
          <li>MDN Web Docs (JavaScript / CSS)</li>
        </ul>

        {/* Reference note */}
        <p className="ref-note">
          These resources supported the development process and helped improve
          functionality, design, and structure of the system.
        </p>
      </div>
    </div>
  );
};

// Export Developers component
export default Developers;
