import React, { useEffect, useState } from "react";
import "../Styles/ApplicantsJob.css";

const ApplicantsJob = () => {
  const [postedJobs, setPostedJobs] = useState([]);
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const jobs = JSON.parse(localStorage.getItem("postedJobs")) || [];
    const apps = JSON.parse(localStorage.getItem("appliedJobs")) || [];
    setPostedJobs(jobs);
    setApplications(apps);
  }, []);

  // ✅ لتغيير حالة الطالب (قبول / رفض)
  const handleStatusChange = (jobTitle, studentEmail, newStatus) => {
    const updated = applications.map((app) =>
      app.title === jobTitle && app.email === studentEmail
        ? { ...app, status: newStatus }
        : app
    );
    setApplications(updated);
    localStorage.setItem("appliedJobs", JSON.stringify(updated));
  };

  // ✅ فتح الـ CV في تبويب جديد
  const handleViewCV = (cvName) => {
    alert(`Pretend opening CV file: ${cvName}`);
  };

  // ✅ فتح دردشة (placeholder)
  const handleChat = (studentName) => {
    alert(`Opening chat with ${studentName} 💬`);
  };

  return (
    <div className="dashboard-page">
      <h2 className="dash-title">📊 Company Dashboard</h2>

      {postedJobs.length === 0 ? (
        <p>No jobs posted yet.</p>
      ) : (
        postedJobs.map((job, index) => (
          <div key={index} className="dash-job-card">
            <h3>{job.title}</h3>
            <p>
              <strong>Posted by:</strong> {job.company} •{" "}
              <span className="dash-rate">
                {job.salary} OMR / {job.type}
              </span>
            </p>

            <h4 className="dash-subtitle">Applicants:</h4>

            {/* عرض المتقدمين على نفس الوظيفة */}
            {applications.filter((a) => a.title === job.title).length > 0 ? (
              applications
                .filter((a) => a.title === job.title)
                .map((app, i) => (
                  <div key={i} className="dash-applicant">
                    <div>
                      <p>
                        👤 <strong>{app.fullName}</strong> ({app.email})
                      </p>
                      <p>
                        Status:{" "}
                        <span
                          className={`status ${
                            app.status?.toLowerCase() || "pending"
                          }`}
                        >
                          {app.status || "Pending"}
                        </span>
                      </p>
                    </div>

                    <div className="dash-actions">
                      <button
                        className="view-btn"
                        onClick={() => handleViewCV(app.cvFile)}
                      >
                        📄 View CV
                      </button>
                      <button
                        className="chat-btn"
                        onClick={() => handleChat(app.fullName)}
                      >
                        💬 Chat
                      </button>
                      <button
                        className="accept-btn"
                        onClick={() =>
                          handleStatusChange(job.title, app.email, "Accepted")
                        }
                      >
                        ✅ Accept
                      </button>
                      <button
                        className="reject-btn"
                        onClick={() =>
                          handleStatusChange(job.title, app.email, "Rejected")
                        }
                      >
                        ❌ Reject
                      </button>
                    </div>
                  </div>
                ))
            ) : (
              <p className="no-apps">No applicants yet.</p>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default ApplicantsJob;
