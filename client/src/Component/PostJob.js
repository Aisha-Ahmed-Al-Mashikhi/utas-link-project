import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { postJobSchema } from "../Validations/PostJobValidation";
import "../Styles/PostJob.css";

const SECTORS = [
  "Private Company (Dhofar)",
  "Government / Ministry",
  "Small Business",
  "Non-profit",
];

const CATEGORIES = [
  "Design",
  "Marketing",
  "Education",
  "Technology",
  "Customer Service",
];

const PostJob = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(postJobSchema),
  });

  const onSubmit = (data) => {
    const existing = JSON.parse(localStorage.getItem("jobs")) || [];
    existing.push(data);
    localStorage.setItem("jobs", JSON.stringify(existing));
    alert("✅ Job Posted Successfully!");
    reset();
  };

  return (
    <div className="postjob-page">
      <div className="postjob-card">
        <h1 className="page-title">
          Post a <span className="accent">Job</span>
        </h1>
        <p className="page-sub">
          List a part-time or internship opportunity. Choose payout rules and
          mark if training is available.
        </p>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* --- Job Title & Organization --- */}
          <div className="row-flex">
            <div className="col-half">
              <label>Job Title</label>
              <input
                type="text"
                placeholder="e.g. Reception Assistant"
                {...register("jobTitle")}
              />
              <p className="error">{errors.jobTitle?.message}</p>
            </div>

            <div className="col-half">
              <label>Organization</label>
              <input
                type="text"
                placeholder="Your company / ministry"
                {...register("organization")}
              />
              <p className="error">{errors.organization?.message}</p>
            </div>
          </div>

          {/* --- Sector & Category --- */}
          <div className="row-flex">
            <div className="col-half">
              <label>Sector</label>
              <select {...register("sector")}>
                {SECTORS.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
              <p className="error">{errors.sector?.message}</p>
            </div>

            <div className="col-half">
              <label>Category</label>
              <select {...register("category")}>
                {CATEGORIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
              <p className="error">{errors.category?.message}</p>
            </div>
          </div>

          {/* --- Rate / Type / Payout --- */}
          <div className="row-flex">
            <div className="col-half">
              <label>Rate (OMR)</label>
              <input type="number" {...register("rate")} />
              <p className="error">{errors.rate?.message}</p>
            </div>

            <div className="col-half">
              <label>Rate Type</label>
              <select {...register("rateType")}>
                <option>Per Hour</option>
                <option>Per Task</option>
                <option>Per Day</option>
              </select>
              <p className="error">{errors.rateType?.message}</p>
            </div>

            <div className="col-half">
              <label>Payout</label>
              <select {...register("payout")}>
                <option>End of day</option>
                <option>Weekly</option>
                <option>After completion</option>
              </select>
              <p className="error">{errors.payout?.message}</p>
            </div>
          </div>

          {/* --- Skills --- */}
          <label>Skills</label>
          <input
            type="text"
            placeholder="e.g. Arabic, MS Office"
            {...register("skills")}
          />
          <p className="error">{errors.skills?.message}</p>

          {/* --- Description --- */}
          <label>Description</label>
          <textarea
            placeholder="Responsibilities, schedule, deliverables"
            {...register("description")}
          />
          <p className="error">{errors.description?.message}</p>

          {/* --- Buttons --- */}
          <div className="actions">
            <button type="submit" className="btn-primary">
              + Post Job
            </button>
            <button type="button" onClick={() => reset()} className="btn-ghost">
              Clear
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostJob;
