// src/Features/CompanySlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import * as ENV from "../config";

const initialState = {
  company: {},
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
};

/* =============================
    REGISTER COMPANY
============================= */
export const registerCompany = createAsyncThunk(
  "companies/registerCompany",
  async (companyData, thunkAPI) => {
    try {
      const res = await axios.post(`${ENV.SERVER_URL}/registerCompany`, companyData);
      return res.data.company;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || "Server error");
    }
  }
);

/* =============================
    FETCH COMPANY
============================= */
export const fetchCompany = createAsyncThunk(
  "companies/fetchCompany",
  async (email, thunkAPI) => {
    try {
      const res = await axios.get(`${ENV.SERVER_URL}/company/${email}`);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || "Fetch error");
    }
  }
);

/* =============================
    UPDATE COMPANY PROFILE ✔
============================= */
export const updateCompany = createAsyncThunk(
  "companies/updateCompany",
  async ({ email, data }, thunkAPI) => {
    try {
      const res = await axios.put(`${ENV.SERVER_URL}/updateCompany/${email}`, data);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || "Update error");
    }
  }
);

/* =============================
    UPLOAD LICENSE (PDF)
============================= */
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
      return thunkAPI.rejectWithValue(err.response?.data || "License upload failed");
    }
  }
);

/* =============================
    DELETE LICENSE
============================= */
export const deleteLicense = createAsyncThunk(
  "companies/deleteLicense",
  async (email, thunkAPI) => {
    try {
      const res = await axios.put(`${ENV.SERVER_URL}/deleteLicense`, { email });
      return { ...res.data, email };
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || "Failed to delete license");
    }
  }
);

/* =============================
        SLICE
============================= */
const companySlice = createSlice({
  name: "companies",
  initialState,
  reducers: {
    resetState: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = "";
    },
  },

  extraReducers: (builder) => {
    builder
      /* REGISTER */
      .addCase(registerCompany.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerCompany.fulfilled, (state, action) => {
        state.isLoading = false;
        state.company = action.payload;
        state.isSuccess = true;
      })
      .addCase(registerCompany.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      /* FETCH */
      .addCase(fetchCompany.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCompany.fulfilled, (state, action) => {
        state.isLoading = false;
        state.company = action.payload;
      })
      .addCase(fetchCompany.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      /* UPDATE COMPANY ✔ */
      .addCase(updateCompany.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateCompany.fulfilled, (state, action) => {
        state.isLoading = false;
        state.company = action.payload; // update UI
        state.isSuccess = true;
      })
      .addCase(updateCompany.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      /* UPLOAD LICENSE */
      .addCase(uploadLicense.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(uploadLicense.fulfilled, (state, action) => {
        state.isLoading = false;
        state.company = {
          ...state.company,
          businessLicense: action.payload.businessLicense,
        };
      })
      .addCase(uploadLicense.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      /* DELETE LICENSE */
      .addCase(deleteLicense.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteLicense.fulfilled, (state) => {
        state.isLoading = false;
        state.company = { ...state.company, businessLicense: null };
      })
      .addCase(deleteLicense.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { resetState } = companySlice.actions;
export default companySlice.reducer;
