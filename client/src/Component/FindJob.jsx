// =====================================================
// FindJob.jsx (Clean Version + Custom Scrollbar)
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
              <div className="job-header">
                <h3>{job.jobTitle}</h3>
                <span className="rate">{job.rate} OMR · {job.rateType}</span>
              </div>

              <p className="org-name">{job.organization}</p>
              <p className="job-location">📍 {job.location || "Not specified"}</p>

              <p className="postedAt">
                📅 Posted:{" "}
                {new Date(job.postedAt).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </p>

              <div className="tags">
                <span className="tag">{job.sector}</span>
                <span className="tag">{job.category}</span>
                {job.payout && <span className="tag">{job.payout}</span>}
              </div>

              <p className="desc">{job.description}</p>
              <p className="skills">Skills: {job.skills}</p>

              <div className="job-actions">
                <button className="btn-apply" onClick={() => handleApply(job)}>
                  Apply ➜
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FindJob;
