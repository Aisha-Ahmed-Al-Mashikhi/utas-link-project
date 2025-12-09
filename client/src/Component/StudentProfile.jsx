// src/Component/StudentProfile.js
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUser,
  uploadCv,
  deleteCvThunk,
} from "../Features/UserSlice";
import { useNavigate } from "react-router-dom";
import "../Styles/StudentProfile.css";
import * as ENV from "../config";
import profileImg from "../Images/profile.png";

const StudentProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.users);

  // ⭐ Toast
  const [toastMsg, setToastMsg] = useState("");

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 2000);
  };

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("loggedUser"));
    if (!saved?.email) return navigate("/login");

    dispatch(fetchUser(saved.email));
  }, [dispatch, navigate]);

  if (!user) return <p>Loading...</p>;

  // ⭐ Upload CV
  const handleCvUpload = (e) => {
    if (!e.target.files[0]) return;

    dispatch(uploadCv({ file: e.target.files[0], email: user.email }))
      .unwrap()
      .then(() => showToast("CV uploaded successfully!"));
  };

  // ⭐ Delete CV
  const handleDelete = () => {
    dispatch(deleteCvThunk(user.email))
      .unwrap()
      .then(() => showToast("CV deleted successfully!"));
  };

  return (
    <div className="profile-page">

      {/* ⭐ Toast message */}
      {toastMsg && <div className="toast-success">{toastMsg}</div>}

      {/* LEFT — Profile Card */}
      <div className="left-column">
        <div className="profile-card-modern glass-card">
          <img
            src={user.profileImage || profileImg}
            className="profile-avatar"
            alt="profile"
          />

          <div className="profile-info">
            <h2>{user.name}</h2>
            <p>{user.email}</p>
          </div>

          <button className="edit-profile-btn">Edit Profile</button>
        </div>
      </div>

      {/* RIGHT — Information + CV */}
      <div className="right-column">

        {/* Student Information */}
        <div className="glass-card info-card">
          <h3>Student Information</h3>

          <p><strong>Major:</strong> {user.major}</p>
          <p><strong>Age:</strong> {user.age}</p>
          <p><strong>Role:</strong> {user.role}</p>

          <p>
            <strong>Status:</strong>{" "}
            <span className="status-dot green"></span> Active
          </p>
        </div>

        {/* CV SECTION */}
        <div className="glass-card info-card">
          <h3>Curriculum Vitae (CV)</h3>

          {user.cvLink ? (
            <div className="cv-section">
              <p className="cv-success">CV Uploaded Successfully</p>

              <div className="cv-actions">
                <a
                  href={`${ENV.SERVER_URL}${user.cvLink}`}
                  target="_blank"
                  rel="noreferrer"
                  className="cv-btn view"
                >
                  View
                </a>

                {/* HIDDEN REPLACE INPUT */}
                <input
                  type="file"
                  id="cvReplaceInput"
                  accept=".pdf"
                  hidden
                  onChange={(e) =>
                    dispatch(uploadCv({
                      file: e.target.files[0],
                      email: user.email
                    }))
                      .unwrap()
                      .then(() => showToast("CV replaced successfully!"))
                  }
                />

                <button
                  className="cv-btn replace"
                  onClick={() => document.getElementById("cvReplaceInput").click()}
                >
                  Replace
                </button>

                <button
                  className="cv-btn delete"
                  onClick={handleDelete}
                >
                  Delete
                </button>
              </div>
            </div>
          ) : (
            <>
              <input
                type="file"
                id="cvUpload"
                accept=".pdf"
                hidden
                onChange={handleCvUpload}
              />

              <label htmlFor="cvUpload" className="upload-cv-btn">
                Upload CV (PDF)
              </label>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
