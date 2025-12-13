// Import React and hooks
import React, { useEffect, useState } from "react";
// Import Redux hooks
import { useDispatch, useSelector } from "react-redux";
// Import job actions
import { fetchCompanyJobs, deleteJob, updateJob } from "../Features/JobSlice";
// Import styles
import "../Styles/CompanyJobs.css";
// Import navigation hook
import { useNavigate } from "react-router-dom";

// Define CompanyJobs component
const CompanyJobs = () => {
  // Initialize dispatch
  const dispatch = useDispatch();
  // Initialize navigation
  const navigate = useNavigate();

  // Get company jobs and loading state
  const { companyJobs, isLoading } = useSelector((state) => state.jobs);

  // Track current page
  const [currentPage, setCurrentPage] = useState(1);
  // Track selected job
  const [viewJob, setViewJob] = useState(null);
  // Track edit modal state
  const [showModal, setShowModal] = useState(false);
  // Store edited job data
  const [editedJob, setEditedJob] = useState({});

  // Set jobs per page
  const jobsPerPage = 6;

  // Fetch company jobs on load
  useEffect(() => {
    // Get saved user
    const savedUser = JSON.parse(localStorage.getItem("loggedUser"));
    // Dispatch fetch jobs
    if (savedUser?.email) dispatch(fetchCompanyJobs(savedUser.email));
  }, [dispatch]);

  // Calculate last job index
  const indexLast = currentPage * jobsPerPage;
  // Calculate first job index
  const indexFirst = indexLast - jobsPerPage;
  // Slice jobs for current page
  const currentJobs = companyJobs.slice(indexFirst, indexLast);
  // Calculate total pages
  const totalPages = Math.ceil(companyJobs.length / jobsPerPage);

  // Open edit modal
  const openEdit = (job) => {
    // Set job to edit
    setEditedJob(job);
    // Show modal
    setShowModal(true);
  };

  // Save edited job
  const saveEdit = () => {
    // Dispatch update job
    dispatch(updateJob(editedJob));
    // Close modal
    setShowModal(false);
  };

  // Handle job deletion
  const handleDelete = async (id) => {
    // Confirm deletion
    if (!window.confirm("Delete this job?")) return;

    // Dispatch delete job
    await dispatch(deleteJob(id)).unwrap();

    // Close view modal
    setViewJob(null);
    // Close edit modal
    setShowModal(false);
  };

  // Return JSX
  return (
    // Main page container
    <div className="companyjobs-page">
      {/* Wrapper container */}
      <div className="companyjobs-wrapper">
        {/* Page title */}
        <h1 className="companyjobs-title">
          {/* Static text */}
          My {/* Highlighted text */}
          <span className="accent">Jobs</span>
        </h1>

        {/* Page subtitle */}
        <p className="subtitle">
          {/* Subtitle line */}
          Manage your posted opportunities effortlessly.
          <br />
          {/* Subtitle line */}
          Keep track of applicants and job details in one place.
        </p>

        {/* Jobs grid */}
        <div className="jobs-grid">
          {/* Loop through jobs */}
          {currentJobs.map((job) => (
            // Job card
            <div className="job-card" key={job._id}>
              {/* Job title */}
              <h3>{job.jobTitle}</h3>

              {/* Job location */}
              <p className="job-location">📍 {job.location}</p>

              {/* Tags row */}
              <div className="tag-row">
                {/* Category tag */}
                <span className="tag">{job.category}</span>
                {/* Sector tag */}
                <span className="tag">{job.sector}</span>
              </div>

              {/* Job rate */}
              <p className="price">
                {job.rate} OMR • {job.rateType}
              </p>

              {/* Posted time */}
              <p className="post-time">
                Posted: {new Date(job.createdAt).toLocaleString()}
              </p>

              {/* View button */}
              <button className="view-btn" onClick={() => setViewJob(job)}>
                View
              </button>
            </div>
          ))}
        </div>

        {/* Pagination container */}
        <div className="pagination-container">
          {/* Previous button */}
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Prev
          </button>

          {/* Page numbers */}
          {[...Array(totalPages)].map((_, i) => (
            <button
              // Page key
              key={i}
              // Active page style
              className={currentPage === i + 1 ? "active" : ""}
              // Change page
              onClick={() => setCurrentPage(i + 1)}
            >
              {/* Page number */}
              {i + 1}
            </button>
          ))}

          {/* Next button */}
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next
          </button>
        </div>

        {/* View job modal */}
        {viewJob && (
          <div className="overlay">
            <div className="view-modal">
              {/* Close modal button */}
              <button className="close-btn" onClick={() => setViewJob(null)}>
                ✕
              </button>

              {/* Job title */}
              <h2>{viewJob.jobTitle}</h2>

              {/* Job details */}
              <p>
                <strong>Location:</strong> {viewJob.location}
              </p>
              <p>
                <strong>Sector:</strong> {viewJob.sector}
              </p>
              <p>
                <strong>Category:</strong> {viewJob.category}
              </p>
              <p>
                <strong>Rate:</strong> {viewJob.rate} OMR • {viewJob.rateType}
              </p>
              <p>
                <strong>Skills:</strong> {viewJob.skills}
              </p>
              <p>
                <strong>Description:</strong> {viewJob.description}
              </p>

              {/* Posted time */}
              <p>
                <strong>Posted:</strong>{" "}
                {new Date(viewJob.createdAt).toLocaleString()}
              </p>

              {/* Modal actions */}
              <div className="modal-actions">
                {/* Edit button */}
                <button
                  className="edit-btn"
                  onClick={() => {
                    openEdit(viewJob);
                    setViewJob(null);
                  }}
                >
                  Edit
                </button>

                {/* Applicants button */}
                <button
                  className="applicants-btn"
                  onClick={() => navigate(`/applicants-job/${viewJob._id}`)}
                >
                  Applicants
                </button>

                {/* Delete button */}
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(viewJob._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit job modal */}
        {showModal && (
          <div className="overlay">
            <div className="edit-modal">
              {/* Close edit modal */}
              <button className="close-btn" onClick={() => setShowModal(false)}>
                ✕
              </button>

              {/* Modal title */}
              <h2>Edit Job</h2>

              {/* Job title input */}
              <label>Job Title</label>
              <input
                value={editedJob.jobTitle}
                onChange={(e) =>
                  setEditedJob({ ...editedJob, jobTitle: e.target.value })
                }
              />

              {/* Category input */}
              <label>Category</label>
              <input
                value={editedJob.category}
                onChange={(e) =>
                  setEditedJob({ ...editedJob, category: e.target.value })
                }
              />

              {/* Sector selection */}
              <label>Sector</label>
              <div className="sector-row">
                <label className="radio-option">
                  <input
                    type="radio"
                    value="Private"
                    checked={editedJob.sector === "Private"}
                    onChange={(e) =>
                      setEditedJob({ ...editedJob, sector: e.target.value })
                    }
                  />
                  Private
                </label>

                <label className="radio-option">
                  <input
                    type="radio"
                    value="Government"
                    checked={editedJob.sector === "Government"}
                    onChange={(e) =>
                      setEditedJob({ ...editedJob, sector: e.target.value })
                    }
                  />
                  Government
                </label>
              </div>

              {/* Rate input */}
              <label>Rate</label>
              <input
                value={editedJob.rate}
                onChange={(e) =>
                  setEditedJob({ ...editedJob, rate: e.target.value })
                }
              />

              {/* Rate type input */}
              <label>Rate Type</label>
              <input
                value={editedJob.rateType}
                onChange={(e) =>
                  setEditedJob({ ...editedJob, rateType: e.target.value })
                }
              />

              {/* Skills input */}
              <label>Skills</label>
              <input
                value={editedJob.skills}
                onChange={(e) =>
                  setEditedJob({ ...editedJob, skills: e.target.value })
                }
              />

              {/* Description input */}
              <label>Description</label>
              <textarea
                value={editedJob.description}
                onChange={(e) =>
                  setEditedJob({ ...editedJob, description: e.target.value })
                }
              />

              {/* Location input */}
              <label>Location</label>
              <input readOnly value={editedJob.location || ""} />

              {/* Modal buttons */}
              <div className="modal-actions">
                <button
                  className="cancel-btn"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button className="save-btn" onClick={saveEdit}>
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Export component
export default CompanyJobs;
