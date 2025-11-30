// src/Features/ApplicationSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import * as ENV from "../config";

// ======================================
// 1) STUDENT — FETCH APPLICATIONS
// ======================================
export const fetchStudentApplications = createAsyncThunk(
  "applications/fetchStudentApplications",
  async (email) => {
    const res = await axios.get(`${ENV.SERVER_URL}/applications/${email}`);
    return res.data; // array
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
// (FIXED — THIS IS THE CORRECT API)
// ======================================
export const fetchApplicants = createAsyncThunk(
  "applications/fetchApplicants",
  async (jobId) => {
    const res = await axios.get(`${ENV.SERVER_URL}/applications/job/${jobId}`);
    return res.data; // array of applicants
  }
);

// ======================================
// 4) COMPANY — UPDATE APPLICANT STATUS
// (FIXED — NOW MATCHES THE BACKEND)
// ======================================
export const updateApplicantStatus = createAsyncThunk(
  "applications/updateApplicantStatus",
  async ({ applicationId, status }) => {
    const res = await axios.put(
      `${ENV.SERVER_URL}/applications/update/${applicationId}`,
      { status }
    );
    return res.data; // updated application
  }
);

// ======================================
// SLICE
// ======================================
const applicationSlice = createSlice({
  name: "applications",

  initialState: {
    studentApplications: [], // For student
    applicants: [], // For company
    isLoading: false,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      // -------------------------
      // STUDENT: FETCH APPLICATIONS
      // -------------------------
      .addCase(fetchStudentApplications.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchStudentApplications.fulfilled, (state, action) => {
        state.studentApplications = action.payload;
        state.isLoading = false;
      })

      // -------------------------
      // STUDENT: CANCEL APPLICATION
      // -------------------------
      .addCase(cancelStudentApplication.fulfilled, (state, action) => {
        state.studentApplications = state.studentApplications.filter(
          (app) => app._id !== action.payload
        );
      })

      // -------------------------
      // COMPANY: FETCH APPLICANTS
      // -------------------------
      .addCase(fetchApplicants.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchApplicants.fulfilled, (state, action) => {
        state.applicants = action.payload;
        state.isLoading = false;
      })

      // -------------------------
      // COMPANY: UPDATE STATUS
      // -------------------------
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
