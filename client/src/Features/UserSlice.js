import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import * as ENV from "../config";

const initialState = {
  users: [],
  user: {},
  isLoading: false,
  isSuccess: false,
  isError: false,
};

// Register
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

// Login
export const login = createAsyncThunk("users/login", async (data, thunkAPI) => {
  try {
    const res = await axios.post(`${ENV.SERVER_URL}/login`, data);
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data || "Login failed");
  }
});

// Fetch single user
export const fetchUser = createAsyncThunk("users/fetchUser", async (email) => {
  const res = await axios.get(`${ENV.SERVER_URL}/user/${email}`);
  return res.data;
});

// Logout
export const logout = createAsyncThunk("users/logout", async () => true);

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    deleteUser: (state, action) => {
      state.users = state.users.filter((u) => u.email !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.fulfilled, (s, a) => {
        s.user = a.payload;
      })
      .addCase(login.fulfilled, (s, a) => {
        s.user = a.payload.user;
        s.user.role = a.payload.role;
      })
      .addCase(fetchUser.fulfilled, (s, a) => {
        s.user = { ...s.user, ...a.payload };
      })
      .addCase(logout.fulfilled, (s) => {
        s.user = {};
      });
  },
});

export const { deleteUser } = userSlice.actions;
export default userSlice.reducer;
