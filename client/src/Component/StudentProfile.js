import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUser,
  uploadCv,
  deleteCvThunk,
} from "../Features/UserSlice";
import { useNavigate } from "react-router-dom";
import "../Styles/UserProfile.css";
import * as ENV from "../config";

const StudentProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.users);

  // Load logged user
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("loggedUser"));
    if (!saved?.email) return navigate("/login");

    dispatch(fetchUser(saved.email));
  }, [dispatch, navigate]);

  if (!user) return <p>Loading...</p>;

  const handleCvUpload = (e) => {
    if (!e.target.files[0]) return;
    dispatch(uploadCv({ file: e.target.files[0], email: user.email }));
  };

  return (
    <div className="profile-page">

      {/* ------------ PROFILE CARD ------------ */}
      <div className="profile-card">
        <div className="profile-left">
          <div className="profile-img-container">
            <img
              src={
                user.profileImage ||
                "https://cdn-icons-png.flaticon.com/512/149/149071.png"
              }
              className="profile-img"
            />
          </div>

          <div>
            <h2 className="profile-name">{user.name}</h2>
            <p className="profile-email">{user.email}</p>
            <p className="profile-detail">
              {user.major} {user.age ? `• Age ${user.age}` : ""}
            </p>
          </div>
        </div>
      </div>

      {/* ------------ ACADEMIC INFO ------------ */}
      <div className="payment-box">
        <h3>Academic Information</h3>

        <p>
          <strong>Major:</strong> {user.major}
        </p>
        <p>
          <strong>Age:</strong> {user.age}
        </p>
        <p>
          <strong>Role:</strong> {user.role}
        </p>
        <p>
          <strong>Status:</strong>{" "}
          <span className="status active">Active</span>
        </p>
      </div>

      {/* ------------ CV SECTION ------------ */}
      <div className="payment-box">
        <h3>Curriculum Vitae (CV)</h3>

        {user.cvLink ? (
          <div className="cv-section">
            <p className="cv-success">CV Uploaded Successfully</p>

            <div className="cv-actions">

              {/* VIEW CV */}
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
                }
              />

              <button
                className="cv-btn replace"
                onClick={() =>
                  document.getElementById("cvReplaceInput").click()
                }
              >
                Replace
              </button>

              {/* Delete CV */}
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
  );
};

export default StudentProfile;
