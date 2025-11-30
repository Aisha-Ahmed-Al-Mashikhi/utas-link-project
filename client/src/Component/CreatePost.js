import React, { useState, useEffect } from "react";
import "../Styles/CreatePost.css";
import { useDispatch, useSelector } from "react-redux";
import {
  addPost,
  fetchUserPosts,
  updatePost,
  deletePost,
} from "../Features/PostSlice";
import moment from "moment";

const CreatePost = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.users);
  const { myPosts } = useSelector((state) => state.posts);

  const [postMsg, setPostMsg] = useState("");
  const [editingId, setEditingId] = useState(null);

  // Load my posts when page opens
  useEffect(() => {
    if (user?.email) {
      dispatch(fetchUserPosts(user.email));
    }
  }, [user, dispatch]);

  // Submit Post
  const handleSubmit = () => {
    if (postMsg.trim() === "") return;

    const postData = {
      email: user.email,
      name: user.name,
      role: "Student",
      postMsg,
    };

    dispatch(addPost(postData));
    setPostMsg("");
  };

  // Enable edit mode
  const handleEdit = (post) => {
    setEditingId(post._id);
    setPostMsg(post.postMsg);
  };

  // Confirm update
  const handleUpdate = () => {
    dispatch(updatePost({ id: editingId, postMsg }));
    setEditingId(null);
    setPostMsg("");
  };

  // Delete post
  const handleDelete = (id) => {
    dispatch(deletePost(id));
  };

  return (
    <div>
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
          {editingId ? (
            <button className="create-post-btn" onClick={handleUpdate}>
              Update Post
            </button>
          ) : (
            <button className="create-post-btn" onClick={handleSubmit}>
              Post
            </button>
          )}
        </div>
      </div>

      {/* MY POSTS LIST */}
      <h3 className="myposts-title">My Posts</h3>

      <div className="myposts-container">
        {myPosts.length === 0 ? (
          <p className="no-posts">You haven't posted anything yet.</p>
        ) : (
          myPosts.map((post) => (
            <div className="mypost-card" key={post._id}>
              <div className="mypost-header">
                <p className="mypost-name">{post.name}</p>
                <p className="mypost-time">{moment(post.createdAt).fromNow()}</p>
              </div>

              <p className="mypost-msg">{post.postMsg}</p>

              {post.location?.country && (
                <p className="mypost-location">
                  📍 {post.location.country}, {post.location.region}
                </p>
              )}

              <div className="mypost-actions">
                <button
                  className="edit-btn"
                  onClick={() => handleEdit(post)}
                >
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
          ))
        )}
      </div>
    </div>
  );
};

export default CreatePost;
