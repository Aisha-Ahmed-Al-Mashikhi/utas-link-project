import React, { useState } from "react";
import "../Styles/PostJob.css";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { postJobSchema } from "../Validations/PostJobValidation";
import { useDispatch } from "react-redux";
import { addJob } from "../Features/JobSlice";

const PostJob = () => {
  const dispatch = useDispatch();

  const [jobTitle, setJobTitle] = useState("");
  const [category, setCategory] = useState("");
  const [sector, setSector] = useState("");
  const [rate, setRate] = useState("");
  const [rateType, setRateType] = useState("");
  const [skills, setSkills] = useState("");
  const [description, setDescription] = useState("");
  const [payout, setPayout] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(postJobSchema),
    mode: "onChange",
  });

  const CATEGORIES = [
    "Design / Marketing",
    "Technology / IT",
    "Business / Finance",
    "Education / Training",
    "Logistics / Operations",
    "Hospitality / Coffee Shops",
    "Food & Beverage",
    "Customer Service",
    "Retail / Store",
    "Other",
  ];

  const SECTORS = ["Private Company", "Government"];
  const RATE_TYPES = ["Per Hour", "Per Task", "Per Day"];

  const onSubmit = () => {
    const company = JSON.parse(localStorage.getItem("loggedUser"));
    if (!company) return alert("Please log in first.");

    dispatch(
      addJob({
        jobTitle,
        category,
        sector,
        rate,
        rateType,
        skills,
        description,
        payout,
        organization: company.companyName,
        postedBy: company.email,
      })
    )
      .unwrap()
      .then(() => {
        alert("Job posted successfully!");
        reset();
        setJobTitle("");
        setCategory("");
        setSector("");
        setRate("");
        setRateType("");
        setSkills("");
        setDescription("");
        setPayout("");
      })
      .catch(() => alert("Failed to post job"));
  };

  return (
    <div className="postjob-page">
      <div className="postjob-card">
        <h1 className="page-title">
          Post a <span className="accent">Job</span>
        </h1>

        <p className="page-sub">Add a new job listing for students</p>

        <form onSubmit={handleSubmit(onSubmit)}>
          
          {/* Job Title */}
          <label>Job Title</label>
          <input
            type="text"
            value={jobTitle}
            {...register("jobTitle", { onChange: (e) => setJobTitle(e.target.value) })}
          />
          <p className="error">{errors.jobTitle?.message}</p>

          {/* Category + Sector */}
          <div className="row-flex">
            <div className="col-half">
              <label>Category</label>
              <select
                value={category}
                {...register("category", { onChange: (e) => setCategory(e.target.value) })}
              >
                <option value="">Select category</option>
                {CATEGORIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="col-half">
              <label>Sector</label>
              <div className="sector-box">
                {SECTORS.map((s) => (
                  <label key={s} className="sector-option">
                    <input
                      type="radio"
                      value={s}
                      checked={sector === s}
                      {...register("sector", {
                        onChange: (e) => setSector(e.target.value),
                      })}
                    />
                    {s}
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Rate */}
          <div className="row-flex">
            <div className="col-half">
              <label>Rate (OMR)</label>
              <input
                type="number"
                value={rate}
                {...register("rate", { onChange: (e) => setRate(e.target.value) })}
              />
            </div>

            <div className="col-half">
              <label>Rate Type</label>
              <select
                value={rateType}
                {...register("rateType", { onChange: (e) => setRateType(e.target.value) })}
              >
                <option value="">Select type</option>
                {RATE_TYPES.map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Skills */}
          <label>Skills Required</label>
          <input
            type="text"
            value={skills}
            {...register("skills", { onChange: (e) => setSkills(e.target.value) })}
          />

          {/* Description */}
          <label>Description</label>
          <textarea
            value={description}
            {...register("description", { onChange: (e) => setDescription(e.target.value) })}
          />

          {/* Payout */}
          <label>Payout (optional)</label>
          <input
            type="text"
            value={payout}
            {...register("payout", { onChange: (e) => setPayout(e.target.value) })}
          />

          {/* Buttons */}
          <div className="actions">
            <button className="btn-primary" type="submit">
              Post Job
            </button>

            <button
              className="btn-ghost"
              type="button"
              onClick={() => reset()}
            >
              Clean
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostJob;
