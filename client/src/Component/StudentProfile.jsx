// src/Component/StudentProfile.js
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUser,
  uploadCv,
  deleteCvThunk,
  updateStudent,
} from "../Features/UserSlice";
import { useNavigate } from "react-router-dom";
import "../Styles/UserProfile.css";
import * as ENV from "../config";
import profileImg from "../Images/profile.png";

const MAJORS = [
  "",
  "Information Technology",
  "Business Administration",
  "Engineering",
  "Mass Communication",
];

const StudentProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.users);

  const [showEdit, setShowEdit] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    major: "",
    age: "",
  });

  // ======================
  // 🚀 SUCCESS TOAST
  // ======================
  const [toast, setToast] = useState("");

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2000);
  };

  // ======================
  // FETCH USER
  // ======================
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("loggedUser"));
    if (!saved?.email) return navigate("/login");

    dispatch(fetchUser(saved.email));
  }, [dispatch, navigate]);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        major: user.major || "",
        age: user.age || "",
      });
    }
  }, [user]);

  // ======================
  // UPLOAD CV
  // ======================
  const handleCvUpload = (e) => {
    if (!e.target.files[0]) return;

    dispatch(uploadCv({ file: e.target.files[0], email: user.email }))
      .unwrap()
      .then(() => showToast("CV uploaded successfully!"));
  };

  // ======================
  // DELETE CV
  // ======================
  const handleDelete = () => {
    dispatch(deleteCvThunk(user.email))
      .unwrap()
      .then(() => showToast("CV deleted successfully!"));
  };

  // ======================
  // SAVE EDITED PROFILE
  // ======================
  const handleSave = () => {
    dispatch(updateStudent({ email: user.email, data: formData }))
      .unwrap()
      .then(() => {
        showToast("Profile updated successfully!");
        setShowEdit(false);
      });
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div className="profile-page">

      {/* ⭐ SUCCESS MESSAGE */}
      {toast && <div className="toast-success">{toast}</div>}

      {/* LEFT SIDE – PROFILE CARD */}
      <div className="left-column">
        <div className="glass-card profile-card-modern">
          <img
            src={user.profileImage || profileImg}
            className="profile-avatar"
            alt="profile"
          />

          <div className="profile-info">
            <h2>{user.name}</h2>
            <p>{user.email}</p>

            <button
              className="edit-profile-btn"
              onClick={() => setShowEdit(true)}
            >
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="right-column">

        {/* ACADEMIC INFO */}
        <div className="glass-card info-card">
          <h3>Academic Information</h3>

          <p><strong>Major:</strong> {user.major}</p>
          <p><strong>Age:</strong> {user.age}</p>

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
                  className="cv-btn view"
                >
                  View
                </a>

                {/* Replace CV */}
                <input
                  type="file"
                  id="cvReplaceInput"
                  accept=".pdf"
                  style={{ display: "none" }}
                  onChange={(e) =>
                    dispatch(uploadCv({ file: e.target.files[0], email: user.email }))
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
                style={{ display: "none" }}
                onChange={handleCvUpload}
              />
              <label htmlFor="cvUpload" className="upload-cv-btn">
                Upload CV (PDF)
              </label>
            </>
          )}
        </div>
      </div>

      {/* ========================
          EDIT PROFILE MODAL
      ======================== */}
      {showEdit && (
        <div className="overlay">
          <div className="edit-modal">
            <h2>Edit Profile</h2>

            {/* NAME */}
            <label>Full Name</label>
            <input
              type="text"
              placeholder="Your name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />

            {/* MAJOR */}
            <label>Major</label>
            <select
              value={formData.major}
              onChange={(e) =>
                setFormData({ ...formData, major: e.target.value })
              }
            >
              <option value="">Select your major</option>
              {MAJORS.map((m, i) => (
                <option key={i} value={m}>
                  {m}
                </option>
              ))}
            </select>

            {/* AGE */}
            <label>Age</label>
            <input
              type="number"
              placeholder="Your age"
              value={formData.age}
              onChange={(e) =>
                setFormData({ ...formData, age: e.target.value })
              }
            />

            {/* ACTION BUTTONS */}
            <div className="actions">
              <button className="cancel-btn" onClick={() => setShowEdit(false)}>
                Cancel
              </button>

              <button className="save-btn" onClick={handleSave}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default StudentProfile;
