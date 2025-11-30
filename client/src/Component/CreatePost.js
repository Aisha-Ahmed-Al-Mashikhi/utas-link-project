import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addPost, fetchPosts, fetchUserPosts } from "../Features/PostSlice";
import "../Styles/CreatePost.css";

const CreatePost = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.users);

  const [postMsg, setPostMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert("Please login first.");
      return;
    }

    if (postMsg.trim().length === 0) {
      alert("Write something first.");
      return;
    }

    // Prepare post data
    const newPost = {
      name: user.name,
      email: user.email,
      postMsg,
      role: user.role,
    };

    try {
      await dispatch(addPost(newPost)).unwrap(); // Wait until added

      setPostMsg(""); // clear field

      // Refresh posts (global)
      dispatch(fetchPosts());

      // Refresh MY posts
      dispatch(fetchUserPosts(user.email));
    } catch (err) {
      console.log("Error posting:", err);
    }
  };

  return (
    <div className="create-post-container">
      <h3 className="title">What's on your mind?</h3>

      <textarea
        className="post-input"
        placeholder="Write something..."
        value={postMsg}
        onChange={(e) => setPostMsg(e.target.value)}
      ></textarea>

      <button className="post-btn" onClick={handleSubmit}>
        Post
      </button>
    </div>
  );
};

export default CreatePost;
