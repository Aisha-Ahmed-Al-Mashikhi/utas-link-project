import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import * as ENV from "../config";

// GET all messages
export const fetchMessages = createAsyncThunk(
  "chat/fetchMessages",
  async (applicationId) => {
    const res = await axios.get(`${ENV.SERVER_URL}/chat/${applicationId}`);
    return res.data;
  }
);

// POST new message
export const sendMessage = createAsyncThunk(
  "chat/sendMessage",
  async (messageData) => {
    const res = await axios.post(`${ENV.SERVER_URL}/chat`, messageData);
    return res.data;
  }
);

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    messages: [],
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.messages = action.payload;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.messages.push(action.payload);
      });
  },
});

export default chatSlice.reducer;
