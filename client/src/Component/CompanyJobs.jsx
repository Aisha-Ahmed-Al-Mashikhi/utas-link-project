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
  const [viewJob, setViewJob] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 6;

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("loggedUser"));
    if (savedUser?.email) dispatch(fetchCompanyJobs(savedUser.email));
  }, [dispatch]);

  const openEdit = (job) => {
    setEditedJob(job);
    setShowModal(true);
  };

  const openView = (job) => {
    setViewJob(job);
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

  // Pagination
  const indexOfLast = currentPage * jobsPerPage;
  const indexOfFirst = indexOfLast - jobsPerPage;
  const currentJobs = companyJobs.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(companyJobs.length / jobsPerPage);

  return (
    <div className="companyjobs-page">
      <div className="companyjobs-wrapper">

        <h1 className="companyjobs-title">My <span className="accent">Jobs</span></h1>
        <p className="subtitle">
          Manage your posted opportunities effortlessly.<br />
          Keep track of applicants and job details in one place.
        </p>

        {companyJobs.length === 0 ? (
          <p className="no-jobs">No jobs posted yet.</p>
        ) : (
          <>
            {/* JOB CARDS */}
            <div className="jobs-grid">
              {currentJobs.map((job) => (
                <div className="job-card" key={job._id}>
                  
                  <h3>{job.jobTitle}</h3>

                  <p className="job-location">📍 {job.location || "Not specified"}</p>

                  <div className="tag-row">
                    <span className="tag">{job.category}</span>
                    <span className="tag">{job.sector}</span>
                  </div>

                  <p className="price">{job.rate} OMR • {job.rateType}</p>

                  <div className="job-actions">
                    <button className="view-btn" onClick={() => openView(job)}>View</button>
                  </div>

                </div>
              ))}
            </div>

            {/* PAGINATION */}
            <div className="pagination-container">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Prev
              </button>

              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  className={currentPage === i + 1 ? "active" : ""}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next
              </button>
            </div>
          </>
        )}

        {/* VIEW MODAL */}
        {viewJob && (
          <div className="overlay">
            <div className="view-modal">

              <button className="close-btn" onClick={() => setViewJob(null)}>✕</button>

              <h2>{viewJob.jobTitle}</h2>

              <p><strong>Location:</strong> {viewJob.location}</p>
              <p><strong>Sector:</strong> {viewJob.sector}</p>
              <p><strong>Category:</strong> {viewJob.category}</p>
              <p><strong>Rate:</strong> {viewJob.rate} OMR / {viewJob.rateType}</p>
              <p><strong>Skills:</strong> {viewJob.skills}</p>
              <p><strong>Description:</strong> {viewJob.description}</p>
              <p><strong>Payout Terms:</strong> {viewJob.payout}</p>

              <div className="modal-actions">
                <button className="edit-btn" onClick={() => { openEdit(viewJob); setViewJob(null); }}>Edit</button>
                <button className="delete-btn" onClick={() => handleDelete(viewJob._id)}>Delete</button>
              </div>

            </div>
          </div>
        )}

        {/* EDIT MODAL */}
        {showModal && (
          <div className="overlay">
            <div className="edit-modal">

              <button className="close-btn" onClick={() => setShowModal(false)}>✕</button>

              <h2>Edit Job</h2>

              <label>Job Title</label>
              <input value={editedJob.jobTitle} onChange={(e) => setEditedJob({ ...editedJob, jobTitle: e.target.value })} />

              <label>Category</label>
              <input value={editedJob.category} onChange={(e) => setEditedJob({ ...editedJob, category: e.target.value })} />

              <label>Sector</label>
              <div className="sector-row">
                <label className="radio-option">
                  <input
                    type="radio"
                    value="Private Company"
                    checked={editedJob.sector === "Private Company"}
                    onChange={(e) => setEditedJob({ ...editedJob, sector: e.target.value })}
                  />
                  Private Company
                </label>

                <label className="radio-option">
                  <input
                    type="radio"
                    value="Government"
                    checked={editedJob.sector === "Government"}
                    onChange={(e) => setEditedJob({ ...editedJob, sector: e.target.value })}
                  />
                  Government
                </label>
              </div>

              <label>Rate</label>
              <input value={editedJob.rate} onChange={(e) => setEditedJob({ ...editedJob, rate: e.target.value })} />

              <label>Rate Type</label>
              <input value={editedJob.rateType} onChange={(e) => setEditedJob({ ...editedJob, rateType: e.target.value })} />

              <label>Skills</label>
              <input value={editedJob.skills} onChange={(e) => setEditedJob({ ...editedJob, skills: e.target.value })} />

              <label>Description</label>
              <textarea value={editedJob.description} onChange={(e) => setEditedJob({ ...editedJob, description: e.target.value })} />

              <label>Payout Terms</label>
              <input value={editedJob.payout} onChange={(e) => setEditedJob({ ...editedJob, payout: e.target.value })} />

              <label>Location</label>
              <input value={editedJob.location} onChange={(e) => setEditedJob({ ...editedJob, location: e.target.value })} />

              <div className="modal-actions">
                <button className="save-btn" onClick={saveEdit}>Save</button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default CompanyJobs;
