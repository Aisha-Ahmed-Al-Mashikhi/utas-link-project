import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../Styles/ApplicantsJob.css";

const ApplicantsJob = () => {
  const [applications, setApplications] = useState([]);
  const navigate = useNavigate();

  // ✅ Protect route: only company users
  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "company") navigate("/login");
  }, [navigate]);

  // ✅ Fetch applications for this company
  useEffect(() => {
    const loggedCompany = JSON.parse(localStorage.getItem("loggedUser"));
    const organization = loggedCompany?.companyName;

    if (!organization) {
      console.warn("⚠️ No company info found. Please login again.");
      return;
    }

    axios
      .get(`http://localhost:3001/applications/company/${organization}`)
      .then((res) => {
        console.log("📦 Company applications:", res.data);
        setApplications(res.data);
      })
      .catch((err) =>
        console.error("❌ Error fetching company applications:", err)
      );
  }, []);

  // ✅ Update application status (Accept / Reject)
  const updateStatus = async (id, status) => {
    try {
      await axios.put(`http://localhost:3001/applications/${id}/status`, {
        status,
      });
      alert(`Status changed to ${status}`);
      setApplications((prev) =>
        prev.map((a) => (a._id === id ? { ...a, status } : a))
      );
    } catch {
      alert("❌ Error updating status");
    }
  };

  return (
    <div className="applicants-dashboard">
      <h1 className="page-title">
        Job <span className="highlight">Applicants</span>
      </h1>

      {applications.length === 0 ? (
        <p className="no-apps">No applicants yet.</p>
      ) : (
        <div className="applicants-table-container">
          <table className="styled-table">
            <thead>
              <tr>
                <th>Applicant Name</th>
                <th>Email</th>
                <th>Job Title</th>
                <th>Status</th>
                <th>CV</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app._id}>
                  <td>{app.applicantName}</td>
                  <td>{app.applicantEmail}</td>
                  <td>{app.jobTitle}</td>
                  <td>
                    <span
                      className={`status-badge ${
                        app.status === "Accepted"
                          ? "accepted"
                          : app.status === "Rejected"
                          ? "rejected"
                          : "pending"
                      }`}
                    >
                      {app.status}
                    </span>
                  </td>

                  {/* ✅ CV Link */}
                  <td>
                    {app.cvLink ? (
                      <a
                        href={app.cvLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="cv-btn"
                      >
                        View CV
                      </a>
                    ) : (
                      "—"
                    )}
                  </td>

                  <td>
                    <button
                      className="btn-accept"
                      onClick={() => updateStatus(app._id, "Accepted")}
                    >
                      Accept
                    </button>
                    <button
                      className="btn-reject"
                      onClick={() => updateStatus(app._id, "Rejected")}
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ApplicantsJob;
