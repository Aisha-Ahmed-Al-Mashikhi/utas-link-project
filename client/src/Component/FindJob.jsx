// Import React and hooks
import React, { useEffect, useState } from "react";
// Import Redux hooks
import { useSelector, useDispatch } from "react-redux";
// Import navigation hook
import { useNavigate } from "react-router-dom";

// Import job actions
import { fetchJobs, applyForJob } from "../Features/JobSlice";
// Import user action
import { fetchUser } from "../Features/UserSlice";

// Import styles
import "../Styles/FindJob.css";

// Define FindJob component
const FindJob = () => {
  // Initialize dispatch
  const dispatch = useDispatch();
  // Initialize navigation
  const navigate = useNavigate();

  // Get job list from Redux
  const { jobList } = useSelector((state) => state.jobs);
  // Get user from Redux
  const { user } = useSelector((state) => state.users);

  // Store search text
  const [searchTerm, setSearchTerm] = useState("");
  // Store selected job
  const [selectedJob, setSelectedJob] = useState(null);
  // Store current page
  const [currentPage, setCurrentPage] = useState(1);

  // Define jobs per page
  const jobsPerPage = 6;

  // Fetch all jobs
  useEffect(() => {
    // Dispatch fetch jobs
    dispatch(fetchJobs());
  }, [dispatch]);

  // Fetch logged user data
  useEffect(() => {
    // Get logged user from storage
    const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));
    // Dispatch fetch user
    if (loggedUser?.email) dispatch(fetchUser(loggedUser.email));
  }, [dispatch]);

  // Filter jobs by search term
  const filteredJobs = jobList.filter((job) => {
    // Convert search to lowercase
    const term = searchTerm.toLowerCase();
    // Match job fields
    return (
      job.jobTitle.toLowerCase().includes(term) ||
      (job.companyName || "").toLowerCase().includes(term) ||
      (job.skills || "").toString().toLowerCase().includes(term)
    );
  });

  // Calculate last job index
  const indexOfLastJob = currentPage * jobsPerPage;
  // Calculate first job index
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  // Slice jobs for page
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);

  // Calculate total pages
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  // Handle page change
  const changePage = (pageNum) => {
    // Check valid page
    if (pageNum >= 1 && pageNum <= totalPages) setCurrentPage(pageNum);
  };

  // Handle apply action
  const handleApply = async (job) => {
    // Get logged user
    const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));

    // Check CV upload
    if (!user?.cvLink) {
      alert("Please upload your CV before applying.");
      return navigate("/student-profile");
    }

    // Prepare application data
    const appData = {
      jobId: job._id,
      jobTitle: job.jobTitle,
      organization: job.organization || "Unknown Company",
      applicantEmail: loggedUser.email,
      applicantName: loggedUser.name,
      cvLink: user.cvLink,
    };

    // Dispatch apply job
    dispatch(applyForJob(appData))
      .unwrap()
      .then(() => alert("Job applied successfully!"))
      .catch(() => alert("You already applied."));
  };

  // Return JSX
  return (
    // Main page container
    <div className="findjob-page scroll-page">
      {/* Page title */}
      <h1 className="findjob-title">
        {/* Static text */}
        Find {/* Highlighted text */}
        <span className="accent">Job</span>
      </h1>

      {/* Search section */}
      <div className="search-container">
        <div className="search-wrapper">
          {/* Search input */}
          <input
            type="text"
            placeholder="Search skills"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="search-box"
          />
        </div>
        {/* Search button */}
        <button className="search-btn">Search</button>
      </div>

      {/* Jobs list */}
      <div className="job-list">
        {/* Empty state */}
        {currentJobs.length === 0 ? (
          <p>No jobs found.</p>
        ) : (
          currentJobs.map((job) => (
            // Job card
            <div key={job._id} className="job-card">
              {/* Job header */}
              <div className="job-header">
                {/* Job title */}
                <h3>{job.jobTitle}</h3>
                {/* Job rate */}
                <span className="rate">
                  {job.rate} OMR · {job.rateType}
                </span>
              </div>

              {/* Company name */}
              <p className="company-name">
                🏢 Company:{" "}
                {job.organization || job.companyName || "Not provided"}
              </p>

              {/* Job location */}
              <p className="job-location">📍 {job.location}</p>

              {/* Job date */}
              <p className="job-date">
                📅 {job.postedAt?.slice(0, 10)} — ⏰{" "}
                {job.postedAt?.slice(11, 16)}
              </p>

              {/* Job actions */}
              <div className="job-actions">
                {/* View details */}
                <button
                  className="btn-details"
                  onClick={() => setSelectedJob(job)}
                >
                  View details
                </button>

                {/* Apply button */}
                <button className="btn-apply" onClick={() => handleApply(job)}>
                  Apply ➜
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          {/* Previous button */}
          <button
            onClick={() => changePage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            ◀ Prev
          </button>

          {/* Page numbers */}
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              className={currentPage === index + 1 ? "active-page" : ""}
              onClick={() => changePage(index + 1)}
            >
              {index + 1}
            </button>
          ))}

          {/* Next button */}
          <button
            onClick={() => changePage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next ▶
          </button>
        </div>
      )}

      {/* Job details modal */}
      {selectedJob && (
        <div className="modal-overlay">
          <div className="modal-card-ta">
            {/* Close modal */}
            <button
              className="close-btn-ta"
              onClick={() => setSelectedJob(null)}
            >
              ✖
            </button>

            {/* Modal header */}
            <div className="modal-header-ta">
              <h2>{selectedJob.jobTitle}</h2>
              <span className="modal-rate">
                {selectedJob.rate} OMR · {selectedJob.rateType}
              </span>
            </div>

            {/* Company info */}
            <div className="modal-company-block">
              <p>
                <strong>Company:</strong>{" "}
                {selectedJob.organization || "Not provided"}
              </p>
              <p>
                <strong>Email:</strong> {selectedJob.postedBy || "Not provided"}
              </p>
            </div>

            {/* Location and date */}
            <div className="modal-info-row">
              <p>📍 {selectedJob.location}</p>
              <p>📅 {selectedJob.postedAt?.slice(0, 10)}</p>
              <p>⏰ {selectedJob.postedAt?.slice(11, 16)}</p>
            </div>

            {/* Description */}
            <p className="modal-section-title">Description</p>
            <p className="modal-desc-ta">{selectedJob.description}</p>

            {/* Skills title */}
            <p className="modal-section-title">Skills</p>

            {/* Skills list */}
            <div className="skills-row">
              {selectedJob.skills?.split(",").map((skill, i) => (
                <span key={i} className="skill-tag">
                  {skill.trim()}
                </span>
              ))}
            </div>

            {/* Apply button */}
            <button
              className="modal-apply-btn-ta"
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

// Export FindJob component
export default FindJob;
