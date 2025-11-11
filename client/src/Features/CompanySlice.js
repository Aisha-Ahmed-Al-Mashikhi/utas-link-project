import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  company: {},
  isLoading: false,
  isSuccess: false,
  isError: false,
};

// Register company
export const registerCompany = createAsyncThunk(
  "companies/registerCompany",
  async (companyData, thunkAPI) => {
    try {
      const res = await axios.post(
        "http://localhost:3001/registerCompany",
        companyData
      );
      return res.data.company;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || "Server error");
    }
  }
);

// Fetch company by email
export const fetchCompany = createAsyncThunk(
  "companies/fetchCompany",
  async (email, thunkAPI) => {
    try {
      const res = await axios.get(`http://localhost:3001/company/${email}`);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || "Fetch error");
    }
  }
);

// Update bank info
export const updateBankInfo = createAsyncThunk(
  "companies/updateBankInfo",
  async ({ email, bankData }, thunkAPI) => {
    try {
      const res = await axios.post(
        `http://localhost:3001/company/${email}/bank`,
        bankData
      );
      return res.data.company;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || "Failed to update bank info"
      );
    }
  }
);

const companySlice = createSlice({
  name: "companies",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registerCompany.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerCompany.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.company = action.payload;
      })
      .addCase(registerCompany.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })
      .addCase(fetchCompany.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.company = action.payload;
      })
      .addCase(fetchCompany.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })
      .addCase(updateBankInfo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.company = action.payload;
      })
      .addCase(updateBankInfo.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      });
  },
});

export default companySlice.reducer;
