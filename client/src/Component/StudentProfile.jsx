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
  const { user } = useSelector((state) => state.users);

  const [toast, setToast] = useState("");

  useEffect(() => {
    if (user?._id) dispatch(fetchUser(user._id));
  }, [dispatch, user?._id]);

  /* =======================
        UPLOAD CV
  ======================= */
  const handleUpload = (e) => {
    const cv = e.target.files[0];
    if (!cv) return;

    const formData = new FormData();
    formData.append("cv", cv);

    dispatch(uploadCv({ id: user._id, formData }))
      .then(() => {
        setToast("CV uploaded successfully!");
        setTimeout(() => setToast(""), 2000);
      });
  };

  /* =======================
        DELETE CV
  ======================= */
  const deleteCV = () => {
    dispatch(deleteCvThunk(user._id)).then(() => {
      setToast("CV deleted successfully!");
      setTimeout(() => setToast(""), 2000);
    });
  };

  return (
    <div className="profile-page">

      {/* Toast Notification */}
      {toast && <div className="toast-success">{toast}</div>}

      {/* ================= LEFT COLUMN — PROFILE CARD ================= */}
      <div className="left-column">
        <div className="profile-card-modern">

          <img
            src="https://cdn-icons-png.flaticon.com/512/847/847969.png"
            alt="avatar"
            className="profile-avatar"
          />

          <div className="profile-info">
            <h2>{user.fullname}</h2>
            <p>{user.email}</p>
          </div>

          <button className="edit-profile-btn">
            Edit Profile
          </button>
        </div>
      </div>

      {/* ================= RIGHT COLUMN — DETAILS ================= */}
      <div className="right-column">

        {/* ===== User Basic Info ===== */}
        <div className="glass-card info-card">
          <h3>Student Information</h3>

          <p><strong>Name:</strong> {user.fullname}</p>
          <p><strong>Email:</strong> {user.email}</p>

          <p>
            <strong>Status:</strong>{" "}
            <span className="status-dot green"></span> Active
          </p>
        </div>

        {/* ===== CV SECTION ===== */}
        <div className="glass-card cv-section">
          <h3>Curriculum Vitae</h3>

          {user.cv ? (
            <>
              <p className="cv-success">A CV is already uploaded.</p>

              <div className="cv-actions">

                <a
                  href={user.cv}
                  target="_blank"
                  rel="noreferrer"
                  className="cv-btn view"
                >
                  View
                </a>

                <label className="cv-btn replace">
                  Replace
                  <input type="file" hidden onChange={handleUpload} />
                </label>

                <button className="cv-btn delete" onClick={deleteCV}>
                  Delete
                </button>

              </div>
            </>
          ) : (
            <label className="upload-cv-btn">
              Upload CV
              <input type="file" hidden onChange={handleUpload} />
            </label>
          )}
        </div>

      </div>

    </div>
  );
};

export default StudentProfile;
