// =====================================================
// FindJob.jsx (FINAL VERSION)
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

  const { jobList } = useSelector((state) => state.jobs);
  const { user } = useSelector((state) => state.users);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 4;

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

  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);

  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  const changePage = (pageNum) => {
    if (pageNum >= 1 && pageNum <= totalPages) setCurrentPage(pageNum);
  };

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

      {/* ---------------- Search ---------------- */}
      <div className="search-container">
        <div className="search-wrapper">
          <input
            type="text"
            placeholder="Search skills, companies"
            value={searchTerm}
            className="search-box"
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
        <button className="search-btn">Search</button>
      </div>

      {/* ---------------- Job List ---------------- */}
      <div className="job-list">
        {currentJobs.length === 0 ? (
          <p>No jobs found.</p>
        ) : (
          currentJobs.map((job) => (
            <div key={job._id} className="job-card">

              {/* Header */}
              <div className="job-card-header">
                <h3 className="job-title">{job.jobTitle}</h3>
                <span className="job-rate">
                  {job.rate} OMR · {job.rateType}
                </span>
              </div>

              {/* Location */}
              <p className="job-location">📍 {job.location}</p>

              {/* Date */}
              <p className="job-date">
                📅 {job.postedAt?.slice(0, 10)} — ⏰ {job.postedAt?.slice(11, 16)}
              </p>

              {/* Buttons */}
              <div className="job-actions-left">
                <button className="btn-details" onClick={() => setSelectedJob(job)}>
                  View details
                </button>

                <button className="btn-apply" onClick={() => handleApply(job)}>
                  Apply ➜
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ---------------- Pagination ---------------- */}
      {totalPages > 1 && (
        <div className="pagination">
          <button disabled={currentPage === 1} onClick={() => changePage(currentPage - 1)}>
            ◀ Prev
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              className={currentPage === i + 1 ? "active-page" : ""}
              onClick={() => changePage(i + 1)}
            >
              {i + 1}
            </button>
          ))}

          <button disabled={currentPage === totalPages} onClick={() => changePage(currentPage + 1)}>
            Next ▶
          </button>
        </div>
      )}

      {/* ---------------- Modal ---------------- */}
      {selectedJob && (
        <div className="modal-overlay">
          <div className="modal-card wide-modal">

            <button className="close-btn" onClick={() => setSelectedJob(null)}>✖</button>

            <h2 className="modal-title">{selectedJob.jobTitle}</h2>

            {/* Price */}
            <div className="modal-box">
              💰 {selectedJob.rate} OMR · {selectedJob.rateType}
            </div>

            {/* Location + Date/Time */}
            <div className="modal-row">
              <div className="modal-box half">
                📍 {selectedJob.location}
              </div>

              <div className="modal-box half">
                📅 {selectedJob.postedAt?.slice(0, 10)} — ⏰ {selectedJob.postedAt?.slice(11, 16)}
              </div>
            </div>

            {/* Description */}
            <p className="modal-desc-title">Description</p>
            <div className="modal-desc-container">
              {selectedJob.description}
            </div>

            {/* Skills */}
            <p className="modal-desc-title">Skills</p>
            <div className="skills-wrapper">
              {selectedJob.skills.split(",").map((skill, idx) => (
                <span key={idx} className="skill-badge">{skill.trim()}</span>
              ))}
            </div>

            {/* Apply button */}
            <button className="modal-apply-btn" onClick={() => handleApply(selectedJob)}>
              Apply Now
            </button>

          </div>
        </div>
      )}

    </div>
  );
};

export default FindJob;
