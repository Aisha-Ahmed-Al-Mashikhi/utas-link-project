import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import * as ENV from "../config";

/* ------------------------------------
   INTERNAL: Get User IP 
------------------------------------ */
const getIP = async () => {
  const res = await axios.get("https://api.ipify.org?format=json");
  return res.data.ip;
};

/* ------------------------------------
   INTERNAL: Get Geo Location by IP
------------------------------------ */
const getGeoLocation = async (ip) => {
  const res = await axios.get(`http://ip-api.com/json/${ip}`);
  return {
    country: res.data.country || "",
    city: res.data.city || "",
    region: res.data.regionName || "",
  };
};

/* ====================================================
   FETCH ALL JOBS
==================================================== */
export const fetchJobs = createAsyncThunk("jobs/fetchJobs", async () => {
  const res = await axios.get(`${ENV.SERVER_URL}/jobs`);
  return res.data;
});

/* ====================================================
   FETCH COMPANY JOBS
==================================================== */
export const fetchCompanyJobs = createAsyncThunk(
  "jobs/fetchCompanyJobs",
  async (companyEmail) => {
    const res = await axios.get(`${ENV.SERVER_URL}/jobs/company/${companyEmail}`);
    return res.data;
  }
);

/* ====================================================
   ADD JOB (with LOCATION)
==================================================== */
export const addJob = createAsyncThunk("jobs/addJob", async (jobData) => {
  // 1) Get IP
  const ip = await getIP();

  // 2) Get location by IP
  const geo = await getGeoLocation(ip);

  // 3) Add to job data
  const finalJob = {
    ...jobData,
    location: `${geo.city}, ${geo.region}, ${geo.country}`,
  };

  // 4) Send to server
  const res = await axios.post(`${ENV.SERVER_URL}/jobs`, finalJob);
  return res.data;
});

/* ====================================================
   UPDATE JOB
==================================================== */
export const updateJob = createAsyncThunk("jobs/updateJob", async (jobData) => {
  const res = await axios.put(`${ENV.SERVER_URL}/jobs/${jobData._id}`, jobData);
  return res.data;
});

/* ====================================================
   DELETE JOB
==================================================== */
export const deleteJob = createAsyncThunk("jobs/deleteJob", async (jobId) => {
  await axios.delete(`${ENV.SERVER_URL}/jobs/${jobId}`);
  return jobId;
});

/* ====================================================
   APPLY FOR JOB
==================================================== */
export const applyForJob = createAsyncThunk(
  "jobs/applyForJob",
  async (applicationData) => {
    const res = await axios.post(`${ENV.SERVER_URL}/apply`, applicationData);
    return res.data;
  }
);

/* ====================================================
   SLICE
==================================================== */
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
      .addCase(fetchJobs.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.jobList = action.payload;
        state.isLoading = false;
      })

      .addCase(fetchCompanyJobs.fulfilled, (state, action) => {
        state.companyJobs = action.payload;
      })

      .addCase(addJob.fulfilled, (state, action) => {
        state.companyJobs.push(action.payload);
      })

      .addCase(updateJob.fulfilled, (state, action) => {
        const i = state.companyJobs.findIndex((j) => j._id === action.payload._id);
        if (i !== -1) state.companyJobs[i] = action.payload;
      })

      .addCase(deleteJob.fulfilled, (state, action) => {
        state.companyJobs = state.companyJobs.filter((j) => j._id !== action.payload);
      });
  },
});

export default jobSlice.reducer;
