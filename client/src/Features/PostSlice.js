import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { SERVER_URL } from "../config";

/*───────────────────────────────────────────────
 ░░ INTERNAL — GET USER IP (HTTPS)
───────────────────────────────────────────────*/
const getIP = async () => {
  const res = await axios.get("https://api.ipify.org?format=json");
  return res.data.ip;
};

/*───────────────────────────────────────────────
 ░░ INTERNAL — GET GEO LOCATION (FREE + HTTPS)
───────────────────────────────────────────────*/
const getGeo = async () => {
  const res = await axios.get("https://freegeoip.app/json/");
  return {
    country: res.data.country_name || "",
    region: res.data.region_name || "",
  };
};

/*───────────────────────────────────────────────
 ░░ FETCH ALL POSTS
───────────────────────────────────────────────*/
export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
  const res = await axios.get(`${SERVER_URL}/posts`);
  return res.data;
});

/*───────────────────────────────────────────────
 ░░ ADD NEW POST (WITH AUTO LOCATION)
───────────────────────────────────────────────*/
export const addPost = createAsyncThunk("posts/addPost", async (postData) => {
  const ip = await getIP();
  const geo = await getGeo(ip);

  const finalPost = {
    ...postData,
    location: geo,
  };

  const res = await axios.post(`${SERVER_URL}/addPost`, finalPost);
  return res.data;
});

/*───────────────────────────────────────────────
 ░░ LIKE POST
───────────────────────────────────────────────*/
export const likePost = createAsyncThunk(
  "posts/likePost",
  async ({ postId, userId }) => {
    const res = await axios.put(`${SERVER_URL}/likePost/${postId}`, {
      userId,
    });
    return res.data.post;
  }
);

/*───────────────────────────────────────────────
 ░░ DISLIKE POST
───────────────────────────────────────────────*/
export const dislikePost = createAsyncThunk(
  "posts/dislikePost",
  async ({ postId, userId }) => {
    const res = await axios.put(`${SERVER_URL}/dislikePost/${postId}`, {
      userId,
    });
    return res.data.post;
  }
);

/*───────────────────────────────────────────────
 ░░ FETCH USER POSTS
───────────────────────────────────────────────*/
export const fetchUserPosts = createAsyncThunk(
  "posts/fetchUserPosts",
  async (email) => {
    const res = await axios.get(`${SERVER_URL}/posts/user/${email}`);
    return res.data;
  }
);

/*───────────────────────────────────────────────
 ░░ UPDATE POST
───────────────────────────────────────────────*/
export const updatePost = createAsyncThunk(
  "posts/updatePost",
  async ({ id, postMsg }) => {
    const res = await axios.put(`${SERVER_URL}/updatePost/${id}`, { postMsg });
    return res.data;
  }
);

/*───────────────────────────────────────────────
 ░░ DELETE POST
───────────────────────────────────────────────*/
export const deletePost = createAsyncThunk("posts/deletePost", async (id) => {
  await axios.delete(`${SERVER_URL}/deletePost/${id}`);
  return id;
});

/*───────────────────────────────────────────────
 ░░ SLICE
───────────────────────────────────────────────*/
const postSlice = createSlice({
  name: "posts",
  initialState: {
    posts: [],
    myPosts: [],
    status: "idle",
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder

      /* FETCH POSTS */
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.posts = action.payload;
      })

      /* ADD POST */
      .addCase(addPost.fulfilled, (state, action) => {
        state.posts.unshift(action.payload);
        state.myPosts.unshift(action.payload);
      })

      /* LIKE */
      .addCase(likePost.fulfilled, (state, action) => {
        const index = state.posts.findIndex(
          (p) => p._id === action.payload._id
        );
        if (index !== -1) state.posts[index] = action.payload;
      })

      /* DISLIKE */
      .addCase(dislikePost.fulfilled, (state, action) => {
        const index = state.posts.findIndex(
          (p) => p._id === action.payload._id
        );
        if (index !== -1) state.posts[index] = action.payload;
      })

      /* FETCH MY POSTS */
      .addCase(fetchUserPosts.fulfilled, (state, action) => {
        state.myPosts = action.payload;
      })

      /* UPDATE POST */
      .addCase(updatePost.fulfilled, (state, action) => {
        const index = state.myPosts.findIndex(
          (p) => p._id === action.payload._id
        );
        if (index !== -1) state.myPosts[index] = action.payload;
      })

      /* DELETE POST */
      .addCase(deletePost.fulfilled, (state, action) => {
        state.myPosts = state.myPosts.filter((p) => p._id !== action.payload);
        state.posts = state.posts.filter((p) => p._id !== action.payload);
      });
  },
});

export default postSlice.reducer;
