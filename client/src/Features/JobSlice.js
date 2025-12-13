// Redux helpers
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// Axios client
import axios from "axios";
// Server config
import * as ENV from "../config";

// Get user IP
const getIP = async () => {
  // IP request
  const res = await axios.get("https://api.ipify.org?format=json");
  // Return IP
  return res.data.ip;
};

// Get geo location
const getGeoLocation = async () => {
  // Geo request
  const res = await axios.get("https://ipinfo.io/json?token=384ae3842ac4c9");

  // Return location
  return {
    country: res.data.country || "",
    city: res.data.city || "",
    region: res.data.region || "",
  };
};

// Fetch all jobs
export const fetchJobs = createAsyncThunk(
  // Action name
  "jobs/fetchJobs",
  // Async handler
  async () => {
    // GET request
    const res = await axios.get(`${ENV.SERVER_URL}/jobs`);
    // Return jobs
    return res.data;
  }
);

// Fetch company jobs
export const fetchCompanyJobs = createAsyncThunk(
  // Action name
  "jobs/fetchCompanyJobs",
  // Async handler
  async (companyEmail) => {
    // GET request
    const res = await axios.get(
      `${ENV.SERVER_URL}/jobs/company/${companyEmail}`
    );
    // Return jobs
    return res.data;
  }
);

// Add job
export const addJob = createAsyncThunk(
  // Action name
  "jobs/addJob",
  // Async handler
  async (jobData, thunkAPI) => {
    try {
      // Get location
      const geo = await getGeoLocation();

      // Build job data
      const finalJob = {
        ...jobData,
        location: `${geo.city}, ${geo.region}, ${geo.country}`,
      };

      // POST request
      const res = await axios.post(`${ENV.SERVER_URL}/jobs`, finalJob);

      // Return job
      return res.data;
    } catch (err) {
      // Return error
      return thunkAPI.rejectWithValue("Failed to add job");
    }
  }
);

// Update job
export const updateJob = createAsyncThunk(
  // Action name
  "jobs/updateJob",
  // Async handler
  async (jobData) => {
    // PUT request
    const res = await axios.put(
      `${ENV.SERVER_URL}/jobs/${jobData._id}`,
      jobData
    );
    // Return job
    return res.data;
  }
);

// Delete job
export const deleteJob = createAsyncThunk(
  // Action name
  "jobs/deleteJob",
  // Async handler
  async (jobId) => {
    // DELETE request
    await axios.delete(`${ENV.SERVER_URL}/jobs/${jobId}`);
    // Return id
    return jobId;
  }
);

// Apply for job
export const applyForJob = createAsyncThunk(
  // Action name
  "jobs/applyForJob",
  // Async handler
  async (applicationData) => {
    // POST request
    const res = await axios.post(`${ENV.SERVER_URL}/apply`, applicationData);
    // Return result
    return res.data;
  }
);

// Create slice
const jobSlice = createSlice({
  // Slice name
  name: "jobs",
  // Initial state
  initialState: {
    // Jobs list
    jobList: [],
    // Company jobs
    companyJobs: [],
    // Loading flag
    isLoading: false,
  },
  // Local reducers
  reducers: {},
  // Async reducers
  extraReducers: (builder) => {
    builder
      // Fetch loading
      .addCase(fetchJobs.pending, (state) => {
        // Set loading
        state.isLoading = true;
      })
      // Fetch success
      .addCase(fetchJobs.fulfilled, (state, action) => {
        // Set jobs
        state.jobList = action.payload;
        // Stop loading
        state.isLoading = false;
      })
      // Company jobs success
      .addCase(fetchCompanyJobs.fulfilled, (state, action) => {
        // Set company jobs
        state.companyJobs = action.payload;
      })
      // Add job success
      .addCase(addJob.fulfilled, (state, action) => {
        // Add job
        state.companyJobs.push(action.payload);
      })
      // Update job success
      .addCase(updateJob.fulfilled, (state, action) => {
        // Find index
        const i = state.companyJobs.findIndex(
          (j) => j._id === action.payload._id
        );
        // Replace job
        if (i !== -1) state.companyJobs[i] = action.payload;
      })
      // Delete job success
      .addCase(deleteJob.fulfilled, (state, action) => {
        // Remove job
        state.companyJobs = state.companyJobs.filter(
          (j) => j._id !== action.payload
        );
      });
  },
});

// Export reducer
export default jobSlice.reducer;
