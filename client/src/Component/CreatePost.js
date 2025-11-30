import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addPost, fetchUserPosts } from "../Features/PostSlice";
import "../Styles/CreatePost.css";

const CreatePost = () => {
  const [postMsg, setPostMsg] = useState("");
  const { user } = useSelector((state) => state.users);
  const dispatch = useDispatch();

  const handleSubmit = () => {
    if (!postMsg.trim()) return;

    const data = {
      email: user.email,
      name: user.name || user.companyName,
      postMsg,
    };

    dispatch(addPost(data)).then(() => {
      dispatch(fetchUserPosts(user.email)); // refresh my posts
      setPostMsg("");
    });
  };

  return (
    <div className="create-post-card">
      <h3>What's on your mind?</h3>

      <textarea
        className="create-post-textarea"
        value={postMsg}
        onChange={(e) => setPostMsg(e.target.value)}
        placeholder="Write something..."
      ></textarea>

      <button onClick={handleSubmit} className="create-post-btn">
        Post
      </button>
    </div>
  );
};

export default CreatePost;
