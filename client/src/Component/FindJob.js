import React, { useEffect, useState } from "react";
import "../Styles/FindJob.css";

const FindJob = () => {
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const storedJobs = JSON.parse(localStorage.getItem("jobs")) || [];
    setJobs(storedJobs);
  }, []);

  // 🔍 Search function
  const filteredJobs = jobs.filter(
    (job) =>
      job.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.skills.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 🟢 Apply function
  const handleApply = (job) => {
    const existingApplications =
      JSON.parse(localStorage.getItem("applications")) || [];
    const alreadyApplied = existingApplications.some(
      (appliedJob) => appliedJob.jobTitle === job.jobTitle
    );

    if (alreadyApplied) {
      alert("⚠️ You have already applied for this job!");
      return;
    }

    const updatedApplications = [...existingApplications, job];
    localStorage.setItem("applications", JSON.stringify(updatedApplications));
    alert("✅ Job applied successfully!");
  };

  return (
    <div className="findjob-page">
      <h1 className="findjob-title">
        Find <span className="accent">Job</span>
      </h1>

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

      {/* Job listings */}
      <div className="job-list">
        {filteredJobs.length === 0 ? (
          <p className="no-jobs">No jobs found.</p>
        ) : (
          filteredJobs.map((job, index) => (
            <div key={index} className="job-card">
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
