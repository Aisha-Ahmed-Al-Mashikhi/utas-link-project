import React, { useEffect, useState } from "react";
import { Row, Col } from "reactstrap";
import "../Styles/CompanyJobs.css";

const CompanyJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedJob, setEditedJob] = useState({});

  // Load jobs from localStorage
  useEffect(() => {
    const storedJobs = JSON.parse(localStorage.getItem("jobs")) || [];
    setJobs(storedJobs);
  }, []);

  // Delete job
  const handleDelete = (index) => {
    const updatedJobs = jobs.filter((_, i) => i !== index);
    setJobs(updatedJobs);
    localStorage.setItem("jobs", JSON.stringify(updatedJobs));
  };

  // Start editing
  const handleEdit = (index) => {
    setEditingIndex(index);
    setEditedJob(jobs[index]);
  };

  // Save edited job
  const handleSave = () => {
    const updatedJobs = [...jobs];
    updatedJobs[editingIndex] = editedJob;
    setJobs(updatedJobs);
    localStorage.setItem("jobs", JSON.stringify(updatedJobs));
    setEditingIndex(null);
    alert("✅ Job updated successfully! Changes are reflected in Find Job.");
  };

  // Cancel editing
  const handleCancel = () => {
    setEditingIndex(null);
    setEditedJob({});
  };

  // Dropdown data
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

      {jobs.length === 0 ? (
        <p className="no-jobs">No jobs posted yet.</p>
      ) : (
        jobs.map((job, index) => (
          <div key={index} className="job-card">
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
                    ✏️ Edit
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(index)}
                  >
                    🗑 Delete
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
