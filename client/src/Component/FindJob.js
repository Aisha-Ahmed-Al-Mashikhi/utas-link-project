import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchJobs } from "../Features/JobSlice";
import "../Styles/FindJob.css";

const FindJob = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { jobs, isLoading } = useSelector((state) => state.jobs);
  const [searchTerm, setSearchTerm] = useState("");
  const [userCvLink, setUserCvLink] = useState(null);

  // Protect route: redirect if not logged in
  useEffect(() => {
    const role = localStorage.getItem("role");
    if (!role) navigate("/login");
  }, [navigate]);

  // Fetch all jobs
  useEffect(() => {
    dispatch(fetchJobs());
  }, [dispatch]);

  // Fetch logged-in user to check if CV is uploaded
  useEffect(() => {
    const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));
    if (loggedUser?.email) {
      axios
        .get(`http://localhost:3001/user/${loggedUser.email}`)
        .then((res) => setUserCvLink(res.data.cvLink || null))
        .catch((err) => console.error("Error fetching user CV:", err));
    }
  }, []);

  // Filter jobs based on search input
  const filteredJobs = jobs.filter(
    (job) =>
      job.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.skills.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Apply for job (requires uploaded CV)
  const handleApply = async (job) => {
    try {
      const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));
      if (!loggedUser) {
        alert("Please log in first!");
        navigate("/login");
        return;
      }

      // Check if the user uploaded a CV
      if (!userCvLink) {
        alert("Please upload your CV before applying for any job.");
        navigate("/userprofile");
        return;
      }

      const applicationData = {
        jobId: job._id,
        jobTitle: job.jobTitle,
        organization: job.organization,
        applicantEmail: loggedUser.email,
        applicantName: loggedUser.name,
        cvLink: userCvLink,
      };

      await axios.post("http://localhost:3001/apply", applicationData);
      alert("Job applied successfully!");
    } catch (err) {
      alert("Error occurred or you have already applied.");
    }
  };

  if (isLoading) return <p>Loading jobs...</p>;

  return (
    <div className="findjob-page">
      <h1 className="findjob-title">
        Find <span className="accent">Job</span>
      </h1>

      <div className="search-container">
        <div className="search-wrapper">
          <input
            type="text"
            placeholder="Search skills, companies"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-box"
          />
        </div>
        <button className="search-btn">Search</button>
      </div>

      <div className="job-list">
        {filteredJobs.length === 0 ? (
          <p className="no-jobs">No jobs found.</p>
        ) : (
          filteredJobs.map((job, index) => (
            <div key={index} className="job-card">
              <div className="job-header">
                <h3>{job.jobTitle}</h3>
                <span className="rate">
                  {job.rate} OMR · {job.rateType}
                </span>
              </div>

              <p className="org-name">{job.organization}</p>
              <div className="tags">
                <span className="tag">{job.sector}</span>
                <span className="tag">{job.category}</span>
                {job.payout && <span className="tag">{job.payout}</span>}
              </div>

              <p className="desc">{job.description}</p>
              <p className="skills">Skills: {job.skills}</p>

              <div className="job-actions">
                <button className="btn-apply" onClick={() => handleApply(job)}>
                  Apply ➜
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FindJob;
