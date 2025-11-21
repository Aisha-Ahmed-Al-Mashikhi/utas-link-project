import React, { useState } from "react";
import axios from "axios";
import "../Styles/PostJob.css";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { postJobSchema } from "../Validations/PostJobValidation";

const PostJob = () => {
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
  ];

  const SECTORS = ["Private Company", "Government"];

  const RATE_TYPES = ["Per Hour", "Per Task", "Per Day"];

  const onSubmit = async () => {
    try {
      const company = JSON.parse(localStorage.getItem("loggedUser"));
      if (!company) {
        alert("Please log in first.");
        return;
      }

      await axios.post("http://localhost:3001/addJob", {
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
      });

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
    } catch (err) {
      console.error(err);
      alert("Failed to post job.");
    }
  };

  return (
    <div className="postjob-page">
      <div className="postjob-card">
        <h1 className="page-title">
          Post a <span className="accent">Job</span>
        </h1>

        <p className="page-sub">Add a new job listing for students</p>

        <form onSubmit={handleSubmit(onSubmit)}>
          <label>Job Title</label>
          <input
            type="text"
            value={jobTitle}
            placeholder="Graphic Designer"
            {...register("jobTitle", {
              onChange: (e) => setJobTitle(e.target.value),
            })}
          />
          <p className="error">{errors.jobTitle?.message}</p>

          <div className="row-flex">
            <div className="col-half">
              <label>Category</label>
              <select
                value={category}
                {...register("category", {
                  onChange: (e) => setCategory(e.target.value),
                })}
              >
                <option value="">Select category</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <p className="error">{errors.category?.message}</p>
            </div>

            {/* Sector — UPDATED */}
            <div className="col-half">
              <label>Sector</label>

              <div className="sector-inline">
                {SECTORS.map((s) => (
                  <label key={s} className="sector-box-inline">
                    <input
                      type="radio"
                      value={s}
                      checked={sector === s}
                      {...register("sector", {
                        onChange: (e) => setSector(e.target.value),
                      })}
                    />
                    <span>{s}</span>
                  </label>
                ))}
              </div>

              <p className="error">{errors.sector?.message}</p>
            </div>
          </div>

          <div className="row-flex">
            <div className="col-half">
              <label>Rate (OMR)</label>
              <input
                type="number"
                value={rate}
                placeholder="10"
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
                {RATE_TYPES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
              <p className="error">{errors.rateType?.message}</p>
            </div>
          </div>

          <label>Skills Required</label>
          <input
            type="text"
            value={skills}
            placeholder="Photoshop, Canva, Social Media"
            {...register("skills", {
              onChange: (e) => setSkills(e.target.value),
            })}
          />
          <p className="error">{errors.skills?.message}</p>

          <label>Description</label>
          <textarea
            value={description}
            placeholder="Explain job responsibilities and requirements"
            {...register("description", {
              onChange: (e) => setDescription(e.target.value),
            })}
          />
          <p className="error">{errors.description?.message}</p>

          <label>Payout (optional)</label>
          <input
            type="text"
            value={payout}
            placeholder="e.g. After project completion"
            {...register("payout", {
              onChange: (e) => setPayout(e.target.value),
            })}
          />
          <p className="error">{errors.payout?.message}</p>

          <div className="actions">
            <button type="submit" className="btn-primary">
              Post Job
            </button>

            <button
              type="button"
              className="btn-ghost"
              onClick={() => {
                reset();
                setJobTitle("");
                setCategory("");
                setSector("");
                setRate("");
                setRateType("");
                setSkills("");
                setDescription("");
                setPayout("");
              }}
            >
              Clear
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostJob;
