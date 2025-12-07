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

import profileImg from "../Images/profile.png"; // صورة البروفايل الجديدة

const StudentProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.users);

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

      {/* LEFT PROFILE CARD */}
      <div className="left-column">
        <div className="profile-card">
          <div className="profile-img-container">
            <img
              src={user.profileImage || profileImg}
              className="profile-img"
            />
          </div>

          <h2 className="profile-name">{user.name}</h2>
          <p className="profile-email">{user.email}</p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="right-column">

        {/* Academic Card */}
        <div className="glass-card info-card">
          <h3>Academic Information</h3>

          <p><strong>Major:</strong> {user.major}</p>
          <p><strong>Age:</strong> {user.age}</p>
          <p><strong>Role:</strong> {user.role}</p>

          <p>
            <strong>Status:</strong>{" "}
            <span className="status-dot green"></span> Active
          </p>
        </div>

        {/* CV Card */}
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

    </div>
  );
};

export default StudentProfile;
