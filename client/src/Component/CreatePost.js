import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addPost } from "../Features/PostSlice";
import "../Styles/CreatePost.css";

const CreatePost = () => {
  const [postMsg, setPostMsg] = useState("");
  const [ip, setIp] = useState(null);
  const [geo, setGeo] = useState(null);

  const { user } = useSelector((state) => state.users);
  const dispatch = useDispatch();

  // Get IP
  useEffect(() => {
    const getIP = async () => {
      const res = await axios.get("https://api.ipify.org?format=json");
      setIp(res.data.ip);
    };
    getIP();
  }, []);

  // Get Location
  useEffect(() => {
    const getLocation = async () => {
      if (!ip) return;
      const res = await axios.get(`http://ip-api.com/json/${ip}`);
      setGeo(res.data);
    };
    getLocation();
  }, [ip]);

  const handleSubmit = () => {
    if (postMsg.trim() === "") return;

    const postData = {
      email: user.email,
      name: user.name || user.companyName,  // ⭐ مهم جداً
      postMsg,
      location: {
        country: geo?.country,
        region: geo?.region,
      },
    };

    dispatch(addPost(postData));
    setPostMsg("");
  };

  return (
    <div className="create-post-card">
      <h3 className="create-post-title">What's on your mind?</h3>

      <textarea
        className="create-post-textarea"
        value={postMsg}
        onChange={(e) => setPostMsg(e.target.value)}
        placeholder="Write something..."
      ></textarea>

      <div className="create-post-actions">
        <button className="create-post-btn" onClick={handleSubmit}>
          Post
        </button>
      </div>
    </div>
  );
};

export default CreatePost;
