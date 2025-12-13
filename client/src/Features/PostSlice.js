// Redux helpers
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// HTTP client
import axios from "axios";
// Server URL
import { SERVER_URL } from "../config";

// Get user IP
const getIP = async () => {
  // Request IP
  const res = await axios.get("https://api.ipify.org?format=json");
  // Return IP
  return res.data.ip;
};

// Get geo location
const getGeo = async (ip) => {
  // Request location
  const res = await axios.get(`https://ipinfo.io/json?token=384ae3842ac4c9`);
  // Extract data
  const loc = res.data || {};

  // Return location
  return {
    country: loc.country || "",
    region: loc.region || "",
  };
};

// Fetch all posts
export const fetchPosts = createAsyncThunk(
  // Action name
  "posts/fetchPosts",
  // Async handler
  async () => {
    // GET request
    const res = await axios.get(`${SERVER_URL}/posts`);
    // Return posts
    return res.data;
  }
);

// Add post
export const addPost = createAsyncThunk(
  // Action name
  "posts/addPost",
  // Async handler
  async (postData) => {
    // Get IP
    const ip = await getIP();
    // Get location
    const geo = await getGeo(ip);

    // Build post
    const finalPost = {
      ...postData,
      location: geo,
    };

    // POST request
    const res = await axios.post(`${SERVER_URL}/addPost`, finalPost);
    // Return post
    return res.data;
  }
);

// Like post
export const likePost = createAsyncThunk(
  // Action name
  "posts/likePost",
  // Async handler
  async ({ postId, userId }) => {
    // PUT request
    const res = await axios.put(`${SERVER_URL}/likePost/${postId}`, { userId });
    // Return updated post
    return res.data.post;
  }
);

// Dislike post
export const dislikePost = createAsyncThunk(
  // Action name
  "posts/dislikePost",
  // Async handler
  async ({ postId, userId }) => {
    // PUT request
    const res = await axios.put(`${SERVER_URL}/dislikePost/${postId}`, {
      userId,
    });
    // Return updated post
    return res.data.post;
  }
);

// Fetch user posts
export const fetchUserPosts = createAsyncThunk(
  // Action name
  "posts/fetchUserPosts",
  // Async handler
  async (email) => {
    // GET request
    const res = await axios.get(`${SERVER_URL}/posts/user/${email}`);
    // Return posts
    return res.data;
  }
);

// Update post
export const updatePost = createAsyncThunk(
  // Action name
  "posts/updatePost",
  // Async handler
  async ({ id, postMsg }) => {
    // PUT request
    const res = await axios.put(`${SERVER_URL}/updatePost/${id}`, { postMsg });
    // Return post
    return res.data;
  }
);

// Delete post
export const deletePost = createAsyncThunk(
  // Action name
  "posts/deletePost",
  // Async handler
  async (id) => {
    // DELETE request
    await axios.delete(`${SERVER_URL}/deletePost/${id}`);
    // Return id
    return id;
  }
);

// Create slice
const postSlice = createSlice({
  // Slice name
  name: "posts",
  // Initial state
  initialState: {
    // All posts
    posts: [],
    // User posts
    myPosts: [],
    // Status flag
    status: "idle",
    // Error holder
    error: null,
  },

  // Local reducers
  reducers: {},

  // Async reducers
  extraReducers: (builder) => {
    builder

      // Fetch posts
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.posts = action.payload;
      })

      // Add post
      .addCase(addPost.fulfilled, (state, action) => {
        state.posts.unshift(action.payload);
        state.myPosts.unshift(action.payload);
      })

      // Like post
      .addCase(likePost.fulfilled, (state, action) => {
        const i = state.posts.findIndex((p) => p._id === action.payload._id);
        if (i !== -1) state.posts[i] = action.payload;
      })

      // Dislike post
      .addCase(dislikePost.fulfilled, (state, action) => {
        const i = state.posts.findIndex((p) => p._id === action.payload._id);
        if (i !== -1) state.posts[i] = action.payload;
      })

      // Fetch my posts
      .addCase(fetchUserPosts.fulfilled, (state, action) => {
        state.myPosts = action.payload;
      })

      // Update post
      .addCase(updatePost.fulfilled, (state, action) => {
        const i = state.myPosts.findIndex((p) => p._id === action.payload._id);
        if (i !== -1) state.myPosts[i] = action.payload;
      })

      // Delete post
      .addCase(deletePost.fulfilled, (state, action) => {
        state.myPosts = state.myPosts.filter((p) => p._id !== action.payload);
        state.posts = state.posts.filter((p) => p._id !== action.payload);
      });
  },
});

// Export reducer
export default postSlice.reducer;
