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
    if (user?.email) dispatch(fetchUserPosts(user.email));
  }, [user]);

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
    if (window.confirm("Are you sure?")) dispatch(deletePost(id));
  };

  const author =
    user?.name || user?.companyName || "Unknown";

  return (
    <div className="post-page">
      {/* LEFT CARD — Write Post */}
      <div className="left-card glass">
        <textarea
          placeholder="Write something..."
          value={postMsg}
          onChange={(e) => setPostMsg(e.target.value)}
        ></textarea>

        <button onClick={handleSubmit} className="post-btn">
          {editMode ? "Update" : "Post"}
        </button>
      </div>

      {/* RIGHT CARD — My Posts */}
      <div className="right-card glass">
        <h3>My Posts</h3>

        <div className="posts-scroll">
          {myPosts.length === 0 && <p className="empty">No posts yet.</p>}

          {myPosts.map((post, idx) => (
            <div className="post-card" key={idx}>
              <div className="post-top">
                <p className="author">{author}</p>
                <p className="time">{moment(post.createdAt).fromNow()}</p>
              </div>

              <p className="content">{post.postMsg}</p>

              <div className="actions">
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

        {/* Small dots / scroll indicators */}
        <div className="scroll-dots">
          {myPosts.map((_, i) => (
            <span key={i}></span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
