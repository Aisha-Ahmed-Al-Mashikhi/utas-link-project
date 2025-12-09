// src/Component/CompanyJobs.js

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCompanyJobs, deleteJob, updateJob } from "../Features/JobSlice";
import "../Styles/CompanyJobs.css";
import { useNavigate } from "react-router-dom";

const CompanyJobs = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { companyJobs, isLoading } = useSelector((state) => state.jobs);

  const [showModal, setShowModal] = useState(false);
  const [editedJob, setEditedJob] = useState({});
  const [viewJob, setViewJob] = useState(null); // NEW: view modal

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 4;

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("loggedUser"));
    if (savedUser?.email) dispatch(fetchCompanyJobs(savedUser.email));
  }, [dispatch]);

  const openEdit = (job) => {
    setEditedJob(job);
    setShowModal(true);
  };

  const saveEdit = () => {
    dispatch(updateJob(editedJob));
    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this job?")) {
      dispatch(deleteJob(id));
    }
  };

  if (isLoading) return <p>Loading...</p>;

  // Pagination Logic
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = companyJobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(companyJobs.length / jobsPerPage);

  return (
    <div className="companyjobs-page">
      <div className="companyjobs-wrapper">
        
        <h1 className="companyjobs-title">
          My <span className="accent">Jobs</span>
        </h1>

        <p className="subtitle">
          Manage your posted opportunities in one place.<br />
          Review details, track applicants, and update your listings easily.
        </p>

        {companyJobs.length === 0 ? (
          <p className="no-jobs">No jobs posted yet.</p>
        ) : (
          <>
            <div className="jobs-grid">

              {currentJobs.map((job) => (
                <div className="job-card" key={job._id}>

                  <h3 className="job-title">{job.jobTitle}</h3>

                  <p className="job-rate">
                    💰 {job.rate} OMR ({job.rateType})
                  </p>

                  <p className="job-time">
                    ⏱ Posted: {new Date(job.postedAt).toLocaleDateString("en-GB")}
                  </p>

                  <p className="job-location">
                    📍 {job.location || "Not specified"}
                  </p>

                  <button
                    className="view-btn"
                    onClick={() => setViewJob(job)}
                  >
                    View Details
                  </button>

                </div>
              ))}

            </div>

            {/* PAGINATION */}
            <div className="pagination">
              <button
                className="page-btn"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Prev
              </button>

              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  className={`page-number ${currentPage === index + 1 ? "active" : ""}`}
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </button>
              ))}

              <button
                className="page-btn"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next
              </button>
            </div>
          </>
        )}

        {/* ====================== VIEW MODAL ====================== */}
        {viewJob && (
          <div className="view-overlay">
            <div className="view-modal">

              <button className="close-view" onClick={() => setViewJob(null)}>
                ✕
              </button>

              <h2 className="view-title">{viewJob.jobTitle}</h2>

              <p><strong>Category:</strong> {viewJob.category}</p>
              <p><strong>Sector:</strong> {viewJob.sector}</p>
              <p><strong>Rate:</strong> {viewJob.rate} OMR ({viewJob.rateType})</p>
              <p><strong>Location:</strong> {viewJob.location}</p>

              <p><strong>Description:</strong></p>
              <p className="desc-box">{viewJob.description}</p>

              <p><strong>Skills:</strong> {viewJob.skills}</p>
              <p><strong>Payout Terms:</strong> {viewJob.payout || "Not specified"}</p>

              <div className="view-actions">
                <button className="edit-btn" onClick={() => openEdit(viewJob)}>Edit</button>
                <button className="delete-btn" onClick={() => handleDelete(viewJob._id)}>Delete</button>
                <button
                  className="applicants-btn"
                  onClick={() => navigate(`/applicants-job?jobId=${viewJob._id}`)}
                >
                  Applicants 👥
                </button>
              </div>

            </div>
          </div>
        )}

        {/* ====================== EDIT MODAL ====================== */}
        {showModal && (
          <div className="edit-overlay">
            <div className="edit-modal">

              <button className="edit-close" onClick={() => setShowModal(false)}>✕</button>

              <h2>Edit Job</h2>

              <label>Job Title</label>
              <input
                value={editedJob.jobTitle}
                onChange={(e) => setEditedJob({ ...editedJob, jobTitle: e.target.value })}
              />

              <label>Category</label>
              <select
                value={editedJob.category}
                onChange={(e) => setEditedJob({ ...editedJob, category: e.target.value })}
              >
                <option value="">Select</option>
                <option>Design / Marketing</option>
                <option>Technology / IT</option>
                <option>Business / Finance</option>
                <option>Education / Training</option>
                <option>Logistics / Operations</option>
                <option>Hospitality / Coffee Shops</option>
                <option>Customer Service</option>
              </select>

              <label>Sector</label>
              <div className="sector-edit-row">

                <label className="sector-edit-box">
                  <input
                    type="radio"
                    value="Private Company"
                    checked={editedJob.sector === "Private Company"}
                    onChange={(e) => setEditedJob({ ...editedJob, sector: e.target.value })}
                  />
                  <span>Private Company</span>
                </label>

                <label className="sector-edit-box">
                  <input
                    type="radio"
                    value="Government"
                    checked={editedJob.sector === "Government"}
                    onChange={(e) => setEditedJob({ ...editedJob, sector: e.target.value })}
                  />
                  <span>Government</span>
                </label>

              </div>

              <label>Rate (OMR)</label>
              <input
                value={editedJob.rate}
                onChange={(e) => setEditedJob({ ...editedJob, rate: e.target.value })}
              />

              <label>Rate Type</label>
              <select
                value={editedJob.rateType}
                onChange={(e) => setEditedJob({ ...editedJob, rateType: e.target.value })}
              >
                <option value="">Select</option>
                <option>Per Hour</option>
                <option>Per Task</option>
                <option>Per Day</option>
              </select>

              <label>Skills Required</label>
              <input
                value={editedJob.skills}
                onChange={(e) => setEditedJob({ ...editedJob, skills: e.target.value })}
              />

              <label>Description</label>
              <textarea
                value={editedJob.description}
                onChange={(e) => setEditedJob({ ...editedJob, description: e.target.value })}
              />

              <label>Payout Terms</label>
              <input
                value={editedJob.payout}
                onChange={(e) => setEditedJob({ ...editedJob, payout: e.target.value })}
              />

              <label>Location</label>
              <input
                value={editedJob.location || ""}
                onChange={(e) => setEditedJob({ ...editedJob, location: e.target.value })}
              />

              <div className="modal-actions">
                <button className="save-btn" onClick={saveEdit}>Save</button>
                <button className="cancel-btn" onClick={() => setShowModal(false)}>Cancel</button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default CompanyJobs;
