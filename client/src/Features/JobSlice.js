import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import * as ENV from "../config";

// Fetch jobs
export const fetchJobs = createAsyncThunk("jobs/fetchJobs", async () => {
  const res = await axios.get(`${ENV.SERVER_URL}/jobs`);
  return res.data;
});

// Add job
export const addJob = createAsyncThunk(
  "jobs/addJob",
  async (jobData, thunkAPI) => {
    try {
      const res = await axios.post(`${ENV.SERVER_URL}/addJob`, jobData);
      return res.data.job || res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Add job failed");
    }
  }
);

const jobSlice = createSlice({
  name: "jobs",
  initialState: {
    jobs: [],
    isLoading: false,
    isError: false,
    isSuccess: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobs.fulfilled, (s, a) => {
        s.jobs = a.payload;
      })
      .addCase(addJob.fulfilled, (s, a) => {
        s.jobs.push(a.payload);
        s.isSuccess = true;
      });
  },
});

export default jobSlice.reducer;
