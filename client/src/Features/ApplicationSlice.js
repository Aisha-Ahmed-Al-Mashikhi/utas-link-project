// src/Features/ApplicationSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import * as ENV from "../config";

// ======================================
// 1) STUDENT — FETCH APPLICATIONS (FIXED)
// ======================================
export const fetchStudentApplications = createAsyncThunk(
  "applications/fetchStudentApplications",
  async (email) => {
    const encodedEmail = encodeURIComponent(email); 
    const res = await axios.get(`${ENV.SERVER_URL}/applications/${encodedEmail}`);
    return res.data;
  }
);

// ======================================
// 2) STUDENT — CANCEL APPLICATION
// ======================================
export const cancelStudentApplication = createAsyncThunk(
  "applications/cancelStudentApplication",
  async (applicationId) => {
    await axios.delete(`${ENV.SERVER_URL}/applications/${applicationId}`);
    return applicationId;
  }
);

// ======================================
// 3) COMPANY — FETCH APPLICANTS FOR A JOB
// ======================================
export const fetchApplicants = createAsyncThunk(
  "applications/fetchApplicants",
  async (jobId) => {
    const res = await axios.get(`${ENV.SERVER_URL}/applications/job/${jobId}`);
    return res.data;
  }
);

// ======================================
// 4) COMPANY — UPDATE APPLICANT STATUS
// ======================================
export const updateApplicantStatus = createAsyncThunk(
  "applications/updateApplicantStatus",
  async ({ applicationId, status }) => {
    const res = await axios.put(
      `${ENV.SERVER_URL}/applications/update/${applicationId}`,
      { status }
    );
    return res.data;
  }
);

// ======================================
// SLICE
// ======================================
const applicationSlice = createSlice({
  name: "applications",

  initialState: {
    studentApplications: [],
    applicants: [],
    isLoading: false,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchStudentApplications.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchStudentApplications.fulfilled, (state, action) => {
        state.studentApplications = action.payload;
        state.isLoading = false;
      })

      .addCase(cancelStudentApplication.fulfilled, (state, action) => {
        state.studentApplications = state.studentApplications.filter(
          (app) => app._id !== action.payload
        );
      })

      .addCase(fetchApplicants.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchApplicants.fulfilled, (state, action) => {
        state.applicants = action.payload;
        state.isLoading = false;
      })

      .addCase(updateApplicantStatus.fulfilled, (state, action) => {
        const updated = action.payload;
        const index = state.applicants.findIndex((a) => a._id === updated._id);
        if (index !== -1) {
          state.applicants[index] = updated;
        }
      });
  },
});

export default applicationSlice.reducer;
