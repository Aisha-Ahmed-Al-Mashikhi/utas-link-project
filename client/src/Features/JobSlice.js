// src/Features/JobSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import * as ENV from "../config";

// ====================================================
// 1) FETCH ALL JOBS (Student sees jobs)
// ====================================================
export const fetchJobs = createAsyncThunk("jobs/fetchJobs", async () => {
  const res = await axios.get(`${ENV.SERVER_URL}/jobs`);
  return res.data;
});

// ====================================================
// 2) FETCH COMPANY JOBS (Only jobs posted by company)
// ====================================================
export const fetchCompanyJobs = createAsyncThunk(
  "jobs/fetchCompanyJobs",
  async (companyEmail) => {
    const res = await axios.get(
      `${ENV.SERVER_URL}/jobs/company/${companyEmail}`
    );
    return res.data;
  }
);

// ====================================================
// 3) ADD NEW JOB (Company posts a job)
// ====================================================
export const addJob = createAsyncThunk("jobs/addJob", async (jobData) => {
  const res = await axios.post(`${ENV.SERVER_URL}/jobs`, jobData);
  return res.data;
});

// ====================================================
// 4) UPDATE JOB (Company edits a job)
// ====================================================
export const updateJob = createAsyncThunk(
  "jobs/updateJob",
  async ({ jobId, updatedData }) => {
    const res = await axios.put(`${ENV.SERVER_URL}/jobs/${jobId}`, updatedData);
    return res.data;
  }
);

// ====================================================
// 5) DELETE JOB
// ====================================================
export const deleteJob = createAsyncThunk("jobs/deleteJob", async (jobId) => {
  await axios.delete(`${ENV.SERVER_URL}/jobs/${jobId}`);
  return jobId;
});

// ====================================================
// 6) STUDENT APPLY FOR JOB
// ====================================================
export const applyForJob = createAsyncThunk(
  "jobs/applyForJob",
  async (applicationData) => {
    const res = await axios.post(`${ENV.SERVER_URL}/apply`, applicationData);
    return res.data;
  }
);

// ====================================================
// SLICE
// ====================================================
const jobSlice = createSlice({
  name: "jobs",
  initialState: {
    jobList: [],
    companyJobs: [],
    isLoading: false,
  },
  reducers: {},

  extraReducers: (builder) => {
    builder
      // =========================
      // FETCH ALL JOBS
      // =========================
      .addCase(fetchJobs.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.jobList = action.payload;
        state.isLoading = false;
      })

      // =========================
      // FETCH COMPANY JOBS
      // =========================
      .addCase(fetchCompanyJobs.fulfilled, (state, action) => {
        state.companyJobs = action.payload;
      })

      // =========================
      // ADD JOB
      // =========================
      .addCase(addJob.fulfilled, (state, action) => {
        state.companyJobs.push(action.payload);
      })

      // =========================
      // UPDATE JOB
      // =========================
      .addCase(updateJob.fulfilled, (state, action) => {
        const updated = action.payload;
        const index = state.companyJobs.findIndex((j) => j._id === updated._id);
        if (index !== -1) {
          state.companyJobs[index] = updated;
        }
      })

      // =========================
      // DELETE JOB
      // =========================
      .addCase(deleteJob.fulfilled, (state, action) => {
        state.companyJobs = state.companyJobs.filter(
          (job) => job._id !== action.payload
        );
      })

      // =========================
      // APPLY FOR JOB (Student)
      // =========================
      .addCase(applyForJob.fulfilled, () => {
        // No state change needed
      });
  },
});

export default jobSlice.reducer;
