import React, { useState } from "react";
import "../Styles/MyApplications.css";

const MyApplications = () => {
  const [applications, setApplications] = useState([
    {
      id: 1,
      title: "Poster Designer – Dhofar Events",
      company: "Dhofar Events",
      type: "Part-time",
      rate: "8 OMR",
      task: "Task • 2 days",
      status: "Pending Review",
    },
  ]);

  const handleWithdraw = (id) => {
    setApplications(applications.filter((app) => app.id !== id));
    alert("Application withdrawn successfully ❌");
  };

  return (
    <div className="applications-page">
      <h1 className="applications-title">
        My <span className="accent">Applications</span>
      </h1>
      <p className="applications-sub">
        Track the status of your submitted job applications.
      </p>

      <div className="applications-list">
        {applications.map((app) => (
          <div className="application-card" key={app.id}>
            <div className="app-info">
              <div className="app-icon">🏢</div>
              <div>
                <h3 className="job-title">{app.title}</h3>
                <p className="company">Company: {app.company}</p>
                <p className="details">
                  Type: {app.type} • {app.rate} / {app.task}
                </p>
              </div>
            </div>

            <div className="app-actions">
              <button
                className="withdraw-btn"
                onClick={() => handleWithdraw(app.id)}
              >
                Withdraw Application
              </button>
              <button className="status-btn">{app.status}</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyApplications;
