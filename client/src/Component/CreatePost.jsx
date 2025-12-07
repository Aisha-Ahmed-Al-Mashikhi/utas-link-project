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

  // Fetch user's posts
  useEffect(() => {
    if (user?.email) {
      dispatch(fetchUserPosts(user.email));
    }
  }, [user, dispatch]);

  // Add or Update post
  const handleSubmit = () => {
    if (!postMsg.trim()) return;

    if (editMode) {
      dispatch(updatePost({ id: editId, postMsg }));
      setEditMode(false);
      setEditId(null);
    } else {
      dispatch(
        addPost({
          postMsg,
          email: user.email,
          name: user.name || user.companyName, // 👈 دعم اسم الشركة
        })
      );
    }

    setPostMsg("");
  };

  // Delete post
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      dispatch(deletePost(id));
    }
  };

  // Edit post
  const handleEdit = (post) => {
    setEditMode(true);
    setEditId(post._id);
    setPostMsg(post.postMsg);
  };

  return (
    <div className="post-page-container">
      {/* CREATE BOX */}
      <div className="create-box">
        <textarea
          className="post-input"
          placeholder="✏️ Write something..."
          value={postMsg}
          onChange={(e) => setPostMsg(e.target.value)}
        ></textarea>

        <button className="post-btn" onClick={handleSubmit}>
          {editMode ? "Update" : "Post"}
        </button>
      </div>

      {/* POSTS LIST */}
      <h3 className="my-posts-title">My Posts</h3>

      {myPosts.length === 0 && <p>No posts yet.</p>}

      {myPosts.map((post) => (
        <div key={post._id} className="post-card">
          <div className="post-header">
            <div className="post-info">
              <p className="author">{user.name || user.companyName}</p>
              <p className="time">{moment(post.createdAt).fromNow()}</p>
            </div>
          </div>

          <p className="post-content">{post.postMsg}</p>

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
  );
};

export default CreatePost;
