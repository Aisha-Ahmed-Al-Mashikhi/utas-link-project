// =====================================================
// FindJob.jsx (Final FIXED Version)
// Uses Redux for jobs + user profile
// Applies only CV + Bank validation
// =====================================================

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

// Redux
import { fetchJobs, applyForJob } from "../Features/JobSlice";
import { fetchUser } from "../Features/UserSlice";

import "../Styles/FindJob.css";

const FindJob = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // FIXED: jobs → jobList
  const { jobList, isLoading } = useSelector((state) => state.jobs);
  const { user } = useSelector((state) => state.users);

  const [searchTerm, setSearchTerm] = useState("");

  // Load jobs
  useEffect(() => {
    dispatch(fetchJobs());
  }, [dispatch]);

  // Load user profile (CV + BANK)
  useEffect(() => {
    const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));
    if (loggedUser?.email) {
      dispatch(fetchUser(loggedUser.email));
    }
  }, [dispatch]);

  // Search filter
  const filteredJobs = jobList.filter((job) => {
    const term = searchTerm.toLowerCase();
    return (
      job.jobTitle.toLowerCase().includes(term) ||
      job.organization.toLowerCase().includes(term) ||
      (job.skills || "").toString().toLowerCase().includes(term)
    );
  });

  // APPLY JOB
  const handleApply = async (job) => {
    const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));

    // CV check
    if (!user?.cvLink) {
      alert("Please upload your CV before applying.");
      return navigate("/student-profile");
    }

    // Bank check
    if (!user?.bankName) {
      alert("Please add your bank card before applying.");
      return navigate("/student-profile");
    }

   const appData = {
  jobId: job._id,
  jobTitle: job.jobTitle,
  organization: job.postedBy,
  applicantEmail: loggedUser.email,
  applicantName: loggedUser.name,
  cvLink: user.cvLink,
};
console.log("APP DATA:", appData);

dispatch(applyForJob(appData)).unwrap().then(() => alert("Job applied successfully!")).catch(() => alert("You already applied."));

  if (isLoading && jobList.length === 0) return <p>Loading jobs...</p>;

  return (
    <div className="findjob-page">
      <h1 className="findjob-title">
        Find <span className="accent">Job</span>
      </h1>

      {/* Search bar */}
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

      {/* Job Cards */}
      <div className="job-list">
        {filteredJobs.length === 0 ? (
          <p className="no-jobs">No jobs found.</p>
        ) : (
          filteredJobs.map((job) => (
            <div key={job._id} className="job-card">
              <div className="job-header">
                <h3>{job.jobTitle}</h3>
                <span className="rate">
                  {job.rate} OMR · {job.rateType}
                </span>
              </div>

              <p className="org-name">{job.organization}</p>

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
