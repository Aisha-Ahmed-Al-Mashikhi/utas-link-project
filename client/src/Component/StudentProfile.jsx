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

const StudentProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, isSuccess } = useSelector((state) => state.users);

  // -------- Modal state --------
  const [showEdit, setShowEdit] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    major: "",
    age: "",
  });

  // -------- Fetch user --------
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("loggedUser"));
    if (!saved?.email) return navigate("/login");
    dispatch(fetchUser(saved.email));
  }, [dispatch, navigate]);

  // -------- Load user into form --------
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        major: user.major || "",
        age: user.age || "",
      });
    }
  }, [user]);

  // -------- CV upload --------
  const handleCvUpload = (e) => {
    if (!e.target.files[0]) return;
    dispatch(uploadCv({ file: e.target.files[0], email: user.email }));
  };

  // -------- Save updated profile --------
  const handleSave = () => {
    dispatch(updateStudent({ email: user.email, data: formData }));
    setShowEdit(false);

    // toast
    const t = document.createElement("div");
    t.className = "toast success";
    t.innerText = "Profile updated successfully!";
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 1800);
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div className="profile-page">

      {/* LEFT PROFILE CARD */}
      <div className="left-column">
        <div className="glass-card profile-card-modern">
          <img
            src={user.profileImage || profileImg}
            className="profile-avatar"
          />

          <div className="profile-info">
            <h2>{user.name}</h2>
            <p>{user.email}</p>

            <button className="edit-profile-btn" onClick={() => setShowEdit(true)}>
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="right-column">

        <div className="glass-card info-card">
          <h3>Academic Information</h3>

          <p><strong>Major:</strong> {user.major}</p>
          <p><strong>Age:</strong> {user.age}</p>

          <p>
            <strong>Status:</strong>{" "}
            <span className="status-dot green"></span> Active
          </p>
        </div>

        {/* CV */}
        <div className="glass-card info-card">
          <h3>Curriculum Vitae (CV)</h3>

          {user.cvLink ? (
            <div className="cv-section">
              <p className="cv-success">CV Uploaded Successfully</p>

              <div className="cv-actions">
                <a
                  href={`${user.cvLink}`}
                  target="_blank"
                  className="cv-btn view"
                >
                  View
                </a>

                <input
                  type="file"
                  id="cvReplaceInput"
                  accept=".pdf"
                  style={{ display: "none" }}
                  onChange={(e) =>
                    dispatch(uploadCv({ file: e.target.files[0], email: user.email }))
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
                  onClick={() => dispatch(deleteCvThunk(user.email))}
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

      {/* -------- EDIT MODAL -------- */}
      {showEdit && (
        <div className="overlay">
          <div className="edit-modal">
            <h2>Edit Profile</h2>

            <label>Full Name</label>
            <input
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />

            <label>Major</label>
            <input
              value={formData.major}
              onChange={(e) =>
                setFormData({ ...formData, major: e.target.value })
              }
            />

            <label>Age</label>
            <input
              value={formData.age}
              onChange={(e) =>
                setFormData({ ...formData, age: e.target.value })
              }
            />

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
