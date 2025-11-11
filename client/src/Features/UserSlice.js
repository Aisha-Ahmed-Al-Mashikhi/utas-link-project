import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  users: [],
  user: {},
  isLoading: false,
  isSuccess: false,
  isError: false,
};

// Register new user
export const registerUser = createAsyncThunk(
  "users/registerUser",
  async (data, thunkAPI) => {
    try {
      const res = await axios.post("http://localhost:3001/registerUser", data);
      if (!res.data || !res.data.user)
        return thunkAPI.rejectWithValue(res.data?.error || "User not returned");
      return res.data.user;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || "Error");
    }
  }
);

// Login user
export const login = createAsyncThunk("users/login", async (data, thunkAPI) => {
  try {
    const res = await axios.post("http://localhost:3001/login", data);
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data || "Login failed");
  }
});

// Fetch user by email
export const fetchUser = createAsyncThunk("users/fetchUser", async (email) => {
  const res = await axios.get(`http://localhost:3001/user/${email}`);
  return res.data;
});

// Logout (client-side only)
export const logout = createAsyncThunk("users/logout", async () => true);

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    deleteUser: (s, a) => {
      s.users = s.users.filter((u) => u.email !== a.payload);
    },
  },
  extraReducers: (b) => {
    b
      // Register
      .addCase(registerUser.pending, (s) => {
        s.isLoading = true;
      })
      .addCase(registerUser.fulfilled, (s, a) => {
        s.isLoading = false;
        s.isSuccess = true;
        s.user = a.payload;
      })
      .addCase(registerUser.rejected, (s) => {
        s.isLoading = false;
        s.isError = true;
      })

      // Login
      .addCase(login.pending, (s) => {
        s.isLoading = true;
      })
      .addCase(login.fulfilled, (s, a) => {
        s.isLoading = false;
        s.isSuccess = true;
        s.user = a.payload.user;
        s.user.role = a.payload.role;
      })
      .addCase(login.rejected, (s) => {
        s.isLoading = false;
        s.isError = true;
      })

      // Fetch user
      .addCase(fetchUser.pending, (s) => {
        s.isLoading = true;
      })
      .addCase(fetchUser.fulfilled, (s, a) => {
        s.isLoading = false;
        s.isError = false;
        const prev = s.user || {};
        const incoming = a.payload || {};
        s.user = { ...prev, ...incoming, role: incoming.role ?? prev.role };
      })
      .addCase(fetchUser.rejected, (s) => {
        s.isLoading = false;
        s.isError = true;
      })

      // Logout
      .addCase(logout.fulfilled, (s) => {
        s.user = {};
        s.isSuccess = false;
      });
  },
});

export const { deleteUser } = userSlice.actions;
export default userSlice.reducer;
