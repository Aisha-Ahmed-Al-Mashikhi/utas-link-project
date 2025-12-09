// =====================================================
// FindJob.jsx — Final Version + Modal With Tags
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

  // ---------------- FILTER ----------------
  const filteredJobs = jobList.filter((job) => {
    const term = searchTerm.toLowerCase();
    return (
      job.jobTitle.toLowerCase().includes(term) ||
      (job.organization || "").toLowerCase().includes(term) ||
      (job.skills || "").toLowerCase().includes(term)
    );
  });

  // ---------------- PAGINATION ----------------
  const indexLast = currentPage * jobsPerPage;
  const indexFirst = indexLast - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexFirst, indexLast);
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  const changePage = (p) => {
    if (p >= 1 && p <= totalPages) setCurrentPage(p);
  };

  // ---------------- APPLY ----------------
  const handleApply = async (job) => {
    const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));

    if (!user?.cvLink) {
      alert("Please upload your CV before applying.");
      return navigate("/student-profile");
    }

    const data = {
      jobId: job._id,
      jobTitle: job.jobTitle,
      organization: job.organization || "Unknown Company",
      applicantEmail: loggedUser.email,
      applicantName: loggedUser.name,
      cvLink: user.cvLink,
    };

    dispatch(applyForJob(data))
      .unwrap()
      .then(() => alert("Job applied successfully!"))
      .catch(() => alert("You already applied."));
  };

  return (
    <div className="findjob-page scroll-page">
      <h1 className="findjob-title">
        Find <span className="accent">Job</span>
      </h1>

      {/* ---------------- SEARCH BAR ---------------- */}
      <div className="search-container">
        <div className="search-wrapper">
          <input
            type="text"
            placeholder="Search skills, companies"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="search-box"
          />
        </div>
        <button className="search-btn">Search</button>
      </div>

      {/* ---------------- JOB LIST ---------------- */}
      <div className="job-list">
        {currentJobs.length === 0 ? (
          <p>No jobs found.</p>
        ) : (
          currentJobs.map((job) => (
            <div key={job._id} className="job-card">

              <div className="job-header">
                <h3>{job.jobTitle}</h3>
                <span className="rate">
                  {job.rate} OMR · {job.rateType}
                </span>
              </div>

              <p className="job-location">📍 {job.location}</p>

              <p className="job-date">
                📅 {job.postedAt?.slice(0, 10)}
              </p>

              {/* TAGS */}
              <div className="job-tags">
                {job.category && <span className="tag">{job.category}</span>}
                {job.sector && <span className="tag">{job.sector}</span>}
              </div>

              {/* DESCRIPTION SNIPPET */}
              <p className="job-snippet">
                {job.description?.slice(0, 120)}...
              </p>

              {/* SKILLS */}
              <p className="job-skills">
                <strong>Skills:</strong> {job.skills}
              </p>

              <div className="job-actions-right">
                <button className="btn-apply" onClick={() => handleApply(job)}>
                  Apply ➜
                </button>
                <button className="btn-details" onClick={() => setSelectedJob(job)}>
                  View details
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ---------------- PAGINATION ---------------- */}
      {totalPages > 1 && (
        <div className="pagination">
          <button onClick={() => changePage(currentPage - 1)} disabled={currentPage === 1}>
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

          <button
            onClick={() => changePage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next ▶
          </button>
        </div>
      )}

      {/* ---------------- MODAL ---------------- */}
      {selectedJob && (
        <div className="modal-overlay">
          <div className="modal-card">

            <button className="close-btn" onClick={() => setSelectedJob(null)}>
              ✖
            </button>

            <h2 className="modal-title">{selectedJob.jobTitle}</h2>

            {/* PRICE BOX */}
            <div className="price-box">
              {selectedJob.rate} OMR · {selectedJob.rateType}
            </div>

            <div className="modal-box">📍 {selectedJob.location}</div>
            <div className="modal-box">📅 {selectedJob.postedAt?.slice(0, 10)}</div>

            {/* TAGS */}
            <div className="modal-tags">
              {selectedJob.category && <span className="tag">{selectedJob.category}</span>}
              {selectedJob.sector && <span className="tag">{selectedJob.sector}</span>}
            </div>

            <p className="modal-section-title">Description</p>
            <p className="modal-desc">{selectedJob.description}</p>

            <div className="modal-box">
              <strong>Skills:</strong> {selectedJob.skills}
            </div>

            <button
              className="modal-apply-btn"
              onClick={() => handleApply(selectedJob)}
            >
              Apply Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FindJob;
