import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import * as ENV from "../config";

const initialState = {
  applications: [],
  isLoading: false,
  isSuccess: false,
  isError: false,
};

// Fetch applications by email
export const fetchApplications = createAsyncThunk(
  "applications/fetchApplications",
  async (email, thunkAPI) => {
    try {
      const res = await axios.get(`${ENV.SERVER_URL}/applications/${email}`);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Fetch failed");
    }
  }
);

// Apply for job
export const applyJob = createAsyncThunk(
  "applications/applyJob",
  async (applicationData, thunkAPI) => {
    try {
      const res = await axios.post(`${ENV.SERVER_URL}/apply`, applicationData);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Apply failed");
    }
  }
);

// Cancel application
export const cancelApplication = createAsyncThunk(
  "applications/cancelApplication",
  async (id, thunkAPI) => {
    try {
      await axios.delete(`${ENV.SERVER_URL}/applications/${id}`);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Cancel failed");
    }
  }
);

const applicationSlice = createSlice({
  name: "applications",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
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
      .addCase(applyJob.fulfilled, (state, action) => {
        state.applications.push(action.payload);
      })
      .addCase(cancelApplication.fulfilled, (state, action) => {
        state.applications = state.applications.filter(
          (a) => a._id !== action.payload
        );
      });
  },
});

export default applicationSlice.reducer;
