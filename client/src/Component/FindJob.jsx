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
    dispatch(fetchJobs());
  }, [dispatch]);

  // Fetch logged user data
  useEffect(() => {
    const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));
    if (loggedUser?.email) dispatch(fetchUser(loggedUser.email));
  }, [dispatch]);

  //  function to calculate remaining days
  const getRemainingDays = (postedAt, duration) => {
    if (!postedAt) return 0;

    const postDate = new Date(postedAt);
    const expiryDate = new Date(postDate);
    // Use duration from DB or default to 30
    expiryDate.setDate(postDate.getDate() + (Number(duration) || 30));

    const today = new Date();
    const diffTime = expiryDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  };

  // Filter jobs by search term and expiration
  const filteredJobs = jobList.filter((job) => {
    const term = searchTerm.toLowerCase();

    //  Check if job is expired
    const remaining = getRemainingDays(job.postedAt, job.postDuration);
    if (remaining <= 0) return false; // Hide expired jobs from students

    //  Match job fields
    return (
      job.jobTitle.toLowerCase().includes(term) ||
      (job.organization || "").toLowerCase().includes(term) ||
      (job.skills || "").toString().toLowerCase().includes(term)
    );
  });

  // Pagination Logic
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  const changePage = (pageNum) => {
    if (pageNum >= 1 && pageNum <= totalPages) setCurrentPage(pageNum);
  };

  // Handle apply action
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

      {/* Search section */}
      <div className="search-container">
        <div className="search-wrapper">
          <input
            type="text"
            placeholder="Search skills, titles or companies..."
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

      {/* Jobs list */}
      <div className="job-list">
        {currentJobs.length === 0 ? (
          <p className="no-jobs">No active jobs found matching your search.</p>
        ) : (
          currentJobs.map((job) => {
            const remaining = getRemainingDays(job.postedAt, job.postDuration);

            return (
              <div key={job._id} className="job-card">
                <div className="job-header">
                  <h3>{job.jobTitle}</h3>
                  <span className="rate">
                    {job.rate} OMR · {job.rateType}
                  </span>
                </div>

                <p className="company-name">
                  🏢 Company:{" "}
                  {job.organization || job.companyName || "Not provided"}
                </p>

                <p className="job-location">📍 {job.location}</p>

                <p className="job-date">
                  📅 {job.postedAt?.slice(0, 10)} — ⏰{" "}
                  {job.postedAt?.slice(11, 16)}
                </p>

                {/*  Duration with Conditional Color */}
                <p
                  className="job-duration"
                  style={{
                    color: remaining < 3 ? "#e74c3c" : "#2ecc71",
                    fontWeight: "bold",
                    marginTop: "8px",
                  }}
                >
                  ⏳ Expires in: {remaining} {remaining === 1 ? "day" : "days"}
                </p>

                <div className="job-actions">
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
            );
          })
        )}
      </div>

      {/* Pagination */}
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

      {/* Job details modal */}
      {selectedJob && (
        <div className="modal-overlay">
          <div className="modal-card-ta">
            <button
              className="close-btn-ta"
              onClick={() => setSelectedJob(null)}
            >
              ✖
            </button>

            <div className="modal-header-ta">
              <h2>{selectedJob.jobTitle}</h2>
              <span className="modal-rate">
                {selectedJob.rate} OMR · {selectedJob.rateType}
              </span>
            </div>

            <div className="modal-company-block">
              <p>
                <strong>Company:</strong>{" "}
                {selectedJob.organization || "Not provided"}
              </p>
              <p>
                <strong>Email:</strong> {selectedJob.postedBy || "Not provided"}
              </p>
              <p>
                <strong>Sector:</strong> {selectedJob.sector || "Not specified"}
              </p>
            </div>

            <div className="modal-info-row">
              <p>📍 {selectedJob.location}</p>
              <p>📅 {selectedJob.postedAt?.slice(0, 10)}</p>
              <p style={{ color: "#e67e22", fontWeight: "bold" }}>
                ⏳{" "}
                {getRemainingDays(
                  selectedJob.postedAt,
                  selectedJob.postDuration
                )}{" "}
                days left
              </p>
            </div>

            <p className="modal-section-title">Description</p>
            <p className="modal-desc-ta">{selectedJob.description}</p>

            <p className="modal-section-title">Skills Required</p>
            <div className="skills-row">
              {selectedJob.skills?.split(",").map((skill, i) => (
                <span key={i} className="skill-tag">
                  {skill.trim()}
                </span>
              ))}
            </div>

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

export default FindJob;
