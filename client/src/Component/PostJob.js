import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addJob } from "../Features/JobSlice";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { postJobSchema } from "../Validations/PostJobValidation";
import "../Styles/PostJob.css";

const PostJob = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const companyState = useSelector((state) => state.companies || {});
  const company = companyState.company || {};

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(postJobSchema),
  });

  const [jobTitle, setJobTitle] = useState("");
  const [category, setCategory] = useState("");
  const [sector, setSector] = useState("");
  const [rate, setRate] = useState("");
  const [rateType, setRateType] = useState("");
  const [skills, setSkills] = useState("");
  const [description, setDescription] = useState("");
  const [payout, setPayout] = useState("");

  // Handle form submission
  const onSubmit = async (data) => {
    console.log("Submitting job data:", data);

    try {
      let currentCompany = company;
      if (!currentCompany?.companyName) {
        const savedUser = JSON.parse(localStorage.getItem("loggedUser"));
        if (savedUser) currentCompany = savedUser;
      }

      if (!currentCompany?.companyName) {
        alert("Please log in as a company before posting a job.");
        return;
      }

      const jobData = {
        ...data,
        organization: currentCompany.companyName,
        postedAt: new Date().toISOString(),
      };

      console.log("Sending job data to backend:", jobData);

      const response = await dispatch(addJob(jobData)).unwrap();
      console.log("Backend response:", response);

      alert("Job posted successfully!");
      handleClear();
      navigate("/companyjobs");
    } catch (error) {
      console.error("Error posting job:", error);
      alert(`Failed to post job: ${error?.message || "Unknown error"}`);
    }
  };

  // Handle validation errors
  const handleError = (errors) => {
    console.error("Validation Errors:", errors);
    alert("Please fill in all required fields correctly.");
  };

  // Clear all input fields
  const handleClear = () => {
    setJobTitle("");
    setCategory("");
    setSector("");
    setRate("");
    setRateType("");
    setSkills("");
    setDescription("");
    setPayout("");
    reset();
  };

  return (
    <div className="postjob-page">
      <div className="postjob-card">
        <h1 className="page-title">
          Post a <span className="accent">Job</span>
        </h1>
        <p className="page-sub">Add a new job listing for students</p>

        <form onSubmit={handleSubmit(onSubmit, handleError)}>
          <label>Job Title</label>
          <input
            type="text"
            placeholder="Graphic Designer"
            value={jobTitle}
            {...register("jobTitle", {
              onChange: (e) => setJobTitle(e.target.value),
            })}
          />
          <p className="error">{errors.jobTitle?.message}</p>

          <div className="row-flex">
            <div className="col-half">
              <label>Category</label>
              <input
                type="text"
                placeholder="Design / Marketing"
                value={category}
                {...register("category", {
                  onChange: (e) => setCategory(e.target.value),
                })}
              />
              <p className="error">{errors.category?.message}</p>
            </div>

            <div className="col-half">
              <label>Sector</label>
              <input
                type="text"
                placeholder="Private / Government"
                value={sector}
                {...register("sector", {
                  onChange: (e) => setSector(e.target.value),
                })}
              />
              <p className="error">{errors.sector?.message}</p>
            </div>
          </div>

          <div className="row-flex">
            <div className="col-half">
              <label>Rate (OMR)</label>
              <input
                type="number"
                placeholder="10"
                value={rate}
                {...register("rate", {
                  onChange: (e) => setRate(e.target.value),
                })}
              />
              <p className="error">{errors.rate?.message}</p>
            </div>

            <div className="col-half">
              <label>Rate Type</label>
              <select
                value={rateType}
                {...register("rateType", {
                  onChange: (e) => setRateType(e.target.value),
                })}
              >
                <option value="">Select type</option>
                <option value="Hour">Hour</option>
                <option value="Task">Task</option>
                <option value="Project">Project</option>
              </select>
              <p className="error">{errors.rateType?.message}</p>
            </div>
          </div>

          <label>Skills Required</label>
          <input
            type="text"
            placeholder="Photoshop, Canva, Social Media"
            value={skills}
            {...register("skills", {
              onChange: (e) => setSkills(e.target.value),
            })}
          />
          <p className="error">{errors.skills?.message}</p>

          <label>Description</label>
          <textarea
            placeholder="Explain job responsibilities and requirements"
            rows="4"
            value={description}
            {...register("description", {
              onChange: (e) => setDescription(e.target.value),
            })}
          />
          <p className="error">{errors.description?.message}</p>

          <label>Payout (optional)</label>
          <input
            type="text"
            placeholder="e.g. After project completion"
            value={payout}
            {...register("payout", {
              onChange: (e) => setPayout(e.target.value),
            })}
          />

          <div className="actions">
            <button type="submit" className="btn-primary">
              Post Job
            </button>
            <button type="button" className="btn-ghost" onClick={handleClear}>
              Clear
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostJob;
