import React from "react";
import "../Styles/Developers.css";

const Developers = () => {
  return (
    <div className="dev-container">
      <h1 className="dev-title">
        Project <span>Developer</span>
      </h1>

      {/* Solo Developer Section */}
      <div className="dev-grid">
        <div className="dev-card">
          <h3>Aisha Al-Mashikhi</h3>
          <p className="role">Full-Stack Developer</p>
          <p className="desc">
            This project was fully developed by Aisha Al-Mashikhi, covering all
            aspects including:
          </p>

          <ul className="dev-list">
            <li>Front-end development (React, Redux, UI/UX)</li>
            <li>Back-end development (Node.js, Express)</li>
            <li>Database design and modeling (MongoDB)</li>
            <li>REST API creation and integration</li>
            <li>Authentication & Authorization</li>
            <li>Deployment and production configuration</li>
            <li>Testing, debugging, and performance optimization</li>
          </ul>

          <p className="desc">
            The system features job posting, applications, messaging, file
            uploads, and a social posting module — all designed and implemented
            by a single developer.
          </p>
        </div>
      </div>

      {/* References Section */}
      <div className="references">
        <h2>References & Resources</h2>

        <ul>
          <li>ReactJS Documentation — https://react.dev</li>
          <li>Redux Toolkit Docs — https://redux-toolkit.js.org</li>
          <li>Node.js + Express Documentation — https://expressjs.com</li>
          <li>MongoDB Documentation — https://mongodb.com/docs</li>
          <li>W3Schools Web Development Tutorials</li>
          <li>StackOverflow — troubleshooting and optimization</li>
          <li>MDN Web Docs (JavaScript / CSS)</li>
        </ul>

        <p className="ref-note">
          These resources supported the development process and helped improve
          functionality, design, and structure of the system.
        </p>
      </div>
    </div>
  );
};

export default Developers;
