// Redux helpers
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// Axios client
import axios from "axios";
// Server config
import * as ENV from "../config";

// Fetch chat messages
export const fetchMessages = createAsyncThunk(
  // Action name
  "chat/fetchMessages",
  // Async handler
  async (applicationId) => {
    // GET request
    const res = await axios.get(`${ENV.SERVER_URL}/chat/${applicationId}`);
    // Return messages
    return res.data;
  }
);

// Send chat message
export const sendMessage = createAsyncThunk(
  // Action name
  "chat/sendMessage",
  // Async handler
  async (msgData) => {
    // POST request
    const res = await axios.post(`${ENV.SERVER_URL}/chat`, msgData);
    // Return message
    return res.data;
  }
);

// Create chat slice
const chatSlice = createSlice({
  // Slice name
  name: "chat",
  // Initial state
  initialState: {
    // Messages list
    messages: [],
  },

  // Local reducers
  reducers: {},

  // Async reducers
  extraReducers: (builder) => {
    builder
      // Fetch success
      .addCase(fetchMessages.fulfilled, (state, action) => {
        // Set messages
        state.messages = action.payload;
      })
      // Send success
      .addCase(sendMessage.fulfilled, (state, action) => {
        // Add message
        state.messages.push(action.payload);
      });
  },
});

// Export reducer
export default chatSlice.reducer;
