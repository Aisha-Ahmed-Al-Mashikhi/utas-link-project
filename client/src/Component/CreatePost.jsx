// Import React and hooks
import React, { useEffect, useState } from "react";
// Import Redux hooks
import { useDispatch, useSelector } from "react-redux";
// Import post actions
import {
  addPost,
  fetchUserPosts,
  updatePost,
  deletePost,
} from "../Features/PostSlice";
// Import moment for time formatting
import moment from "moment";
// Import styles
import "../Styles/CreatePost.css";

// Define CreatePost component
const CreatePost = () => {
  // Initialize dispatch
  const dispatch = useDispatch();
  // Get user data from Redux
  const { user } = useSelector((state) => state.users);
  // Get user posts from Redux
  const { myPosts } = useSelector((state) => state.posts);

  // Store post message
  const [postMsg, setPostMsg] = useState("");
  // Track edit mode
  const [editMode, setEditMode] = useState(false);
  // Store edited post id
  const [editId, setEditId] = useState(null);

  // Fetch user posts on load
  useEffect(() => {
    // Dispatch fetch posts
    if (user?.email) dispatch(fetchUserPosts(user.email));
  }, [user]);

  // Handle post submit
  const handleSubmit = () => {
    // Prevent empty post
    if (!postMsg.trim()) return;

    // Check edit mode
    if (editMode) {
      // Dispatch update post
      dispatch(updatePost({ id: editId, postMsg }));
      // Disable edit mode
      setEditMode(false);
      // Clear edit id
      setEditId(null);
    } else {
      // Dispatch add post
      dispatch(addPost({ postMsg, email: user.email, name: user.name }));
    }
    // Clear text area
    setPostMsg("");
  };

  // Handle post deletion
  const handleDelete = (id) => {
    // Confirm delete
    if (window.confirm("Are you sure?")) dispatch(deletePost(id));
  };

  // Determine author name
  const author = user?.name || user?.companyName || "Unknown";

  // Return JSX
  return (
    // Main post page
    <div className="post-page">
      {/* Left card */}
      <div className="left-card glass">
        {/* Post input */}
        <textarea
          placeholder="Write something..."
          value={postMsg}
          onChange={(e) => setPostMsg(e.target.value)}
        ></textarea>

        {/* Submit button */}
        <button onClick={handleSubmit} className="post-btn">
          {editMode ? "Update" : "Post"}
        </button>
      </div>

      {/* Right card */}
      <div className="right-card glass">
        {/* Section title */}
        <h3>My Posts</h3>

        {/* Posts container */}
        <div className="posts-scroll">
          {/* Empty state */}
          {myPosts.length === 0 && <p className="empty">No posts yet.</p>}

          {/* Loop through posts */}
          {myPosts.map((post, idx) => (
            // Single post card
            <div className="post-card" key={idx}>
              {/* Post header */}
              <div className="post-top">
                {/* Author name */}
                <p className="author">{author}</p>
                {/* Post time */}
                <p className="time">{moment(post.createdAt).fromNow()}</p>
              </div>

              {/* Post content */}
              <p className="content">{post.postMsg}</p>

              {/* Action buttons */}
              <div className="actions">
                {/* Edit button */}
                <button
                  className="edit"
                  onClick={() => {
                    setEditMode(true);
                    setEditId(post._id);
                    setPostMsg(post.postMsg);
                  }}
                >
                  Edit
                </button>

                {/* Delete button */}
                <button
                  className="delete"
                  onClick={() => handleDelete(post._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Scroll indicators */}
        <div className="scroll-dots">
          {myPosts.map((_, i) => (
            <span key={i}></span>
          ))}
        </div>
      </div>
    </div>
  );
};

// Export CreatePost component
export default CreatePost;
