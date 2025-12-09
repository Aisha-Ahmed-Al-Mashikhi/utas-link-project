// =====================================================
// FindJob.jsx (Final Clean Version)
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

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 4;

  // Fetch jobs
  useEffect(() => {
    dispatch(fetchJobs());
  }, [dispatch]);

  // Fetch logged user
  useEffect(() => {
    const logged = JSON.parse(localStorage.getItem("loggedUser"));
    if (logged?.email) dispatch(fetchUser(logged.email));
  }, [dispatch]);

  /* ------------------ SEARCH FILTER ------------------ */
  const filteredJobs = jobList.filter((job) => {
    const term = searchTerm.toLowerCase();
    return (
      job.jobTitle.toLowerCase().includes(term) ||
      (job.organization || "").toLowerCase().includes(term) ||
      (job.skills || "").toLowerCase().includes(term)
    );
  });

  /* ------------------ PAGINATION ------------------ */
  const indexOfLast = currentPage * jobsPerPage;
  const indexOfFirst = indexOfLast - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  const changePage = (num) => {
    if (num >= 1 && num <= totalPages) setCurrentPage(num);
  };

  /* ------------------ APPLY ------------------ */
  const handleApply = (job) => {
    const logged = JSON.parse(localStorage.getItem("loggedUser"));

    if (!user?.cvLink) {
      alert("Please upload your CV before applying.");
      return navigate("/student-profile");
    }

    const appData = {
      jobId: job._id,
      jobTitle: job.jobTitle,
      organization: job.organization,
      applicantEmail: logged.email,
      applicantName: logged.name,
      cvLink: user.cvLink,
    };

    dispatch(applyForJob(appData))
      .unwrap()
      .then(() => alert("Applied successfully!"))
      .catch(() => alert("You already applied."));
  };

  return (
    <div className="findjob-page">
      <h1 className="findjob-title">
        Find <span className="accent">Job</span>
      </h1>

      {/* SEARCH BAR */}
      <div className="search-container">
        <input
          type="text"
          className="search-box"
          placeholder="Search skills, companies"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
        <button className="search-btn">Search</button>
      </div>

      {/* ------------------ JOB LIST ------------------ */}
      <div className="job-list">
        {currentJobs.map((job) => (
          <div className="job-card" key={job._id}>
            <div className="job-header">
              <h3>{job.jobTitle}</h3>
              <span className="rate">{job.rate} OMR · {job.rateType}</span>
            </div>

            {/* LOCATION + DATE + TIME */}
            <p className="job-location">📍 {job.location}</p>
            <p className="job-date">
              📅 {new Date(job.postedAt).toLocaleDateString()}
              {" — "}
              ⏰ {new Date(job.postedAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>

            {/* BUTTONS RIGHT SIDE */}
            <div className="job-actions-between">
              <button className="btn-details" onClick={() => setSelectedJob(job)}>
                View details
              </button>

              <button className="btn-apply" onClick={() => handleApply(job)}>
                Apply ➜
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ------------------ PAGINATION ------------------ */}
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

      {/* ------------------ MODAL VIEW DETAILS ------------------ */}
      {selectedJob && (
        <div className="modal-overlay">
          <div className="modal-card">
            <button className="close-btn" onClick={() => setSelectedJob(null)}>✖</button>

            <h2 className="modal-title">{selectedJob.jobTitle}</h2>
            <p className="modal-org">{selectedJob.organization}</p>

            <p className="modal-info">📍 {selectedJob.location}</p>

            <p className="modal-info">
              💰 {selectedJob.rate} OMR · {selectedJob.rateType}
            </p>

            <p className="modal-info">
              📅 {new Date(selectedJob.postedAt).toLocaleDateString()} — 
              ⏰ {new Date(selectedJob.postedAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>

            <p className="modal-desc">{selectedJob.description}</p>

            {selectedJob.skills && (
              <div className="skills-box">
                <strong>Skills:</strong> {selectedJob.skills}
              </div>
            )}

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
