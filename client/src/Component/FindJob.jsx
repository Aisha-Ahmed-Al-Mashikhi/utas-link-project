// =====================================================
// FindJob.jsx (Final Version with Details Modal + Pagination)
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

  // 🔥 Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 4; // <<=== كل صفحة 4 وظائف

  useEffect(() => {
    dispatch(fetchJobs());
  }, [dispatch]);

  useEffect(() => {
    const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));
    if (loggedUser?.email) dispatch(fetchUser(loggedUser.email));
  }, [dispatch]);

  // FILTER
  const filteredJobs = jobList.filter((job) => {
    const term = searchTerm.toLowerCase();
    return (
      job.jobTitle.toLowerCase().includes(term) ||
      (job.organization || "").toLowerCase().includes(term) ||
      (job.skills || "").toString().toLowerCase().includes(term)
    );
  });

  // 🔥 PAGINATION LOGIC
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);

  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  const changePage = (pageNum) => {
    if (pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
    }
  };

  // APPLY
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
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // يرجع للصفحة 1 إذا المستخدم عمل بحث
            }}
            className="search-box"
          />
        </div>
        <button className="search-btn">Search</button>
      </div>

      {/* JOB LIST */}
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

              <p className="job-location">📍 {job.location || "Not specified"}</p>

              <div className="job-actions-between">
                <button
                  className="btn-details"
                  onClick={() => setSelectedJob(job)}
                >
                  View details
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

      {/* 🔥 PAGINATION */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => changePage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            ◀ Prev
          </button>

          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              className={currentPage === index + 1 ? "active-page" : ""}
              onClick={() => changePage(index + 1)}
            >
              {index + 1}
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

      {/* 🔥 Modal */}
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
