import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import * as ENV from "../config";

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
        `${ENV.SERVER_URL}/registerCompany`,
        companyData
      );
      return res.data.company;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || "Server error");
    }
  }
);

// Fetch company
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

// Update bank info
export const updateBankInfo = createAsyncThunk(
  "companies/updateBankInfo",
  async ({ email, bankData }, thunkAPI) => {
    try {
      const res = await axios.post(
        `${ENV.SERVER_URL}/company/${email}/bank`,
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
      .addCase(registerCompany.fulfilled, (state, action) => {
        state.company = action.payload;
      })
      .addCase(fetchCompany.fulfilled, (state, action) => {
        state.company = action.payload;
      })
      .addCase(updateBankInfo.fulfilled, (state, action) => {
        state.company = action.payload;
      });
  },
});

export default companySlice.reducer;
