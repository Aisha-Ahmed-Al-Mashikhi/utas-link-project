// ==========================================================
// JobSlice.js  (Final Clean Version)
// Handles:
// ✔ Fetch all jobs
// ✔ Add job (company)
// ✔ Apply for job (student)
// ==========================================================

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import * as ENV from "../config";

// ----------------------------------------------------------
// FETCH JOBS
// ----------------------------------------------------------
export const fetchJobs = createAsyncThunk("jobs/fetchJobs", async () => {
  const res = await axios.get(`${ENV.SERVER_URL}/jobs`);
  return res.data;
});

// ----------------------------------------------------------
// ADD JOB (Company)
// ----------------------------------------------------------
export const addJob = createAsyncThunk(
  "jobs/addJob",
  async (jobData, thunkAPI) => {
    try {
      const res = await axios.post(`${ENV.SERVER_URL}/addJob`, jobData);
      return res.data.job;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || "Add job failed");
    }
  }
);

// ----------------------------------------------------------
// APPLY FOR JOB (Student)
// ----------------------------------------------------------
export const applyForJob = createAsyncThunk(
  "jobs/applyForJob",
  async (applicationData, thunkAPI) => {
    try {
      const res = await axios.post(`${ENV.SERVER_URL}/apply`, applicationData);
      return res.data; // success message
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || "Apply failed");
    }
  }
);

// ----------------------------------------------------------
// SLICE
// ----------------------------------------------------------
const jobSlice = createSlice({
  name: "jobs",
  initialState: {
    jobs: [],
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: "",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // FETCH JOBS
      .addCase(fetchJobs.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.jobs = action.payload;
      })
      .addCase(fetchJobs.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })

      // ADD JOB
      .addCase(addJob.fulfilled, (state, action) => {
        state.jobs.push(action.payload);
        state.isSuccess = true;
      })

      // APPLY JOB
      .addCase(applyForJob.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(applyForJob.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = action.payload.message;
      })
      .addCase(applyForJob.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export default jobSlice.reducer;
