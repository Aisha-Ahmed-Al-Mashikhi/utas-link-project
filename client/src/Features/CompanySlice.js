// Redux helpers
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// Axios client
import axios from "axios";
// Server config
import * as ENV from "../config";

// Initial state
const initialState = {
  // Company data
  company: {},

  // Loading flag
  isLoading: false,
  // Success flag
  isSuccess: false,
  // Error flag
  isError: false,
  // Message text
  message: "",

  // Register success
  registerSuccess: false,
  // Update success
  updateSuccess: false,
};

// Register company
export const registerCompany = createAsyncThunk(
  // Action name
  "companies/registerCompany",
  // Async handler
  async (companyData, thunkAPI) => {
    try {
      // POST request
      const res = await axios.post(
        `${ENV.SERVER_URL}/registerCompany`,
        companyData
      );
      // Return company
      return res.data.company;
    } catch (err) {
      // Return error
      return thunkAPI.rejectWithValue(err.response?.data || "Server error");
    }
  }
);

// Fetch company
export const fetchCompany = createAsyncThunk(
  // Action name
  "companies/fetchCompany",
  // Async handler
  async (email, thunkAPI) => {
    try {
      // GET request
      const res = await axios.get(`${ENV.SERVER_URL}/company/${email}`);
      // Return data
      return res.data;
    } catch (err) {
      // Return error
      return thunkAPI.rejectWithValue(err.response?.data || "Fetch error");
    }
  }
);

// Update company
export const updateCompany = createAsyncThunk(
  // Action name
  "companies/updateCompany",
  // Async handler
  async ({ email, data }, thunkAPI) => {
    try {
      // PUT request
      const res = await axios.put(
        `${ENV.SERVER_URL}/updateCompany/${email}`,
        data
      );
      // Return data
      return res.data;
    } catch (err) {
      // Return error
      return thunkAPI.rejectWithValue(err.response?.data || "Update error");
    }
  }
);

// Upload license
export const uploadLicense = createAsyncThunk(
  // Action name
  "companies/uploadLicense",
  // Async handler
  async ({ email, file }, thunkAPI) => {
    try {
      // Create form
      const form = new FormData();
      // Append license
      form.append("license", file);
      // Append email
      form.append("email", email);

      // POST request
      const res = await axios.post(`${ENV.SERVER_URL}/uploadLicense`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Return data
      return { ...res.data, email };
    } catch (err) {
      // Return error
      return thunkAPI.rejectWithValue(
        err.response?.data || "License upload failed"
      );
    }
  }
);

// Delete license
export const deleteLicense = createAsyncThunk(
  // Action name
  "companies/deleteLicense",
  // Async handler
  async (email, thunkAPI) => {
    try {
      // PUT request
      const res = await axios.put(`${ENV.SERVER_URL}/deleteLicense`, { email });
      // Return data
      return { ...res.data, email };
    } catch (err) {
      // Return error
      return thunkAPI.rejectWithValue(
        err.response?.data || "Failed to delete license"
      );
    }
  }
);

// Create slice
const companySlice = createSlice({
  // Slice name
  name: "companies",
  // Initial state
  initialState,
  // Reducers
  reducers: {
    // Reset state
    resetState: (state) => {
      // Reset loading
      state.isLoading = false;
      // Reset success
      state.isSuccess = false;
      // Reset error
      state.isError = false;
      // Clear message
      state.message = "";
      // Reset register flag
      state.registerSuccess = false;
      // Reset update flag
      state.updateSuccess = false;
    },
  },

  // Async reducers
  extraReducers: (builder) => {
    builder
      // Register loading
      .addCase(registerCompany.pending, (state) => {
        state.isLoading = true;
      })
      // Register success
      .addCase(registerCompany.fulfilled, (state, action) => {
        state.isLoading = false;
        state.company = action.payload;
        state.isSuccess = true;
        state.registerSuccess = true;
      })
      // Register error
      .addCase(registerCompany.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // Fetch success
      .addCase(fetchCompany.fulfilled, (state, action) => {
        state.company = action.payload;
      })

      // Update success
      .addCase(updateCompany.fulfilled, (state, action) => {
        state.company = action.payload;
        state.updateSuccess = true;
        state.message = "Profile updated";
      })

      // Upload success
      .addCase(uploadLicense.fulfilled, (state, action) => {
        state.company = {
          ...state.company,
          businessLicense: action.payload.businessLicense,
        };
      })

      // Delete success
      .addCase(deleteLicense.fulfilled, (state) => {
        state.company = { ...state.company, businessLicense: null };
      });
  },
});

// Export action
export const { resetState } = companySlice.actions;
// Export reducer
export default companySlice.reducer;
