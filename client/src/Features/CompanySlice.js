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
    UPLOAD PROFILE PICTURE
============================= */
export const uploadProfile = createAsyncThunk(
  "companies/uploadProfile",
  async ({ email, file }, thunkAPI) => {
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("email", email);
      form.append("type", "profile");

      const res = await axios.post(
        `${ENV.SERVER_URL}/uploadCompanyFile`,
        form,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      return res.data.company;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || "Profile upload failed"
      );
    }
  }
);

/* =============================
    UPLOAD LICENSE PDF
============================= */
export const uploadLicense = createAsyncThunk(
  "companies/uploadLicense",
  async ({ email, file }, thunkAPI) => {
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("email", email);
      form.append("type", "license");

     const res = await axios.post(
  `${ENV.SERVER_URL}/uploadCompanyLicense`,
  form,
  { headers: { "Content-Type": "multipart/form-data" } }
);


      return res.data.company;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || "License upload failed"
      );
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
      const res = await axios.put(`${ENV.SERVER_URL}/company/deleteLicense`, {
        email,
      });

      return res.data.company;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || "Failed to delete license"
      );
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

      /* FETCH COMPANY */
      .addCase(fetchCompany.fulfilled, (state, action) => {
        state.company = action.payload;
      })

      /* UPLOAD PROFILE */
      .addCase(uploadProfile.fulfilled, (state, action) => {
        state.company = action.payload;
      })

      /* UPLOAD LICENSE */
      .addCase(uploadLicense.fulfilled, (state, action) => {
        state.company = action.payload;
      })

      /* DELETE LICENSE */
      .addCase(deleteLicense.fulfilled, (state, action) => {
        state.company = action.payload;
      });
  },
});

export const { resetState } = companySlice.actions;
export default companySlice.reducer;
