// Redux helpers
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// HTTP client
import axios from "axios";
// Server config
import * as ENV from "../config";

// Initial state
const initialState = {
  // Logged user
  user: JSON.parse(localStorage.getItem("loggedUser")) || null,
  // User role
  role: localStorage.getItem("role") || null,

  // Loading flag
  isLoading: false,
  // Success flag
  isSuccess: false,
  // Error flag
  isError: false,
  // Message holder
  message: "",

  // Register success
  registerSuccess: false,
  // Login success
  loginSuccess: false,
  // Update success
  updateSuccess: false,
};

// Register user
export const registerUser = createAsyncThunk(
  // Action name
  "users/registerUser",
  // Async handler
  async (data, thunkAPI) => {
    try {
      // POST request
      const res = await axios.post(`${ENV.SERVER_URL}/registerUser`, data);
      // Return user
      return res.data.user;
    } catch (err) {
      // Return error
      return thunkAPI.rejectWithValue(err.response?.data || "Register failed");
    }
  }
);

// Update student
export const updateStudent = createAsyncThunk(
  // Action name
  "users/updateStudent",
  // Async handler
  async ({ email, data }, thunkAPI) => {
    try {
      // PUT request
      const res = await axios.put(
        `${ENV.SERVER_URL}/updateStudent/${email}`,
        data
      );
      // Return user
      return res.data;
    } catch (err) {
      // Return error
      return thunkAPI.rejectWithValue("Update failed");
    }
  }
);

// Login user
export const login = createAsyncThunk(
  // Action name
  "users/login",
  // Async handler
  async (data, thunkAPI) => {
    try {
      // POST request
      const res = await axios.post(`${ENV.SERVER_URL}/login`, data);
      // Return data
      return res.data;
    } catch (err) {
      // Return error
      return thunkAPI.rejectWithValue(err.response?.data || "Login failed");
    }
  }
);

// Logout user
export const logout = createAsyncThunk(
  // Action name
  "users/logout",
  // Async handler
  async () => {
    // Clear user
    localStorage.removeItem("loggedUser");
    // Clear role
    localStorage.removeItem("role");
    // Return success
    return true;
  }
);

// Fetch user
export const fetchUser = createAsyncThunk(
  // Action name
  "users/fetchUser",
  // Async handler
  async (email, thunkAPI) => {
    try {
      // GET request
      const res = await axios.get(`${ENV.SERVER_URL}/user/${email}`);
      // Return user
      return res.data;
    } catch {
      // Return error
      return thunkAPI.rejectWithValue("Fetch failed");
    }
  }
);

// Upload CV
export const uploadCv = createAsyncThunk(
  // Action name
  "users/uploadCv",
  // Async handler
  async ({ file, email }, thunkAPI) => {
    try {
      // Create form
      const form = new FormData();
      // Append file
      form.append("cv", file);
      // Append email
      form.append("email", email);

      // POST request
      const res = await axios.post(`${ENV.SERVER_URL}/uploadCV`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Return CV link
      return `${ENV.SERVER_URL}${res.data.cvLink}`;
    } catch (err) {
      // Return error
      return thunkAPI.rejectWithValue("CV upload failed");
    }
  }
);

// Delete CV
export const deleteCvThunk = createAsyncThunk(
  // Action name
  "users/deleteCv",
  // Async handler
  async (email, thunkAPI) => {
    try {
      // PUT request
      await axios.put(`${ENV.SERVER_URL}/deleteCV`, { email });
      // Return success
      return true;
    } catch {
      // Return error
      return thunkAPI.rejectWithValue("CV delete failed");
    }
  }
);

// Create slice
const userSlice = createSlice({
  // Slice name
  name: "users",
  // Initial state
  initialState,
  // Local reducers
  reducers: {
    // Reset flags
    resetState: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = "";

      state.registerSuccess = false;
      state.loginSuccess = false;
      state.updateSuccess = false;
    },
  },

  // Async reducers
  extraReducers: (builder) => {
    builder
      // Register loading
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
      })
      // Register success
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.registerSuccess = true;
        state.user = action.payload;
      })
      // Register error
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // Update student
      .addCase(updateStudent.fulfilled, (state, action) => {
        state.user = action.payload;
        state.updateSuccess = true;
        state.message = "Profile updated";
      })

      // Login loading
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      // Login success
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.loginSuccess = true;

        state.user = action.payload.user;
        state.role = action.payload.role;

        localStorage.setItem("loggedUser", JSON.stringify(action.payload.user));
        localStorage.setItem("role", action.payload.role);
      })
      // Login error
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.role = null;
      })

      // Fetch user
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.user = action.payload;
      })

      // Upload CV
      .addCase(uploadCv.fulfilled, (state, action) => {
        if (state.user) {
          state.user.cvLink = action.payload;
        }
      })

      // Delete CV
      .addCase(deleteCvThunk.fulfilled, (state) => {
        if (state.user) {
          state.user.cvLink = null;
        }
      });
  },
});

// Export action
export const { resetState } = userSlice.actions;
// Export reducer
export default userSlice.reducer;
