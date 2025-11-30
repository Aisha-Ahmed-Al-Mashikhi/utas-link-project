import React, { useState, useEffect } from "react";
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
  const [editId, setEditId] = useState(null);
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.users);
  const { myPosts } = useSelector((state) => state.posts);

  /* LOAD USER POSTS */
  useEffect(() => {
    if (user?.email) dispatch(fetchUserPosts(user.email));
  }, [user, dispatch]);

  /* SUBMIT POST */
  const handleSubmit = () => {
    if (!postMsg.trim()) return;

    if (editId) {
      dispatch(updatePost({ id: editId, postMsg }));
      setEditId(null);
    } else {
      dispatch(
        addPost({
          email: user.email,
          name: user.name || user.companyName,
          postMsg,
        })
      );
    }

    setPostMsg("");
  };

  /* EDIT MODE */
  const startEdit = (post) => {
    setEditId(post._id);
    setPostMsg(post.postMsg);
  };

  /* DELETE */
  const removePost = (id) => {
    dispatch(deletePost(id));
  };

  return (
    <div className="create-post-container">

      {/* ADD OR EDIT POST */}
      <div className="create-post-card">
        <h3>{editId ? "Update Post" : "Create Post"}</h3>

        <textarea
          className="create-post-textarea"
          value={postMsg}
          onChange={(e) => setPostMsg(e.target.value)}
          placeholder="What's on your mind?"
        />

        <button className="create-post-btn" onClick={handleSubmit}>
          {editId ? "Update" : "Post"}
        </button>
      </div>

      {/* USER POSTS LIST */}
      <div className="my-posts-section">
        <h3 className="my-posts-title">My Posts</h3>

        {myPosts.map((p) => (
          <div key={p._id} className="post-item-card">
            <div className="post-item-header">
              <strong>{p.name}</strong>
              <span className="post-item-location">
                {p.location?.region}, {p.location?.country}
              </span>
            </div>

            <p className="post-item-msg">{p.postMsg}</p>

            <div className="post-item-actions">
              <button className="edit-btn" onClick={() => startEdit(p)}>
                ✏ Edit
              </button>

              <button className="delete-btn" onClick={() => removePost(p._id)}>
                🗑 Delete
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default CreatePost;
