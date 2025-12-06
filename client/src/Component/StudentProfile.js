// =============================
//        USER PROFILE PAGE
// =============================
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
    if (!file) return;

    dispatch(uploadCv({ email: user.email, file }));
  };

  const handleDeleteCV = () => {
    if (window.confirm("Delete your CV?"))
      dispatch(deleteCvThunk(user.email));
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div className="profile-page">

      {/* USER INFO */}
      <div className="profile-card">
        <div className="profile-left">
          <div className="profile-img-container">
            <img
              src={
                user.profileImage ||
                "https://cdn-icons-png.flaticon.com/512/456/456212.png"
              }
              className="profile-img"
            />
          </div>

          <div>
            <h2 className="profile-name">{user.name}</h2>
            <p className="profile-email">{user.email}</p>
            <p className="profile-detail">{user.major}</p>
          </div>
        </div>
      </div>

      {/* ===================== CV CARD ===================== */}
      <div className="payment-box">
        <h3>Curriculum Vitae</h3>

        {user.cvLink ? (
          <div className="cv-section">
            <p>CV Uploaded Successfully</p>

            <div className="cv-actions">

              {/* VIEW */}
              <a
                href={`${ENV.SERVER_URL}${user.cvLink}`}
                className="action-btn view"
                target="_blank"
              >
                View
              </a>

              {/* HIDDEN INPUT */}
              <input
                id="cvInput"
                type="file"
                accept=".pdf,.doc,.docx"
                style={{ display: "none" }}
                onChange={handleCVUpload}
              />

              {/* REPLACE */}
              <button
                className="action-btn replace"
                onClick={() => document.getElementById("cvInput").click()}
              >
                Replace
              </button>

              {/* DELETE */}
              <button className="action-btn delete" onClick={handleDeleteCV}>
                Delete
              </button>

            </div>
          </div>
        ) : (
          <>
            <input
              id="cvInput"
              type="file"
              accept=".pdf,.doc,.docx"
              style={{ display: "none" }}
              onChange={handleCVUpload}
            />
            <label htmlFor="cvInput" className="upload-btn">
              Upload CV
            </label>
          </>
        )}
      </div>

    </div>
  );
};

export default UserProfile;
