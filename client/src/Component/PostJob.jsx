// Import React and hooks
import React, { useState, useEffect } from "react";
// Import page styles
import "../Styles/PostJob.css";
// Import react-hook-form
import { useForm } from "react-hook-form";
// Import yup resolver
import { yupResolver } from "@hookform/resolvers/yup";
// Import validation schema
import { postJobSchema } from "../Validations/PostJobValidation";
// Import Redux hooks
import { useDispatch, useSelector } from "react-redux";
// Import job action
import { addJob } from "../Features/JobSlice";
// Import company action
import { fetchCompany } from "../Features/CompanySlice";
// Import navigation hook
import { useNavigate } from "react-router-dom";

// Define PostJob component
const PostJob = () => {
  // Initialize dispatch
  const dispatch = useDispatch();
  // Initialize navigation
  const navigate = useNavigate();

  //  get company from redux
  const { company } = useSelector((state) => state.companies);

  // Job title state
  const [jobTitle, setJobTitle] = useState("");
  // Category state
  const [category, setCategory] = useState("");
  // Sector state
  const [sector, setSector] = useState("");
  // Rate state
  const [rate, setRate] = useState("");
  // Rate type state
  const [rateType, setRateType] = useState("");
  // Skills state
  const [skills, setSkills] = useState("");
  // Description state
  const [description, setDescription] = useState("");
  // Payout state
  const [payout, setPayout] = useState("");
  //  Duration state
  const [postDuration, setPostDuration] = useState("");
  // Initialize form handling
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    // Apply validation schema
    resolver: yupResolver(postJobSchema),
    // Validate on change
    mode: "onChange",
  });

  // FETCH COMPANY DATA ON PAGE LOAD
  useEffect(() => {
    // Get logged company
    const loggedCompany = JSON.parse(localStorage.getItem("loggedUser"));
    // Check email
    if (loggedCompany?.email) {
      // Dispatch fetch company
      dispatch(fetchCompany(loggedCompany.email));
    }
  }, [dispatch]);

  // Job categories list
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

  // Job sectors list
  const SECTORS = ["Private", "Government"];
  // Rate types list
  const RATE_TYPES = ["Per Hour", "Per Task", "Per Day"];

  // ================= SUBMIT =================
  // Handle form submit
  const onSubmit = () => {
    // Get logged company
    const loggedCompany = JSON.parse(localStorage.getItem("loggedUser"));

    // Check login
    if (!loggedCompany) {
      alert("Please log in first.");
      navigate("/login");
      return;
    }

    // 🔴 CHECK BUSINESS LICENSE
    if (!company?.businessLicense) {
      alert("You must upload your business license before posting a job.");
      navigate("/company-profile");
      return;
    }

    // Dispatch add job
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
        postDuration: Number(postDuration),
        organization: loggedCompany.companyName,
        postedBy: loggedCompany.email,
        postedAt: new Date().toISOString(),
      })
    )
      .unwrap()
      .then(() => {
        alert("Job posted successfully!");
        navigate("/company-jobs");
        handleClean();
      })
      .catch(() => alert("Failed to post job"));
  };

  // ================= CLEAN =================
  // Reset form fields
  const handleClean = () => {
    reset();
    setJobTitle("");
    setCategory("");
    setSector("");
    setRate("");
    setRateType("");
    setSkills("");
    setDescription("");
    setPayout("");
  };

  // Return JSX
  return (
    // Page container
    <div className="postjob-page">
      {/* Card container */}
      <div className="postjob-card">
        {/* Page title */}
        <h1 className="page-title">
          Post a <span className="accent">Job</span>
        </h1>

        {/* Page subtitle */}
        <p className="page-sub">Add a new job listing for students</p>

        {/* Job form */}
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Job title label */}
          <label>Job Title</label>
          {/* Job title input */}
          <input
            type="text"
            placeholder="e.g. Barista, Social Media Admin, Tutor"
            value={jobTitle}
            {...register("jobTitle", {
              onChange: (e) => setJobTitle(e.target.value),
            })}
          />
          {/* Job title error */}
          <p className="error">{errors.jobTitle?.message}</p>

          {/* Row container */}
          <div className="row-flex">
            {/* Category column */}
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
                  <option key={c}>{c}</option>
                ))}
              </select>
              <p className="error">{errors.category?.message}</p>
            </div>

            {/* Sector column */}
            <div className="col-half">
              <label>Sector</label>
              <div className="sector-grid">
                {SECTORS.map((s) => (
                  <label
                    key={s}
                    className={`sector-box ${sector === s ? "selected" : ""}`}
                  >
                    <input
                      type="radio"
                      value={s}
                      {...register("sector")}
                      checked={sector === s}
                      onChange={(e) => {
                        setSector(e.target.value);
                        setValue("sector", e.target.value, {
                          shouldValidate: true,
                        });
                      }}
                    />
                    <span>{s}</span>
                  </label>
                ))}
              </div>
              <p className="error">{errors.sector?.message}</p>
            </div>
          </div>

          {/* Rate label */}
          <label>Rate (OMR)</label>
          <input
            type="number"
            placeholder="e.g. 10 OMR"
            value={rate}
            {...register("rate", {
              onChange: (e) => setRate(e.target.value),
            })}
          />
          <p className="error">{errors.rate?.message}</p>

          {/* Rate type label */}
          <label>Rate Type</label>
          <select
            value={rateType}
            {...register("rateType", {
              onChange: (e) => setRateType(e.target.value),
            })}
          >
            <option value="">Select type</option>
            {RATE_TYPES.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
          <p className="error">{errors.rateType?.message}</p>

          {/* DURATION */}
          <label>Job Expiry (Days)</label>
          <input
            type="number"
            placeholder="e.g. 30"
            value={postDuration}
            {...register("postDuration", {
              onChange: (e) => setPostDuration(e.target.value),
            })}
          />
          <p className="error">{errors.postDuration?.message}</p>

          {/* Skills label */}
          <label>Skills Required</label>
          <input
            placeholder="e.g. English, Excel, python"
            type="text"
            value={skills}
            {...register("skills", {
              onChange: (e) => setSkills(e.target.value),
            })}
          />

          {/* Description label */}
          <label>Description</label>
          <textarea
            placeholder="Describe the tasks, location, and working hours..."
            value={description}
            {...register("description", {
              onChange: (e) => setDescription(e.target.value),
            })}
          />

          {/* Payout label */}
          <label>Payout (optional)</label>
          <input
            type="text"
            placeholder="e.g. Cash after task, Bank transfer weekly"
            value={payout}
            {...register("payout", {
              onChange: (e) => setPayout(e.target.value),
            })}
          />

          {/* Action buttons */}
          <div className="actions">
            <button className="btn-primary" type="submit">
              Post Job
            </button>
            <button className="btn-clean" type="button" onClick={handleClean}>
              Clean
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Export PostJob component
export default PostJob;
