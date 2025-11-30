import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";

import {
  addPost,
  fetchUserPosts,
  updatePost,
  deletePost,
} from "../Features/PostSlice";

import "../Styles/CreatePost.css";

const CreatePost = () => {
  const [postMsg, setPostMsg] = useState("");
  const [ip, setIp] = useState(null);
  const [geo, setGeo] = useState(null);

  const [editMode, setEditMode] = useState(null);
  const [editText, setEditText] = useState("");

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.users);
  const { myPosts } = useSelector((state) => state.posts);

  /* GET USER POSTS */
  useEffect(() => {
    if (user?.email) {
      dispatch(fetchUserPosts(user.email));
    }
  }, [dispatch, user]);

  /* GET IP */
  useEffect(() => {
    axios.get("https://api.ipify.org?format=json").then((res) => {
      setIp(res.data.ip);
    });
  }, []);

  /* GET LOCATION */
  useEffect(() => {
    if (!ip) return;
    axios.get(`http://ip-api.com/json/${ip}`).then((res) => {
      setGeo(res.data);
    });
  }, [ip]);

  /* SUBMIT POST */
  const handleSubmit = () => {
    if (postMsg.trim() === "") return;

    const postData = {
      name: user.name || user.companyName,
      email: user.email,
      role: user.role,
      postMsg,
      location: {
        country: geo?.country || "",
        region: geo?.region || "",
      },
    };

    dispatch(addPost(postData));
    setPostMsg("");
  };

  /* EDIT FUNCTIONS */
  const handleEdit = (post) => {
    setEditMode(post._id);
    setEditText(post.postMsg);
  };

  const submitEdit = (id) => {
    dispatch(updatePost({ id, postMsg: editText }));
    setEditMode(null);
  };

  /* DELETE FUNCTION */
  const handleDelete = (id) => {
    dispatch(deletePost(id));
  };

  return (
    <div className="create-post-container">

      {/* CREATE POST CARD */}
      <div className="create-post-card">
        <h3 className="create-post-title">What's on your mind?</h3>

        <textarea
          className="create-post-textarea"
          value={postMsg}
          onChange={(e) => setPostMsg(e.target.value)}
          placeholder="Write something..."
        ></textarea>

        <div className="create-post-actions">
          <button className="create-post-btn" onClick={handleSubmit}>
            Post
          </button>
        </div>
      </div>

      {/* MY POSTS */}
      <h3 className="my-posts-title">My Posts</h3>

      <div className="my-posts-list">
        {myPosts?.map((post) => (
          <div className="post-card" key={post._id}>
            <p className="profile-name">{post.name}</p>
            <p className="post-time">
              {new Date(post.createdAt).toLocaleString()}
            </p>

            {/* EDIT MODE */}
            {editMode === post._id ? (
              <>
                <textarea
                  className="edit-box"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                ></textarea>

                <div className="my-post-actions">
                  <button className="save-btn" onClick={() => submitEdit(post._id)}>
                    Save
                  </button>
                  <button
                    className="cancel-btn"
                    onClick={() => setEditMode(null)}
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="message">{post.postMsg}</p>

                <div className="my-post-actions">
                  <button className="edit-btn" onClick={() => handleEdit(post)}>
                    Edit
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(post._id)}
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CreatePost;
