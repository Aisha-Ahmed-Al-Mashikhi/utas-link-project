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

  // ========================= PAGINATION =========================
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 6;

  const totalPages = Math.ceil(companyJobs.length / jobsPerPage);

  const indexOfLast = currentPage * jobsPerPage;
  const indexOfFirst = indexOfLast - jobsPerPage;
  const currentJobs = companyJobs.slice(indexOfFirst, indexOfLast);

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // ===============================================================

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

  return (
    <div className="companyjobs-page">
      <h1 className="companyjobs-title">
        My <span className="accent">Jobs</span>
      </h1>

      {companyJobs.length === 0 ? (
        <p className="no-jobs">No jobs posted yet.</p>
      ) : (
        <>
          <div className="jobs-grid">
            {currentJobs.map((job) => (
              <div className="job-card" key={job._id}>
                <h3>{job.jobTitle}</h3>

                <p className="job-location">
                  📍 {job.location || "Not specified"}
                </p>

                <p className="postedAt">
                  📅 Posted:{" "}
                  {new Date(job.postedAt).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </p>

                <div className="tags">
                  <span className="tag">{job.category}</span>
                  <span className="tag">{job.sector}</span>
                </div>

                <p className="desc">{job.description}</p>

                <p className="skills">
                  <strong>Skills:</strong> {job.skills}
                </p>

                <p className="payout">
                  <strong>Payout Terms:</strong> {job.payout || "Not specified"}
                </p>

                <div className="job-actions">
                  <button className="edit-btn" onClick={() => openEdit(job)}>
                    Edit
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(job._id)}
                  >
                    Delete
                  </button>

                  <button
                    className="applicants-btn"
                    onClick={() =>
                      navigate(`/applicants-job?jobId=${job._id}`)
                    }
                  >
                    Applicants 👥
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* ====================== PAGINATION ====================== */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="page-btn"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                ← Previous
              </button>

              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  className={`page-number ${
                    currentPage === i + 1 ? "active" : ""
                  }`}
                  onClick={() => goToPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}

              <button
                className="page-btn"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}

      {/* ============== EDIT MODAL ============== */}
      {showModal && (
        <div className="edit-overlay">
          <div className="edit-modal">
            <button className="edit-close" onClick={() => setShowModal(false)}>
              ✕
            </button>

            <h2>Edit Job</h2>

            <label>Job Title</label>
            <input
              value={editedJob.jobTitle}
              onChange={(e) =>
                setEditedJob({ ...editedJob, jobTitle: e.target.value })
              }
            />

            <label>Category</label>
            <select
              value={editedJob.category}
              onChange={(e) =>
                setEditedJob({ ...editedJob, category: e.target.value })
              }
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
                  onChange={(e) =>
                    setEditedJob({ ...editedJob, sector: e.target.value })
                  }
                />
                <span>Private Company</span>
              </label>

              <label className="sector-edit-box">
                <input
                  type="radio"
                  value="Government"
                  checked={editedJob.sector === "Government"}
                  onChange={(e) =>
                    setEditedJob({ ...editedJob, sector: e.target.value })
                  }
                />
                <span>Government</span>
              </label>
            </div>

            <label>Rate (OMR)</label>
            <input
              value={editedJob.rate}
              onChange={(e) =>
                setEditedJob({ ...editedJob, rate: e.target.value })
              }
            />

            <label>Rate Type</label>
            <select
              value={editedJob.rateType}
              onChange={(e) =>
                setEditedJob({ ...editedJob, rateType: e.target.value })
              }
            >
              <option value="">Select</option>
              <option>Per Hour</option>
              <option>Per Task</option>
              <option>Per Day</option>
            </select>

            <label>Skills Required</label>
            <input
              value={editedJob.skills}
              onChange={(e) =>
                setEditedJob({ ...editedJob, skills: e.target.value })
              }
            />

            <label>Description</label>
            <textarea
              value={editedJob.description}
              onChange={(e) =>
                setEditedJob({ ...editedJob, description: e.target.value })
              }
            />

            <label>Payout Terms</label>
            <input
              value={editedJob.payout}
              onChange={(e) =>
                setEditedJob({ ...editedJob, payout: e.target.value })
              }
            />

            <label>Location</label>
            <input
              value={editedJob.location || ""}
              onChange={(e) =>
                setEditedJob({ ...editedJob, location: e.target.value })
              }
            />

            <div className="modal-actions">
              <button className="save-btn" onClick={saveEdit}>
                Save
              </button>
              <button
                className="cancel-btn"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyJobs;
