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

  // GET IP
  useEffect(() => {
    axios.get("https://api.ipify.org?format=json").then((res) => {
      setIp(res.data.ip);
    });
  }, []);

  // GET LOCATION
  useEffect(() => {
    if (!ip) return;

    axios.get(`http://ip-api.com/json/${ip}`).then((res) => {
      setGeo({
        country: res.data.country || "",
        region: res.data.regionName || res.data.region || "",
      });
    });
  }, [ip]);

  const handleSubmit = () => {
    if (postMsg.trim() === "") return;

    const postData = {
      name: user.name || user.companyName,   // ✔ الاسم يروح للسيرفر
      email: user.email,
      role: user.role,
      postMsg,
      location: {
        country: geo?.country || "",
        region: geo?.region || "",
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
