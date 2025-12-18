// Redux imports
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// Axios import
import axios from "axios";
// Environment config
import * as ENV from "../config";

// Fetch student applications
export const fetchStudentApplications = createAsyncThunk(
  // Action name
  "applications/fetchStudentApplications",
  // Async handler
  async (email) => {
    // API request
    const res = await axios.get(`${ENV.SERVER_URL}/applications/${email}`);
    // Return data
    return res.data;
  }
);

// Cancel student application
export const cancelStudentApplication = createAsyncThunk(
  // Action name
  "applications/cancelStudentApplication",
  // Async handler
  async (applicationId) => {
    // Delete request
    await axios.delete(`${ENV.SERVER_URL}/applications/${applicationId}`);
    // Return id
    return applicationId;
  }
);

// Fetch job applicants
export const fetchApplicants = createAsyncThunk(
  // Action name
  "applications/fetchApplicants",
  // Async handler
  async (jobId) => {
    // API request
    const res = await axios.get(`${ENV.SERVER_URL}/applications/job/${jobId}`);
    // Return data
    return res.data;
  }
);

// Update applicant status
export const updateApplicantStatus = createAsyncThunk(
  // Action name
  "applications/updateApplicantStatus",
  // Async handler
  async ({ applicationId, status }) => {
    // Update request
    const res = await axios.put(
      `${ENV.SERVER_URL}/applications/update/${applicationId}`,
      { status }
    );
    // Return updated data
    return res.data;
  }
);

// Create slice
const applicationSlice = createSlice({
  // Slice key
  name: "applications",

  // Default state
  initialState: {
    // Student applications list
    studentApplications: [],
    // Company applicants list
    applicants: [],
    // Loading flag
    isLoading: false,
  },

  // Sync reducers
  reducers: {},

  // Async reducers
  extraReducers: (builder) => {
    builder
      // Fetch loading
      .addCase(fetchStudentApplications.pending, (state) => {
        // Set loading
        state.isLoading = true;
      })

      // Fetch success
      .addCase(fetchStudentApplications.fulfilled, (state, action) => {
        // Save applications
        state.studentApplications = action.payload;
        // Stop loading
        state.isLoading = false;
      })

      // Cancel success
      .addCase(cancelStudentApplication.fulfilled, (state, action) => {
        // Remove application
        state.studentApplications = state.studentApplications.filter(
          (app) => app._id !== action.payload
        );
      })

      // Applicants loading
      .addCase(fetchApplicants.pending, (state) => {
        // Set loading
        state.isLoading = true;
      })

      // Applicants success
      .addCase(fetchApplicants.fulfilled, (state, action) => {
        // Save applicants
        state.applicants = action.payload;
        // Stop loading
        state.isLoading = false;
      })

      // Status update
      .addCase(updateApplicantStatus.fulfilled, (state, action) => {
        // Updated record
        const updated = action.payload;
        // Find index
        const index = state.applicants.findIndex((a) => a._id === updated._id);
        // Replace record
        if (index !== -1) {
          state.applicants[index] = updated;
        }
      });
  },
});

// Export slice reducer
export default applicationSlice.reducer;
