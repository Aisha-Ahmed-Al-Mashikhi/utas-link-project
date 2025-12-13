// src/Components/CompanyJobs.js

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCompanyJobs, deleteJob, updateJob } from "../Features/JobSlice";
import "../Styles/CompanyJobs.css";
import { useNavigate } from "react-router-dom";

const CompanyJobs = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { companyJobs, isLoading } = useSelector((state) => state.jobs);

  const [currentPage, setCurrentPage] = useState(1);
  const [viewJob, setViewJob] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editedJob, setEditedJob] = useState({});

  const jobsPerPage = 6;

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("loggedUser"));
    if (savedUser?.email) dispatch(fetchCompanyJobs(savedUser.email));
  }, [dispatch]);

  const indexLast = currentPage * jobsPerPage;
  const indexFirst = indexLast - jobsPerPage;
  const currentJobs = companyJobs.slice(indexFirst, indexLast);
  const totalPages = Math.ceil(companyJobs.length / jobsPerPage);

  const openEdit = (job) => {
    setEditedJob(job);
    setShowModal(true);
  };

  const saveEdit = () => {
    dispatch(updateJob(editedJob));
    setShowModal(false);
  };

 const handleDelete = async (id) => {
  if (!window.confirm("Delete this job?")) return;

  await dispatch(deleteJob(id)).unwrap();

  setViewJob(null);      // ✅ سكري المودال
  setShowModal(false);  // ✅ احتياط
};


  return (
    <div className="companyjobs-page">
      <div className="companyjobs-wrapper">

        <h1 className="companyjobs-title">My <span className="accent">Jobs</span></h1>
        <p className="subtitle">
          Manage your posted opportunities effortlessly.
          <br />Keep track of applicants and job details in one place.
        </p>

        {/* JOB CARDS */}
        <div className="jobs-grid">
          {currentJobs.map((job) => (
            <div className="job-card" key={job._id}>
              <h3>{job.jobTitle}</h3>
                {/* ✅ COMPANY NAME */}
      <p className="company-name">
        🏢 Company: {job.organization}
      </p>
              <p className="job-location">📍 {job.location}</p>

              <div className="tag-row">
                <span className="tag">{job.category}</span>
                <span className="tag">{job.sector}</span>
              </div>

              <p className="price">{job.rate} OMR • {job.rateType}</p>

              {/* POSTED TIME */}
              <p className="post-time">
                Posted: {new Date(job.createdAt).toLocaleString()}
              </p>

              <button className="view-btn" onClick={() => setViewJob(job)}>
                View
              </button>
            </div>
          ))}
        </div>

        {/* PAGINATION */}
        <div className="pagination-container">
          <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>Prev</button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              className={currentPage === i + 1 ? "active" : ""}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}

          <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
        </div>

        {/* VIEW MODAL */}
        {viewJob && (
          <div className="overlay">
            <div className="view-modal">
              <button className="close-btn" onClick={() => setViewJob(null)}>✕</button>

              <h2>{viewJob.jobTitle}</h2>

              <p><strong>Location:</strong> {viewJob.location}</p>
              <p><strong>Sector:</strong> {viewJob.sector}</p>
              <p><strong>Category:</strong> {viewJob.category}</p>
              <p><strong>Rate:</strong> {viewJob.rate} OMR • {viewJob.rateType}</p>
              <p><strong>Skills:</strong> {viewJob.skills}</p>
              <p><strong>Description:</strong> {viewJob.description}</p>

              {/* POSTED TIME */}
              <p><strong>Posted:</strong> {new Date(viewJob.createdAt).toLocaleString()}</p>

              <div className="modal-actions">
                <button className="edit-btn" onClick={() => { openEdit(viewJob); setViewJob(null); }}>
                  Edit
                </button>

                {/* NEW — VIEW APPLICANTS */}
                <button
                  className="applicants-btn"
                    onClick={() => navigate(`/applicants-job/${viewJob._id}`)}
                >
                  Applicants
                </button>

                <button className="delete-btn" onClick={() => handleDelete(viewJob._id)}>
                  Delete
                </button>
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
                  <input type="radio" value="Private"
                    checked={editedJob.sector === "Private"}
                    onChange={(e) => setEditedJob({ ...editedJob, sector: e.target.value })} />
                  Private
                </label>

                <label className="radio-option">
                  <input type="radio" value="Government"
                    checked={editedJob.sector === "Government"}
                    onChange={(e) => setEditedJob({ ...editedJob, sector: e.target.value })} />
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

              <label>Location</label>
              <input readOnly value={editedJob.location || ""} />

              <div className="modal-actions">
                <button className="cancel-btn" onClick={() => setShowModal(false)}>Cancel</button>
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
