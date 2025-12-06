import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUser,
  uploadCv,
  deleteCvThunk,
} from "../Features/UserSlice";
import "../Styles/UserProfile.css";
import * as ENV from "../config";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.users);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("loggedUser"));
    if (!saved?.email) return navigate("/login");
    dispatch(fetchUser(saved.email));
  }, [dispatch, navigate]);

  const handleCVUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      dispatch(uploadCv({ email: user.email, file }));
    }
  };

  const handleDeleteCV = () => {
    if (window.confirm("Delete CV?"))
      dispatch(deleteCvThunk(user.email));
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div className="profile-wrapper">

      {/* ===== LEFT PANEL ===== */}
      <div className="profile-left">
        <div className="profile-img-container">
          <img
            src={user.profileImage || "https://cdn-icons-png.flaticon.com/512/847/847969.png"}
            className="profile-img"
          />
        </div>

        <h2 className="profile-name">{user.name}</h2>
        <p className="profile-email">{user.email}</p>
        <div className="profile-line"></div>
        <p className="profile-role">{user.major}</p>
      </div>

      {/* ===== RIGHT PANEL ===== */}
      <div className="profile-right">
        <h1 className="profile-title">Hello</h1>
        <p className="profile-sub">Here’s who I am & what I do</p>

        <p className="profile-text">
          I am a student passionate about technology, learning, and creating projects
          that make an impact. This is my space to showcase who I am.
        </p>

        {/* ===== UPLOAD CV SECTION ===== */}
        {user.cvLink ? (
          <>
            <div className="upload-actions">
              <a
                href={`${ENV.SERVER_URL}${user.cvLink}`}
                target="_blank"
                className="action-btn view"
              >
                View
              </a>

              <input
                id="cvInput"
                type="file"
                accept=".pdf,.doc,.docx"
                style={{ display: "none" }}
                onChange={handleCVUpload}
              />
              <button
                className="action-btn replace"
                onClick={() => document.getElementById("cvInput").click()}
              >
                Replace
              </button>

              <button className="action-btn delete" onClick={handleDeleteCV}>
                Delete
              </button>
            </div>
          </>
        ) : (
          <>
            <input
              id="cvInput"
              type="file"
              accept=".pdf,.doc,.docx"
              style={{ display: "none" }}
              onChange={handleCVUpload}
            />
            <label htmlFor="cvInput" className="upload-label">
              Upload CV
            </label>
          </>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
