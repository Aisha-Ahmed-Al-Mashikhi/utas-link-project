import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../Styles/UserProfile.css";

const UserProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [preview, setPreview] = useState(null);

  // Load user profile from backend
  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("loggedUser"));
    if (!savedUser?.email) {
      alert("Please log in again.");
      navigate("/login");
      return;
    }

    axios
      .get(`http://localhost:3001/user/${savedUser.email}`)
      .then((res) => setUser(res.data))
      .catch((err) => console.error("Error fetching profile:", err));
  }, [navigate]);

  // Display profile image preview locally
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setPreview(URL.createObjectURL(file));
  };

  // Upload CV (PDF) to backend
  const handleCvUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("cv", file);
    formData.append("email", user.email);

    try {
      const res = await axios.post("http://localhost:3001/uploadCV", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.cvLink) {
        setUser((prev) => ({ ...prev, cvLink: res.data.cvLink }));
        alert("CV uploaded successfully!");
      }
    } catch (err) {
      console.error("Error uploading CV:", err);
      alert("Failed to upload CV. Please try again.");
    }
  };

  if (!user?.email) return <p>Loading profile...</p>;

  return (
    <div className="profile-page">
      {/* ===== Profile Card ===== */}
      <div className="profile-card">
        <div className="profile-left">
          {/* Profile Image */}
          <div className="profile-img-container">
            <img
              src={
                preview ||
                user.profileImage ||
                "https://cdn-icons-png.flaticon.com/512/149/149071.png"
              }
              alt="profile"
              className="profile-img"
            />
            <label htmlFor="imageUpload" className="upload-btn">
              Upload
            </label>
            <input
              type="file"
              id="imageUpload"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>

          <div>
            <h2 className="profile-name">{user.name}</h2>
            <p className="profile-email">{user.email}</p>
            <p className="profile-detail">
              {user.major || "Student"} {user.age ? `• Age ${user.age}` : ""}
            </p>
          </div>
        </div>
      </div>

      {/* ===== Academic Information ===== */}
      <div className="payment-box">
        <h3>Academic Information</h3>
        <div className="payment-info">
          <p>
            <strong>Major:</strong> {user.major || "—"}
          </p>
          <p>
            <strong>Age:</strong> {user.age || "—"}
          </p>
          <p>
            <strong>Role:</strong> {user.role || "Student"}
          </p>
          <p>
            <strong>Status:</strong>{" "}
            <span className="status active">Active</span>
          </p>
        </div>
      </div>

      {/* ===== CV Section ===== */}
      <div className="payment-box" style={{ marginTop: "25px" }}>
        <h3>Curriculum Vitae (CV)</h3>
        {user.cvLink ? (
          <div className="cv-section">
            <p>CV Uploaded Successfully</p>
            <a
              href={user.cvLink}
              target="_blank"
              rel="noopener noreferrer"
              className="cv-link"
            >
              View CV
            </a>
          </div>
        ) : (
          <div>
            <input
              type="file"
              id="cvUpload"
              accept=".pdf"
              style={{ display: "none" }}
              onChange={handleCvUpload}
            />
            <label htmlFor="cvUpload" className="upload-cv-btn">
              Upload CV (PDF)
            </label>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
