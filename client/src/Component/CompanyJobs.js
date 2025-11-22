import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCompanyJobs, deleteJob, updateJob } from "../Features/JobSlice";
import "../Styles/CompanyJobs.css";

const CompanyJobs = () => {
  const dispatch = useDispatch();

  const { company } = useSelector((state) => state.companies);
  const { companyJobs, isLoading } = useSelector((state) => state.jobs);

  const [editingIndex, setEditingIndex] = useState(null);
  const [editedJob, setEditedJob] = useState({});

  useEffect(() => {
    const email =
      company?.email || JSON.parse(localStorage.getItem("loggedUser"))?.email;

    if (email) dispatch(fetchCompanyJobs(email));
  }, [company, dispatch]);

  const handleEdit = (index) => {
    setEditingIndex(index);
    setEditedJob(companyJobs[index]);
  };

  const handleSave = () => {
    dispatch(updateJob(editedJob));
    setEditingIndex(null);
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
        My <span className="accent">Posted Jobs</span>
      </h1>

      {companyJobs.length === 0 ? (
        <p className="no-jobs">No jobs posted yet.</p>
      ) : (
        companyJobs.map((job, index) => (
          <div className="job-card" key={job._id}>
            {editingIndex === index ? (
              <>
                <input
                  value={editedJob.jobTitle}
                  onChange={(e) =>
                    setEditedJob({ ...editedJob, jobTitle: e.target.value })
                  }
                />

                <textarea
                  value={editedJob.description}
                  onChange={(e) =>
                    setEditedJob({
                      ...editedJob,
                      description: e.target.value,
                    })
                  }
                />

                <button onClick={handleSave}>Save</button>
                <button onClick={() => setEditingIndex(null)}>Cancel</button>
              </>
            ) : (
              <>
                <h3>{job.jobTitle}</h3>
                <p>{job.organization}</p>
                <p>{job.description}</p>

                <div className="job-actions">
                  <button onClick={() => handleEdit(index)}>Edit</button>
                  <button onClick={() => handleDelete(job._id)}>Delete</button>

                  <button
                    onClick={() =>
                      (window.location.href = `/applicants-job?jobId=${job._id}`)
                    }
                  >
                    Applicants 👥
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
