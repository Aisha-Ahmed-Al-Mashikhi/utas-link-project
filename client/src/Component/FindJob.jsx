// =====================================================
// FindJob.jsx — Same Page Design, Only Modal Updated
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
    const logged = JSON.parse(localStorage.getItem("loggedUser"));
    if (logged?.email) dispatch(fetchUser(logged.email));
  }, [dispatch]);

  // Filter
  const filteredJobs = jobList.filter((job) => {
    const term = searchTerm.toLowerCase();
    return (
      job.jobTitle.toLowerCase().includes(term) ||
      (job.organization || "").toLowerCase().includes(term) ||
      (job.skills || "").toLowerCase().includes(term)
    );
  });

  // Pagination
  const last = currentPage * jobsPerPage;
  const first = last - jobsPerPage;
  const currentJobs = filteredJobs.slice(first, last);
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  const changePage = (num) => {
    if (num >= 1 && num <= totalPages) setCurrentPage(num);
  };

  // Apply
  const handleApply = (job) => {
    const logged = JSON.parse(localStorage.getItem("loggedUser"));

    if (!user?.cvLink) {
      alert("Please upload your CV first.");
      return navigate("/student-profile");
    }

    const data = {
      jobId: job._id,
      jobTitle: job.jobTitle,
      organization: job.organization,
      applicantEmail: logged.email,
      applicantName: logged.name,
      cvLink: user.cvLink,
    };

    dispatch(applyForJob(data))
      .unwrap()
      .then(() => alert("Applied successfully"))
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
            placeholder="Search skills, companies…"
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

      {/* JOB LIST — SAME DESIGN EXACTLY */}
      <div className="job-list">
        {currentJobs.map((job) => (
          <div className="job-card" key={job._id}>
            <div className="job-header">
              <h3>{job.jobTitle}</h3>
              <span className="rate">{job.rate} OMR · {job.rateType}</span>
            </div>

            <p className="job-location">📍 {job.location}</p>

            <p className="job-date">
              📅 {job.postedAt?.slice(0, 10)} — ⏰ {job.postedAt?.slice(11, 16)}
            </p>

            <div className="job-actions-between">
              <button
                className="btn-details"
                onClick={() => setSelectedJob(job)}
              >
                View details
              </button>

              <button className="btn-apply" onClick={() => handleApply(job)}>
                Apply ➜
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination — SAME */}
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

      {/* ===========================================================
          MODAL — Teaching Assistant DESIGN ONLY HERE
          =========================================================== */}
      {selectedJob && (
        <div className="modal-overlay">
          <div className="modal-card teaching-style">

            {/* Close Button */}
            <button className="close-btn" onClick={() => setSelectedJob(null)}>
              ✖
            </button>

            {/* TITLE */}
            <h2 className="modal-title">{selectedJob.jobTitle}</h2>

            {/* PRICE BOX */}
            <div className="price-box">
              {selectedJob.rate} OMR • {selectedJob.rateType}
            </div>

            {/* LOCATION */}
            <div className="modal-box">
              📍 {selectedJob.location}
            </div>

            {/* DATE */}
            <div className="modal-box">
              📅 {selectedJob.postedAt?.slice(0, 10)}
            </div>

            {/* TAGS */}
            <div className="modal-tags">
              {selectedJob.category && <span className="tag">{selectedJob.category}</span>}
              {selectedJob.sector && <span className="tag">{selectedJob.sector}</span>}
            </div>

            {/* DESCRIPTION */}
            <p className="modal-section-title">Description</p>
            <p className="modal-desc">{selectedJob.description}</p>

            {/* SKILLS */}
            <p className="modal-box"><strong>Skills:</strong> {selectedJob.skills}</p>

            {/* APPLY */}
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
