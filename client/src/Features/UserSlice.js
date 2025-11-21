// Redux Toolkit: createSlice creates reducers + actions, createAsyncThunk handles async API logic
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// Axios: HTTP client used to send API requests (GET, POST, PUT, DELETE)
import axios from "axios";
// Config file: contains environment values such as SERVER_URL for backend API routes
import * as ENV from "../config";

// Initial Global User State
const initialState = {
  // Restore user and role from localStorage on app load
  user: JSON.parse(localStorage.getItem("loggedUser")) || null,
  role: localStorage.getItem("role") || null,

  // UI status controls
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
};

// REGISTER USER
export const registerUser = createAsyncThunk(
  "users/registerUser",
  async (data, thunkAPI) => {
    try {
      const res = await axios.post(`${ENV.SERVER_URL}/registerUser`, data);
      return res.data.user;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || "Error");
    }
  }
);

// LOGIN USER
export const login = createAsyncThunk("users/login", async (data, thunkAPI) => {
  try {
    const res = await axios.post(`${ENV.SERVER_URL}/login`, data);
    return res.data; // contains { user, role }
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data || "Login failed");
  }
});

// FETCH ONE USER
export const fetchUser = createAsyncThunk(
  "users/fetchUser",
  async (email, thunkAPI) => {
    try {
      const res = await axios.get(`${ENV.SERVER_URL}/user/${email}`);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || "Fetch failed");
    }
  }
);

// LOGOUT
export const logout = createAsyncThunk("users/logout", async () => {
  localStorage.removeItem("loggedUser");
  localStorage.removeItem("role");
  return true;
});

// USER SLICE
const userSlice = createSlice({
  name: "users",
  initialState,

  reducers: {
    // Restore user data if needed (optional)
    restoreUser: (state) => {
      state.user = JSON.parse(localStorage.getItem("loggedUser")) || null;
      state.role = localStorage.getItem("role") || null;
    },

    // Clear flags
    resetState: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = "";
    },
  },

  // EXTRA REDUCERS (Async logic)
  extraReducers: (builder) => {
    builder

      // ---------- REGISTER ----------
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isSuccess = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // ---------- LOGIN ----------
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;

        // Save logged user + role
        state.user = action.payload.user;
        state.role = action.payload.role;

        state.isSuccess = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // ---------- FETCH USER ----------
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.user = action.payload; // override properly
      })

      // ---------- LOGOUT ----------
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.role = null;
        state.isLoading = false;
        state.isSuccess = false;
      });
  },
});

// Export actions
export const { restoreUser, resetState } = userSlice.actions;

// Export reducer
export default userSlice.reducer;
