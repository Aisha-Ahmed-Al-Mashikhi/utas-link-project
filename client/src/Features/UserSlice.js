// ===================== IMPORTS =====================
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import * as ENV from "../config";

// ===================== INITIAL STATE =====================
const initialState = {
  user: JSON.parse(localStorage.getItem("loggedUser")) || null,
  role: localStorage.getItem("role") || null,

  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
};

// ===================== REGISTER USER =====================
export const registerUser = createAsyncThunk(
  "users/registerUser",
  async (data, thunkAPI) => {
    try {
      const res = await axios.post(`${ENV.SERVER_URL}/registerUser`, data);
      return res.data.user;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || "Register failed");
    }
  }
);
// ===================== UPDATE STUDENT PROFILE =====================
export const updateStudent = createAsyncThunk(
  "users/updateStudent",
  async ({ email, data }, thunkAPI) => {
    try {
      const res = await axios.put(`${ENV.SERVER_URL}/updateStudent/${email}`, data);
      return res.data; // updated student
    } catch (err) {
      return thunkAPI.rejectWithValue("Update failed");
    }
  }
);

// ===================== LOGIN =====================
export const login = createAsyncThunk("users/login", async (data, thunkAPI) => {
  try {
    const res = await axios.post(`${ENV.SERVER_URL}/login`, data);
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data || "Login failed");
  }
});

// ===================== LOGOUT =====================
export const logout = createAsyncThunk("users/logout", async () => {
  localStorage.removeItem("loggedUser");
  localStorage.removeItem("role");
  return true;
});

// ===================== FETCH USER =====================
export const fetchUser = createAsyncThunk(
  "users/fetchUser",
  async (email, thunkAPI) => {
    try {
      const res = await axios.get(`${ENV.SERVER_URL}/user/${email}`);
      return res.data;
    } catch {
      return thunkAPI.rejectWithValue("Fetch failed");
    }
  }
);

// ===================== UPLOAD CV =====================
export const uploadCv = createAsyncThunk(
  "users/uploadCv",
  async ({ file, email }, thunkAPI) => {
    try {
      const form = new FormData();
      form.append("cv", file);
      form.append("email", email);

      const res = await axios.post(`${ENV.SERVER_URL}/uploadCV`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Return full URL to fix View button
      return `${ENV.SERVER_URL}${res.data.cvLink}`;
    } catch (err) {
      return thunkAPI.rejectWithValue("CV upload failed");
    }
  }
);

// ===================== DELETE CV =====================
export const deleteCvThunk = createAsyncThunk(
  "users/deleteCv",
  async (email, thunkAPI) => {
    try {
      await axios.put(`${ENV.SERVER_URL}/deleteCV`, { email });
      return true;
    } catch {
      return thunkAPI.rejectWithValue("CV delete failed");
    }
  }
);


// ===================== SLICE =====================
const userSlice = createSlice({
  name: "users",
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
      // REGISTER
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
.addCase(updateStudent.fulfilled, (state, action) => {
  state.user = action.payload; // update UI live
  state.isSuccess = true;
  state.message = "Profile updated";
})// UPDATE STUDENT


      // LOGIN
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;

        state.user = action.payload.user;
        state.role = action.payload.role;

        localStorage.setItem("loggedUser", JSON.stringify(action.payload.user));
        localStorage.setItem("role", action.payload.role);
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // LOGOUT
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.role = null;
      })

      // FETCH USER
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.user = action.payload;
      })

      // UPLOAD CV
      .addCase(uploadCv.fulfilled, (state, action) => {
  if (state.user) {
    state.user.cvLink = action.payload;
  }
})


      // DELETE CV
      .addCase(deleteCvThunk.fulfilled, (state) => {
        state.user.cvLink = null;
      })
  },
});

export const { resetState } = userSlice.actions;
export default userSlice.reducer;
