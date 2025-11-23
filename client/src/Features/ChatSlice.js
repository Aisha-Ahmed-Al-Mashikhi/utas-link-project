import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import * as ENV from "../config";

export const fetchMessages = createAsyncThunk(
  "chat/fetchMessages",
  async (applicationId) => {
    const res = await axios.get(`${ENV.SERVER_URL}/chat/${applicationId}`);
    return res.data;
  }
);

export const sendMessage = createAsyncThunk(
  "chat/sendMessage",
  async (msgData) => {
    const res = await axios.post(`${ENV.SERVER_URL}/chat/send`, msgData);
    return res.data;
  }
);

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    messages: [],
    isLoading: false,
  },

  reducers: {
    addIncomingMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    clearChat: (state) => {
      state.messages = [];
    },
  },

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

export const { addIncomingMessage, clearChat } = chatSlice.actions;
export default chatSlice.reducer;
