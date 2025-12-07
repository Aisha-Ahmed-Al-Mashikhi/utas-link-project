import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addPost,
  fetchUserPosts,
  updatePost,
  deletePost,
} from "../Features/PostSlice";
import moment from "moment";
import "../Styles/CreatePost.css";

const CreatePost = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.users);
  const { myPosts } = useSelector((state) => state.posts);

  const [postMsg, setPostMsg] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  // Fetch user posts
  useEffect(() => {
    if (user?.email) dispatch(fetchUserPosts(user.email));
  }, [user, dispatch]);

  const handleSubmit = () => {
    if (!postMsg.trim()) return;

    if (editMode) {
      dispatch(updatePost({ id: editId, postMsg }));
      setEditMode(false);
      setEditId(null);
    } else {
      dispatch(addPost({ postMsg, email: user.email, name: user.name }));
    }

    setPostMsg("");
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete post?")) dispatch(deletePost(id));
  };

  const handleEdit = (post) => {
    setEditMode(true);
    setEditId(post._id);
    setPostMsg(post.postMsg);
  };

  return (
    <div className="post-page">

      {/* LEFT SIDE — CREATE POST */}
      <div className="left-card">
        <textarea
          placeholder="Write something..."
          value={postMsg}
          onChange={(e) => setPostMsg(e.target.value)}
          className="post-input"
        ></textarea>

        <button className="post-btn" onClick={handleSubmit}>
          {editMode ? "Update" : "Post"}
        </button>
      </div>

      {/* RIGHT SIDE — POSTS LIST */}
      <div className="right-card">
        <h3 className="section-title">My Posts</h3>

        {myPosts.length === 0 && <p className="empty-msg">No posts yet.</p>}

        {myPosts.map((post) => (
          <div className="post-card" key={post._id}>
            <div className="post-header">
              <p className="post-author">
                {user.name || user.companyName}
              </p>
              <p className="post-time">{moment(post.createdAt).fromNow()}</p>
            </div>

            <p className="post-text">{post.postMsg}</p>

            <div className="post-actions">
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
          </div>
        ))}
      </div>

    </div>
  );
};

export default CreatePost;
