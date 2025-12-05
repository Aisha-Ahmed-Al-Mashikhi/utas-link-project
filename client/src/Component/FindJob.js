// =====================================================
// FindJob.jsx (With Job Tabs + Location + Posted Date)
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

  const { jobList, isLoading } = useSelector((state) => state.jobs);
  const { user } = useSelector((state) => state.users);

  const [searchTerm, setSearchTerm] = useState("");

  // ⭐ NEW: Active Tab
  const [activeTab, setActiveTab] = useState("latest");

  // Load jobs
  useEffect(() => {
    dispatch(fetchJobs());
  }, [dispatch]);

  // Load user
  useEffect(() => {
    const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));
    if (loggedUser?.email) dispatch(fetchUser(loggedUser.email));
  }, [dispatch]);

  // ⭐ FILTER BASED ON TAB + SEARCH
  const filteredJobs = jobList
    .filter((job) => {
      const term = searchTerm.toLowerCase();
      return (
        job.jobTitle.toLowerCase().includes(term) ||
        (job.organization || "").toLowerCase().includes(term) ||
        (job.skills || "").toString().toLowerCase().includes(term)
      );
    })
    .filter((job) => {
      if (activeTab === "latest") return true;
      if (activeTab === "trending") return job.views >= 20;
      if (activeTab === "highsalary") return job.rate >= 50;
      if (activeTab === "parttime")
        return job.category?.toLowerCase().includes("part");
      if (activeTab === "remote")
        return job.location?.toLowerCase().includes("remote");
      return true;
    });

  // APPLY JOB
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

      {/* ⭐ JOB FILTER TABS */}
      <div className="job-tabs">
        <button
          className={activeTab === "latest" ? "active" : ""}
          onClick={() => setActiveTab("latest")}
        >
          Latest Jobs
        </button>

        <button
          className={activeTab === "trending" ? "active" : ""}
          onClick={() => setActiveTab("trending")}
        >
          Trending
        </button>

        <button
          className={activeTab === "highsalary" ? "active" : ""}
          onClick={() => setActiveTab("highsalary")}
        >
          High Salary
        </button>

        <button
          className={activeTab === "parttime" ? "active" : ""}
          onClick={() => setActiveTab("parttime")}
        >
          Part-time
        </button>

        <button
          className={activeTab === "remote" ? "active" : ""}
          onClick={() => setActiveTab("remote")}
        >
          Remote
        </button>
      </div>

      {/* Job List */}
      <div className="job-list">
        {filteredJobs.length === 0 ? (
          <p className="no-jobs">No jobs found.</p>
        ) : (
          filteredJobs.map((job) => (
            <div key={job._id} className="job-card">
              {/* Header */}
              <div className="job-header">
                <h3>{job.jobTitle}</h3>
                <span className="rate">
                  {job.rate} OMR · {job.rateType}
                </span>
              </div>

              <p className="org-name">{job.organization}</p>

              {/* Location */}
              <p className="job-location">📍 {job.location || "Not specified"}</p>

              {/* Posted Date */}
              <p className="postedAt">
                📅 Posted:{" "}
                {new Date(job.postedAt).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </p>

              {/* Tags */}
              <div className="tags">
                <span className="tag">{job.sector}</span>
                <span className="tag">{job.category}</span>
                {job.payout && <span className="tag">{job.payout}</span>}
              </div>

              {/* Description */}
              <p className="desc">{job.description}</p>

              {/* Skills */}
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
