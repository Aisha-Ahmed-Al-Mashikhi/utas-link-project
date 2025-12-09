// =====================================================
// FindJob.jsx (Final Version with Details Modal)
// =====================================================

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { fetchJobs, applyForJob } from "../Features/JobSlice";
import { fetchUser } from "../Features/UserSlice";

import "../Styles/FindJob.css";

const FindJob = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { jobList, isLoading } = useSelector((state) => state.jobs);
  const { user } = useSelector((state) => state.users);

  const [searchTerm, setSearchTerm] = useState("");

  // NEW — Modal State
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    dispatch(fetchJobs());
  }, [dispatch]);

  useEffect(() => {
    const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));
    if (loggedUser?.email) dispatch(fetchUser(loggedUser.email));
  }, [dispatch]);

  const filteredJobs = jobList.filter((job) => {
    const term = searchTerm.toLowerCase();
    return (
      job.jobTitle.toLowerCase().includes(term) ||
      (job.organization || "").toLowerCase().includes(term) ||
      (job.skills || "").toString().toLowerCase().includes(term)
    );
  });

  const handleApply = async (job) => {
    const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));

    if (!user?.cvLink) {
      alert("Please upload your CV before applying.");
      return navigate("/student-profile");
    }

    const appData = {
      jobId: job._id,
      jobTitle: job.jobTitle,
      organization: job.organization || "Unknown Company",
      applicantEmail: loggedUser.email,
      applicantName: loggedUser.name,
      cvLink: user.cvLink,
    };

    dispatch(applyForJob(appData))
      .unwrap()
      .then(() => alert("Job applied successfully!"))
      .catch(() => alert("You already applied."));
  };

  return (
    <div className="findjob-page scroll-page">
      <h1 className="findjob-title">
        Find <span className="accent">Job</span>
      </h1>

      {/* Search */}
      <div className="search-container">
        <div className="search-wrapper">
          <input
            type="text"
            placeholder="Search skills, companies"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-box"
          />
        </div>
        <button className="search-btn">Search</button>
      </div>

      {/* JOB LIST */}
      <div className="job-list">
        {filteredJobs.length === 0 ? (
          <p>No jobs found.</p>
        ) : (
          filteredJobs.map((job) => (
            <div key={job._id} className="job-card">

              {/* 🔥 Simplified card (Title + Location + Rate) */}
              <div className="job-header">
                <h3>{job.jobTitle}</h3>
                <span className="rate">
                  {job.rate} OMR · {job.rateType}
                </span>
              </div>

              <p className="job-location">📍 {job.location || "Not specified"}</p>

              {/* Buttons */}
              <div className="job-actions-between">
                <button
                  className="btn-details"
                  onClick={() => setSelectedJob(job)}
                >
                  عرض التفاصيل
                </button>

                <button
                  className="btn-apply"
                  onClick={() => handleApply(job)}
                >
                  Apply ➜
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 🔥 Modal (Job Details) */}
      {selectedJob && (
        <div className="modal-overlay">
          <div className="modal-card">

            <button className="close-btn" onClick={() => setSelectedJob(null)}>
              ✖
            </button>

            <h2>{selectedJob.jobTitle}</h2>
            <p className="modal-org">{selectedJob.organization}</p>

            <p>📍 {selectedJob.location}</p>
            <p>💰 {selectedJob.rate} OMR · {selectedJob.rateType}</p>

            <p className="modal-desc">{selectedJob.description}</p>

            {selectedJob.skills && (
              <p>
                <strong>Skills:</strong> {selectedJob.skills}
              </p>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default FindJob;
