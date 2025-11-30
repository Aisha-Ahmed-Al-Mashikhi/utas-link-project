import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addPost, fetchUserPosts, updatePost, deletePost } from "../Features/PostSlice";

const CreatePost = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.users);
  const { myPosts } = useSelector((state) => state.posts);

  const [postMsg, setPostMsg] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  // Load user's posts when page opens
  useEffect(() => {
    if (user?.email) {
      dispatch(fetchUserPosts(user.email));
    }
  }, [user, dispatch]);

  // Add OR Update Post
  const handleSubmit = () => {
    if (!postMsg.trim()) return;

    if (editMode) {
      dispatch(updatePost({ id: editId, postMsg }));
      setEditMode(false);
      setEditId(null);
    } else {
      dispatch(addPost({ 
        postMsg,
        email: user.email,
        name: user.name
      }));
    }

    setPostMsg("");
  };

  // Delete
  const handleDelete = (id) => {
    dispatch(deletePost(id));
  };

  // Edit
  const handleEdit = (post) => {
    setEditMode(true);
    setEditId(post._id);
    setPostMsg(post.postMsg);
  };

  return (
    <div style={{ width: "100%", marginTop: "30px" }}>
      
      {/* INPUT */}
      <textarea
        placeholder="Write something..."
        value={postMsg}
        onChange={(e) => setPostMsg(e.target.value)}
        style={{
          width: "100%",
          height: "90px",
          border: "1px solid #ccc",
          borderRadius: "6px",
          padding: "10px",
        }}
      ></textarea>

      <button
        onClick={handleSubmit}
        style={{
          marginTop: "10px",
          padding: "8px 20px",
          background: "#00897b",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
        }}
      >
        {editMode ? "Update" : "Post"}
      </button>

      <hr style={{ margin: "30px 0" }} />

      {/* USER POSTS BELOW */}
      <h3>My Posts</h3>

      {myPosts.length === 0 && <p>No posts yet.</p>}

      {myPosts.map((post) => (
        <div
          key={post._id}
          style={{
            background: "#fff",
            padding: "15px",
            borderRadius: "8px",
            marginBottom: "15px",
            border: "1px solid #eee",
          }}
        >
          <p style={{ fontWeight: "bold" }}>{user.name}</p>
          <p>{post.postMsg}</p>

          <button
            style={{
              background: "#ffca28",
              border: 0,
              padding: "6px 15px",
              borderRadius: "5px",
              marginRight: "10px",
              cursor: "pointer",
            }}
            onClick={() => handleEdit(post)}
          >
            Edit
          </button>

          <button
            style={{
              background: "#e57373",
              border: 0,
              padding: "6px 15px",
              borderRadius: "5px",
              cursor: "pointer",
              color: "white",
            }}
            onClick={() => handleDelete(post._id)}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
};

export default CreatePost;
