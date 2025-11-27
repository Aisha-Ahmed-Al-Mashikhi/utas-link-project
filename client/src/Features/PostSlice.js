import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { SERVER_URL } from "../config";

// ==================== FETCH ALL POSTS ====================
export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
  const res = await axios.get(`${SERVER_URL}/posts`);
  return res.data;
});

// ==================== ADD POST ====================
export const addPost = createAsyncThunk("posts/addPost", async (postData) => {
  const res = await axios.post(`${SERVER_URL}/addPost`, postData);
  return res.data;
});

// ==================== LIKE POST ====================
export const likePost = createAsyncThunk(
  "posts/likePost",
  async ({ postId, userId }) => {
    const res = await axios.put(`${SERVER_URL}/likePost/${postId}`, {
      userId,
    });
    return res.data.post;
  }
);

// ==================== DISLIKE POST ====================
export const dislikePost = createAsyncThunk(
  "posts/dislikePost",
  async ({ postId, userId }) => {
    const res = await axios.put(`${SERVER_URL}/dislikePost/${postId}`, {
      userId,
    });
    return res.data.post;
  }
);

// ==================== SLICE ====================
const postSlice = createSlice({
  name: "posts",
  initialState: {
    posts: [],
    status: "idle",
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      // FETCH
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.posts = action.payload;
      })

      // ADD
      .addCase(addPost.fulfilled, (state, action) => {
        state.posts.unshift(action.payload);
      })

      // LIKE
      .addCase(likePost.fulfilled, (state, action) => {
        const index = state.posts.findIndex(
          (p) => p._id === action.payload._id
        );
        if (index !== -1) state.posts[index] = action.payload;
      })

      // DISLIKE
      .addCase(dislikePost.fulfilled, (state, action) => {
        const index = state.posts.findIndex(
          (p) => p._id === action.payload._id
        );
        if (index !== -1) state.posts[index] = action.payload;
      });
  },
});

export default postSlice.reducer;
