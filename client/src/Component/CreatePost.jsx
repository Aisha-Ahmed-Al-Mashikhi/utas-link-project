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

  useEffect(() => {
    if (user?.email) {
      dispatch(fetchUserPosts(user.email));
    }
  }, [user, dispatch]);

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
          name: user.name || user.companyName, // 👈 يدعم الطالب + الشركة
        })
      );
    }

    setPostMsg("");
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete post?")) {
      dispatch(deletePost(id));
    }
  };

  const handleEdit = (post) => {
    setEditMode(true);
    setEditId(post._id);
    setPostMsg(post.postMsg);
  };

  return (
    <div className="post-wrapper">

      {/* كتابة بوست */}
      <div className="create-card">
        <textarea
          className="textarea"
          placeholder="Write something..."
          value={postMsg}
          onChange={(e) => setPostMsg(e.target.value)}
        ></textarea>

        <button className="post-button" onClick={handleSubmit}>
          {editMode ? "Update" : "Post"}
        </button>
      </div>

      <h3 className="section-title">My Posts</h3>

      {myPosts.length === 0 && <p>No posts yet.</p>}

      {/* عرض بوستات المستخدم */}
      {myPosts.map((post) => (
        <div
          key={post._id}
          className="post-card"
          onClick={() => console.log("Card Clicked")}
        >
          <div className="post-header">
            <p className="post-author">{user.name || user.companyName}</p>
            <span className="post-time">{moment(post.createdAt).fromNow()}</span>
          </div>

          <p className="post-text">{post.postMsg}</p>

          <div className="post-actions">
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
