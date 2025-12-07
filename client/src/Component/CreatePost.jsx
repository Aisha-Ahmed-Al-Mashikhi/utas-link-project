import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addPost,
  fetchUserPosts,
  updatePost,
  deletePost,
} from "../Features/PostSlice";
import moment from "moment";
import "../Styles/CreatePost.css"; // ← ملف التصميم

const CreatePost = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.users);
  const { myPosts } = useSelector((state) => state.posts);

  const [postMsg, setPostMsg] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  // Load user posts
  useEffect(() => {
    if (user?.email) {
      dispatch(fetchUserPosts(user.email));
    }
  }, [user, dispatch]);

  // Submit new or updated post
  const handleSubmit = () => {
    if (!postMsg.trim()) return;

    if (editMode) {
      dispatch(updatePost({ id: editId, postMsg }));
      alert("Post updated successfully!");
      setEditMode(false);
      setEditId(null);
    } else {
      dispatch(
        addPost({
          postMsg,
          email: user.email,
          name: user.name,
          companyName: user.companyName,
        })
      );
    }

    setPostMsg("");
  };

  // Delete post
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      dispatch(deletePost(id));
      alert("Post deleted successfully.");
    }
  };

  // Edit post
  const handleEdit = (post) => {
    setEditMode(true);
    setEditId(post._id);
    setPostMsg(post.postMsg);
  };

  // Auto detect student or company name
  const getAuthorName = () => {
    return user.companyName ?? user.name;
  };

  return (
    <div className="post-page-container">
      {/* INPUT BOX */}
      <div className="create-box">
        <textarea
          placeholder="Write something..."
          value={postMsg}
          onChange={(e) => setPostMsg(e.target.value)}
          className="post-input"
        ></textarea>

        <button onClick={handleSubmit} className="post-btn">
          {editMode ? "Update" : "Post"}
        </button>
      </div>

      <h3 className="section-title">My Posts</h3>

      {myPosts.length === 0 && <p className="no-posts">No posts yet.</p>}

      {/* POSTS LIST */}
      {myPosts.map((post) => (
        <div key={post._id} className="post-card">
          <div className="post-header">
            <p className="author">{getAuthorName()}</p>
            <p className="time">{moment(post.createdAt).fromNow()}</p>
          </div>

          <p className="post-text">{post.postMsg}</p>

          <div className="btn-row">
            <button className="edit-btn" onClick={() => handleEdit(post)}>
              Edit
            </button>

            <button className="delete-btn" onClick={() => handleDelete(post._id)}>
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CreatePost;
