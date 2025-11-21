import React, { useEffect, useState } from "react";
import axios from "axios";
import "../Styles/CompanyJobs.css";
import { Row, Col } from "reactstrap";
import { useSelector } from "react-redux";

const CompanyJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedJob, setEditedJob] = useState({});

  const companyState = useSelector((state) => state.companies || {});
  const company = companyState.company || {};

  useEffect(() => {
    const fetchCompanyJobs = async () => {
      try {
        let currentCompany = company;
        if (!currentCompany?.companyName) {
          const savedUser = JSON.parse(localStorage.getItem("loggedUser"));
          if (savedUser?.email) currentCompany = savedUser;
        }

        if (!currentCompany?.companyName) return;

        const res = await axios.get("http://localhost:3001/jobs");

        const companyJobs = res.data.filter(
          (job) =>
            job.organization?.toLowerCase().trim() ===
            currentCompany.companyName?.toLowerCase().trim()
        );

        setJobs(companyJobs);
      } catch (err) {
        console.error("Error loading jobs:", err);
      }
    };

    fetchCompanyJobs();
  }, [company]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      try {
        await axios.delete(`http://localhost:3001/jobs/${id}`);
        setJobs(jobs.filter((j) => j._id !== id));
        alert("Job deleted successfully.");
      } catch {
        alert("Failed to delete.");
      }
    }
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    setEditedJob(jobs[index]);
  };

  const handleSave = async () => {
    try {
      await axios.put(`http://localhost:3001/jobs/${editedJob._id}`, editedJob);
      const updated = [...jobs];
      updated[editingIndex] = editedJob;
      setJobs(updated);
      setEditingIndex(null);
      alert("Job updated successfully.");
    } catch {
      alert("Failed to update job.");
    }
  };

  const handleCancel = () => {
    setEditingIndex(null);
    setEditedJob({});
  };

  const SECTORS = ["Private Company", "Government"];

  const CATEGORIES = [
    "Design / Marketing",
    "Technology / IT",
    "Business / Finance",
    "Education / Training",
    "Logistics / Operations",
  ];

  const RATE_TYPES = ["Per Hour", "Per Task", "Per Day"];
  const PAYOUTS = ["End of day", "Weekly", "After completion"];

  return (
    <div className="companyjobs-page">
      <h1 className="companyjobs-title">
        My <span className="accent">Posted Jobs</span>
      </h1>

      {jobs.length === 0 ? (
        <p className="no-jobs">No jobs posted yet.</p>
      ) : (
        jobs.map((job, index) => (
          <div key={job._id} className="job-card">
            {editingIndex === index ? (
              <div className="edit-section">
                <label>Organization</label>
                <input
                  type="text"
                  value={editedJob.organization}
                  readOnly
                  className="readonly-field"
                />

                <Row>
                  <Col md={12}>
                    <label>Job Title</label>
                    <input
                      type="text"
                      value={editedJob.jobTitle}
                      onChange={(e) =>
                        setEditedJob({ ...editedJob, jobTitle: e.target.value })
                      }
                    />
                  </Col>
                </Row>

                <Row>
                  <Col md={12}>
                    <label>Category</label>
                    <select
                      value={editedJob.category}
                      onChange={(e) =>
                        setEditedJob({ ...editedJob, category: e.target.value })
                      }
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                  </Col>
                </Row>

                <label>Sector</label>
                <div className="sector-row">
                  {SECTORS.map((s) => (
                    <label key={s} className="sector-box">
                      <input
                        type="radio"
                        value={s}
                        checked={editedJob.sector === s}
                        onChange={(e) =>
                          setEditedJob({ ...editedJob, sector: e.target.value })
                        }
                      />
                      <span>{s}</span>
                    </label>
                  ))}
                </div>

                <Row>
                  <Col md={4}>
                    <label>Rate (OMR)</label>
                    <input
                      type="number"
                      value={editedJob.rate}
                      onChange={(e) =>
                        setEditedJob({ ...editedJob, rate: e.target.value })
                      }
                    />
                  </Col>

                  <Col md={4}>
                    <label>Rate Type</label>
                    <select
                      value={editedJob.rateType}
                      onChange={(e) =>
                        setEditedJob({ ...editedJob, rateType: e.target.value })
                      }
                    >
                      {RATE_TYPES.map((r) => (
                        <option key={r}>{r}</option>
                      ))}
                    </select>
                  </Col>

                  <Col md={4}>
                    <label>Payout</label>
                    <select
                      value={editedJob.payout}
                      onChange={(e) =>
                        setEditedJob({ ...editedJob, payout: e.target.value })
                      }
                    >
                      {PAYOUTS.map((p) => (
                        <option key={p}>{p}</option>
                      ))}
                    </select>
                  </Col>
                </Row>

                <label>Description</label>
                <textarea
                  value={editedJob.description}
                  onChange={(e) =>
                    setEditedJob({ ...editedJob, description: e.target.value })
                  }
                />

                <div className="edit-buttons">
                  <button className="btn-save" onClick={handleSave}>
                    Save
                  </button>
                  <button className="btn-cancel" onClick={handleCancel}>
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="job-header">
                  <h3>{job.jobTitle}</h3>
                  <span className="rate">
                    {job.rate} OMR · {job.rateType}
                  </span>
                </div>

                <p className="org-name">{job.organization}</p>
                <p className="desc">{job.description}</p>
                <p className="skills">Skills: {job.skills}</p>

                <div className="job-actions">
                  <button
                    className="btn-edit"
                    onClick={() => handleEdit(index)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(job._id)}
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default CompanyJobs;
