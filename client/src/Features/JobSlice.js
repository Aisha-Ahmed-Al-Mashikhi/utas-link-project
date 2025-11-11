import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Fetch all jobs
export const fetchJobs = createAsyncThunk("jobs/fetchJobs", async () => {
  const res = await axios.get("http://localhost:3001/jobs");
  return res.data;
});

// Add new job
export const addJob = createAsyncThunk(
  "jobs/addJob",
  async (jobData, thunkAPI) => {
    try {
      const res = await axios.post("http://localhost:3001/addJob", jobData);
      console.log("Response from backend:", res.data);
      return res.data.job || res.data;
    } catch (error) {
      console.error("Error adding job:", error.response?.data || error.message);
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
      // Fetch jobs
      .addCase(fetchJobs.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.jobs = action.payload;
      })
      .addCase(fetchJobs.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })

      // Add job
      .addCase(addJob.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
      })
      .addCase(addJob.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        if (action.payload) state.jobs.push(action.payload);
      })
      .addCase(addJob.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
      });
  },
});

export default jobSlice.reducer;
