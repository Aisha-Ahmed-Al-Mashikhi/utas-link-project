// ===================== IMPORTS =====================
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import * as ENV from "../config";

// ===================== INITIAL STATE =====================
const initialState = {
  company: {},

  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",

  // 🔥 separated success flags
  registerSuccess: false,
  updateSuccess: false,
};

// ===================== REGISTER COMPANY =====================
export const registerCompany = createAsyncThunk(
  "companies/registerCompany",
  async (companyData, thunkAPI) => {
    try {
      const res = await axios.post(
        `${ENV.SERVER_URL}/registerCompany`,
        companyData
      );
      return res.data.company;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || "Server error"
      );
    }
  }
);

// ===================== FETCH COMPANY =====================
export const fetchCompany = createAsyncThunk(
  "companies/fetchCompany",
  async (email, thunkAPI) => {
    try {
      const res = await axios.get(`${ENV.SERVER_URL}/company/${email}`);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || "Fetch error"
      );
    }
  }
);

// ===================== UPDATE COMPANY =====================
export const updateCompany = createAsyncThunk(
  "companies/updateCompany",
  async ({ email, data }, thunkAPI) => {
    try {
      const res = await axios.put(
        `${ENV.SERVER_URL}/updateCompany/${email}`,
        data
      );
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || "Update error"
      );
    }
  }
);

// ===================== UPLOAD LICENSE =====================
export const uploadLicense = createAsyncThunk(
  "companies/uploadLicense",
  async ({ email, file }, thunkAPI) => {
    try {
      const form = new FormData();
      form.append("license", file);
      form.append("email", email);

      const res = await axios.post(`${ENV.SERVER_URL}/uploadLicense`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      return { ...res.data, email };
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || "License upload failed"
      );
    }
  }
);

// ===================== DELETE LICENSE =====================
export const deleteLicense = createAsyncThunk(
  "companies/deleteLicense",
  async (email, thunkAPI) => {
    try {
      const res = await axios.put(`${ENV.SERVER_URL}/deleteLicense`, { email });
      return { ...res.data, email };
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || "Failed to delete license"
      );
    }
  }
);

// ===================== SLICE =====================
const companySlice = createSlice({
  name: "companies",
  initialState,
  reducers: {
    resetState: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = "";

      state.registerSuccess = false;
      state.updateSuccess = false;
    },
  },

  extraReducers: (builder) => {
    builder
      // ================= REGISTER =================
      .addCase(registerCompany.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerCompany.fulfilled, (state, action) => {
        state.isLoading = false;
        state.company = action.payload;
        state.isSuccess = true;
        state.registerSuccess = true; // 🔥
      })
      .addCase(registerCompany.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // ================= FETCH =================
      .addCase(fetchCompany.fulfilled, (state, action) => {
        state.company = action.payload;
      })

      // ================= UPDATE =================
      .addCase(updateCompany.fulfilled, (state, action) => {
        state.company = action.payload;
        state.updateSuccess = true;
        state.message = "Profile updated";
      })

      // ================= UPLOAD LICENSE =================
      .addCase(uploadLicense.fulfilled, (state, action) => {
        state.company = {
          ...state.company,
          businessLicense: action.payload.businessLicense,
        };
      })

      // ================= DELETE LICENSE =================
      .addCase(deleteLicense.fulfilled, (state) => {
        state.company = { ...state.company, businessLicense: null };
      });
  },
});

export const { resetState } = companySlice.actions;
export default companySlice.reducer;
