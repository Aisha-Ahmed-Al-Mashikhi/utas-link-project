// src/Components/StudentProfile.jsx

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUser,
  uploadCv,
  deleteCvThunk,
} from "../Features/UserSlice";
import "../Styles/UserProfile.css";

const StudentProfile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.users);

  const [cvFile, setCvFile] = useState(null);
  const [toast, setToast] = useState(false);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("loggedUser"));
    if (saved?.email) dispatch(fetchUser(saved.email));
  }, [dispatch]);

  const handleUpload = () => {
    if (!cvFile) return alert("Please select a file first.");

    const formData = new FormData();
    formData.append("cv", cvFile);

    dispatch(uploadCv({ email: user.email, cv: formData }))
      .unwrap()
      .then(() => {
        setToast(true);
        setTimeout(() => setToast(false), 2000);
      });
  };

  const handleDelete = () => {
    dispatch(deleteCvThunk(user.email));
  };

  return (
    <div className="profile-page">

      {/* LEFT COLUMN — PROFILE CARD */}
      <div className="left-column">
        <div className="profile-card-modern">
          <img
            src="/default-avatar.png"
            alt="profile"
            className="profile-avatar"
          />

          <div className="profile-info">
            <h2>{user?.fullName || "Student"}</h2>
            <p>{user?.email}</p>
          </div>

          <button className="edit-profile-btn">
            Edit Profile
          </button>
        </div>
      </div>

      {/* RIGHT COLUMN */}
      <div className="right-column">

        {/* STUDENT INFO CARD */}
        <div className="glass-card info-card">
          <h3>Student Information</h3>

          <p>
            <strong>Name:</strong> {user?.fullName}
          </p>

          <p>
            <strong>Email:</strong> {user?.email}
          </p>

          <p>
            <strong>Status:</strong>
            <span className="status-dot green"></span> Active
          </p>
        </div>

        {/* CV SECTION */}
        <div className="glass-card cv-section">
          <h3>Curriculum Vitae</h3>

          {user?.cvUrl ? (
            <>
              <p className="cv-success">CV Uploaded Successfully!</p>

              <div className="cv-actions">
                <a
                  className="cv-btn view"
                  href={user.cvUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  View CV
                </a>

                <label className="cv-btn replace">
                  Replace
                  <input
                    type="file"
                    hidden
                    onChange={(e) => setCvFile(e.target.files[0])}
                  />
                </label>

                <button className="cv-btn delete" onClick={handleDelete}>
                  Delete
                </button>
              </div>

              {cvFile && (
                <button className="upload-cv-btn" onClick={handleUpload}>
                  Upload New CV
                </button>
              )}
            </>
          ) : (
            <>
              <label className="upload-cv-btn">
                Upload CV
                <input
                  type="file"
                  hidden
                  onChange={(e) => setCvFile(e.target.files[0])}
                />
              </label>

              {cvFile && (
                <button className="upload-cv-btn" onClick={handleUpload}>
                  Submit
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* SUCCESS TOAST */}
      {toast && <div className="toast-success">CV Uploaded Successfully!</div>}
    </div>
  );
};

export default StudentProfile;
