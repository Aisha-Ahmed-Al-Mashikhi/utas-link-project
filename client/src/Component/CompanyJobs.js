import React, { useEffect, useState } from "react";
import axios from "axios";
import { Row, Col } from "reactstrap";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "../Styles/CompanyJobs.css";

const CompanyJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedJob, setEditedJob] = useState({});
  const navigate = useNavigate();

  // Safe Redux destructuring to prevent undefined errors
  const companyState = useSelector((state) => state.companies || {});
  const company = companyState.company || {};
  console.log("Company in Redux:", company);

  // Fetch jobs posted by the logged-in company
  useEffect(() => {
    const fetchCompanyJobs = async () => {
      try {
        // Get company data from Redux or fallback to localStorage
        let currentCompany = company;
        if (!currentCompany?.companyName) {
          const savedUser = JSON.parse(localStorage.getItem("loggedUser"));
          if (savedUser?.email) {
            currentCompany = savedUser;
          }
        }

        if (!currentCompany?.companyName) {
          console.warn("No company info found.");
          return;
        }

        // Fetch all jobs from the backend
        const res = await axios.get("http://localhost:3001/jobs");

        // Filter jobs that belong to this company only
        const companyJobs = res.data.filter(
          (job) =>
            job.organization?.toLowerCase().trim() ===
            currentCompany.companyName?.toLowerCase().trim()
        );

        setJobs(companyJobs);
      } catch (err) {
        console.error("Error loading company jobs:", err);
      }
    };

    fetchCompanyJobs();
  }, [company]);

  // Delete a job
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      try {
        await axios.delete(`http://localhost:3001/jobs/${id}`);
        setJobs(jobs.filter((j) => j._id !== id));
        alert("Job deleted successfully.");
      } catch {
        alert("Error deleting job.");
      }
    }
  };

  // Enable edit mode
  const handleEdit = (index) => {
    setEditingIndex(index);
    setEditedJob(jobs[index]);
  };

  // Save edited job
  const handleSave = async () => {
    try {
      await axios.put(`http://localhost:3001/jobs/${editedJob._id}`, editedJob);
      const updatedJobs = [...jobs];
      updatedJobs[editingIndex] = editedJob;
      setJobs(updatedJobs);
      setEditingIndex(null);
      alert("Job updated successfully.");
    } catch {
      alert("Failed to update job.");
    }
  };

  // Cancel editing mode
  const handleCancel = () => {
    setEditingIndex(null);
    setEditedJob({});
  };

  // Dropdown option lists
  const SECTORS = [
    "Private Company (Dhofar)",
    "Government / Ministry",
    "Small Business",
    "NGO",
    "Freelance",
  ];
  const CATEGORIES = [
    "Design",
    "Technology",
    "Marketing",
    "Education",
    "Finance",
  ];
  const RATE_TYPES = ["Per Hour", "Per Task", "Per Day"];
  const PAYOUTS = ["End of day", "Weekly", "After completion"];
  const EXPERIENCES = ["0–1", "1–3", "3–5", "5+"];

  return (
    <div className="companyjobs-page">
      <h1 className="companyjobs-title">
        My <span className="accent">Posted Jobs</span>
      </h1>

      {/* No jobs available */}
      {jobs.length === 0 ? (
        <p className="no-jobs">No jobs posted yet.</p>
      ) : (
        jobs.map((job, index) => (
          <div key={job._id} className="job-card">
            {editingIndex === index ? (
              <div className="edit-section">
                <Row>
                  <Col md={6}>
                    <label>Job Title</label>
                    <input
                      type="text"
                      value={editedJob.jobTitle}
                      onChange={(e) =>
                        setEditedJob({ ...editedJob, jobTitle: e.target.value })
                      }
                    />
                  </Col>

                  <Col md={6}>
                    <label>Organization</label>
                    <input
                      type="text"
                      value={editedJob.organization}
                      onChange={(e) =>
                        setEditedJob({
                          ...editedJob,
                          organization: e.target.value,
                        })
                      }
                    />
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <label>Sector</label>
                    <select
                      value={editedJob.sector}
                      onChange={(e) =>
                        setEditedJob({ ...editedJob, sector: e.target.value })
                      }
                    >
                      {SECTORS.map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                  </Col>

                  <Col md={6}>
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

                <Row>
                  <Col md={6}>
                    <label>Experience</label>
                    <select
                      value={editedJob.experience}
                      onChange={(e) =>
                        setEditedJob({
                          ...editedJob,
                          experience: e.target.value,
                        })
                      }
                    >
                      {EXPERIENCES.map((x) => (
                        <option key={x}>{x}</option>
                      ))}
                    </select>
                  </Col>

                  <Col md={6}>
                    <label>Skills</label>
                    <input
                      type="text"
                      value={editedJob.skills}
                      onChange={(e) =>
                        setEditedJob({ ...editedJob, skills: e.target.value })
                      }
                    />
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
