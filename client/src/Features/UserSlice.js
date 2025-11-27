// Redux Toolkit functions
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// Axios for API requests
import axios from "axios";

// ENV file contains SERVER_URL
import * as ENV from "../config";

// -----------------------------------------
// Initial global state
// -----------------------------------------
const initialState = {
  user: JSON.parse(localStorage.getItem("loggedUser")) || null,
  role: localStorage.getItem("role") || null,

  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
};

// -----------------------------------------
// REGISTER USER (Student)
// -----------------------------------------
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

// -----------------------------------------
// LOGIN USER (Student OR Company)
// -----------------------------------------
export const login = createAsyncThunk("users/login", async (data, thunkAPI) => {
  try {
    const res = await axios.post(`${ENV.SERVER_URL}/login`, data);
    return res.data; // { user, role }
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data || "Login failed");
  }
});

// -----------------------------------------
// LOGOUT
// -----------------------------------------
export const logout = createAsyncThunk("users/logout", async () => {
  localStorage.removeItem("loggedUser");
  localStorage.removeItem("role");
  return true;
});

// -----------------------------------------
// FETCH USER (For Profile Page)
// -----------------------------------------
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

// -------------------------------
// UPLOAD CV (Profile)
// -------------------------------
export const uploadCv = createAsyncThunk(
  "users/uploadCv",
  async ({ file, email }, thunkAPI) => {
    try {
      const form = new FormData();
      form.append("cv", file);
      form.append("email", email);

      const res = await axios.post(
        `${ENV.SERVER_URL}/uploadCV`,
        form,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // return full server URL for correct viewing
      return `${ENV.SERVER_URL}${res.data.cvLink}`;
    } catch (err) {
      return thunkAPI.rejectWithValue("CV upload failed");
    }
  }
);



// -----------------------------------------
// DELETE CV (Profile)
// -----------------------------------------
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

// -----------------------------------------
// UPDATE BANK CARD (Profile)
// -----------------------------------------
export const updateBankCardThunk = createAsyncThunk(
  "users/updateBankCard",
  async (data, thunkAPI) => {
    try {
      const res = await axios.put(`${ENV.SERVER_URL}/updateBankCard`, data);
      return res.data.user; // updated user returned
    } catch {
      return thunkAPI.rejectWithValue("Bank update failed");
    }
  }
);

// -----------------------------------------
// DELETE BANK CARD (Profile)
// -----------------------------------------
export const deleteBankCardThunk = createAsyncThunk(
  "users/deleteBankCard",
  async (email, thunkAPI) => {
    try {
      const res = await axios.put(`${ENV.SERVER_URL}/updateBankCard`, {
        email,
        bankName: "",
        cardNumber: "",
        cardName: "",
        expiry: "",
        cvv: "",
      });

      return res.data.user;
    } catch {
      return thunkAPI.rejectWithValue("Delete bank failed");
    }
  }
);

// -----------------------------------------
// Slice
// -----------------------------------------
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

      // FETCH USER (Profile)
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.user = action.payload;
      })

      // UPLOAD CV
      .addCase(uploadCv.fulfilled, (state, action) => {
        state.user.cvLink = action.payload;
      })

      // DELETE CV
      .addCase(deleteCvThunk.fulfilled, (state) => {
        state.user.cvLink = null;
      })

      // UPDATE BANK
      .addCase(updateBankCardThunk.fulfilled, (state, action) => {
        state.user = action.payload;
      })

      // DELETE BANK CARD
      .addCase(deleteBankCardThunk.fulfilled, (state, action) => {
        state.user = action.payload;
      });
  },
});

export const { resetState } = userSlice.actions;
export default userSlice.reducer;
