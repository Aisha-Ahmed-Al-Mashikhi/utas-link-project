import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Initial state
const initialState = {
  applications: [],
  isLoading: false,
  isSuccess: false,
  isError: false,
};

// Fetch all applications by user email
export const fetchApplications = createAsyncThunk(
  "applications/fetchApplications",
  async (email, thunkAPI) => {
    try {
      const res = await axios.get(
        `http://localhost:3001/applications/${email}`
      );
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Fetch failed");
    }
  }
);

// Apply for a job (save in MongoDB)
export const applyJob = createAsyncThunk(
  "applications/applyJob",
  async (applicationData, thunkAPI) => {
    try {
      const res = await axios.post(
        "http://localhost:3001/apply",
        applicationData
      );
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Apply failed");
    }
  }
);

// Cancel an existing application (delete from MongoDB)
export const cancelApplication = createAsyncThunk(
  "applications/cancelApplication",
  async (id, thunkAPI) => {
    try {
      await axios.delete(`http://localhost:3001/applications/${id}`);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Cancel failed");
    }
  }
);

// Application slice
const applicationSlice = createSlice({
  name: "applications",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch applications
      .addCase(fetchApplications.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchApplications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.applications = action.payload;
        state.isSuccess = true;
      })
      .addCase(fetchApplications.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })

      // Apply job
      .addCase(applyJob.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(applyJob.fulfilled, (state, action) => {
        state.isLoading = false;
        state.applications.push(action.payload);
        state.isSuccess = true;
      })
      .addCase(applyJob.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })

      // Cancel application
      .addCase(cancelApplication.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(cancelApplication.fulfilled, (state, action) => {
        state.isLoading = false;
        state.applications = state.applications.filter(
          (app) => app._id !== action.payload
        );
      })
      .addCase(cancelApplication.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      });
  },
});

export default applicationSlice.reducer;
