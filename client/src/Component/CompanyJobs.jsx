// src/Component/CompanyJobs.js

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCompanyJobs, deleteJob, updateJob } from "../Features/JobSlice";
import "../Styles/CompanyJobs.css";
import { useNavigate } from "react-router-dom";

const CompanyJobs = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { companyJobs, isLoading } = useSelector((state) => state.jobs);

  const [showModal, setShowModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("loggedUser"));
    if (savedUser?.email) dispatch(fetchCompanyJobs(savedUser.email));
  }, [dispatch]);

  const handleView = (job) => {
    setSelectedJob(job);
    setShowModal(true);
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="companyjobs-page">
      <div className="companyjobs-wrapper">
        <h1 className="companyjobs-title">
          My <span className="accent">Jobs</span>
        </h1>

        <p className="subtitle">
          View your posted jobs in a clean and simple layout.<br />
          Click the view button to see full job details.
        </p>

        <div className="simple-grid">
          {companyJobs.map((job) => (
            <div className="simple-card" key={job._id}>
              <h3 className="simple-title">{job.jobTitle}</h3>

              <p className="simple-text">📍 {job.location || "No location"}</p>
              <p className="simple-text">
                💰 {job.rate} OMR — {job.rateType}
              </p>

              <button className="view-btn" onClick={() => handleView(job)}>
                View
              </button>
            </div>
          ))}
        </div>

        {/* VIEW MODAL */}
        {showModal && selectedJob && (
          <div className="view-overlay">
            <div className="view-modal">
              <button className="close-view" onClick={() => setShowModal(false)}>
                ✕
              </button>

              <h2>{selectedJob.jobTitle}</h2>

              <p><strong>Category:</strong> {selectedJob.category}</p>
              <p><strong>Sector:</strong> {selectedJob.sector}</p>
              <p><strong>Rate:</strong> {selectedJob.rate} OMR ({selectedJob.rateType})</p>
              <p><strong>Location:</strong> {selectedJob.location}</p>
              <p><strong>Skills:</strong> {selectedJob.skills}</p>
              <p><strong>Description:</strong> {selectedJob.description}</p>
              <p><strong>Payout:</strong> {selectedJob.payout || "Not specified"}</p>

              <div className="view-actions">
                <button
                  className="edit-btn"
                  onClick={() => navigate(`/edit-job?id=${selectedJob._id}`)}
                >
                  Edit
                </button>

                <button
                  className="delete-btn"
                  onClick={() => dispatch(deleteJob(selectedJob._id))}
                >
                  Delete
                </button>

                <button
                  className="applicants-btn"
                  onClick={() =>
                    navigate(`/applicants-job?jobId=${selectedJob._id}`)
                  }
                >
                  Applicants 👥
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default CompanyJobs;
