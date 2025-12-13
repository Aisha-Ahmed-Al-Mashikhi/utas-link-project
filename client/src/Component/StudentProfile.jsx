// Import React and hooks
import React, { useEffect, useState } from "react";
// Import Redux hooks
import { useDispatch, useSelector } from "react-redux";
// Import user actions
import {
  fetchUser,
  uploadCv,
  deleteCvThunk,
  updateStudent,
} from "../Features/UserSlice";
// Import navigation hook
import { useNavigate } from "react-router-dom";
// Import profile styles
import "../Styles/UserProfile.css";
// Import environment config
import * as ENV from "../config";
// Import default profile image
import profileImg from "../Images/profile.png";

// Define majors list
const MAJORS = [
  "",
  "Information Technology",
  "Business Administration",
  "Engineering",
  "Mass Communication",
];

// Define StudentProfile component
const StudentProfile = () => {
  // Initialize dispatch
  const dispatch = useDispatch();
  // Initialize navigation
  const navigate = useNavigate();
  // Get user from Redux
  const { user } = useSelector((state) => state.users);

  // Control edit modal visibility
  const [showEdit, setShowEdit] = useState(false);

  // Store editable form data
  const [formData, setFormData] = useState({
    name: "",
    major: "",
    age: "",
  });

  // Store toast message
  const [toast, setToast] = useState("");

  // Show toast message
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2000);
  };

  // Fetch user data on load
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("loggedUser"));
    if (!saved?.email) return navigate("/login");

    dispatch(fetchUser(saved.email));
  }, [dispatch, navigate]);

  // Load user data into form
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        major: user.major || "",
        age: user.age || "",
      });
    }
  }, [user]);

  // Handle CV upload
  const handleCvUpload = (e) => {
    if (!e.target.files[0]) return;

    dispatch(uploadCv({ file: e.target.files[0], email: user.email }))
      .unwrap()
      .then(() => showToast("CV uploaded successfully!"));
  };

  // Handle CV delete
  const handleDelete = () => {
    dispatch(deleteCvThunk(user.email))
      .unwrap()
      .then(() => showToast("CV deleted successfully!"));
  };

  // Save edited profile
  const handleSave = () => {
    dispatch(updateStudent({ email: user.email, data: formData }))
      .unwrap()
      .then(() => {
        showToast("Profile updated successfully!");
        setShowEdit(false);
      });
  };

  // Show loading state
  if (!user) return <p>Loading...</p>;

  // Return JSX
  return (
    // Main profile container
    <div className="profile-page">
      {/* Toast message */}
      {toast && <div className="toast-success">{toast}</div>}

      {/* Left column */}
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

      {/* Right column */}
      <div className="right-column">
        {/* Academic information */}
        <div className="glass-card info-card">
          <h3>Academic Information</h3>

          <p>
            <strong>Major:</strong> {user.major}
          </p>
          <p>
            <strong>Age:</strong> {user.age}
          </p>

          <p>
            <strong>Status:</strong> <span className="status-dot green"></span>{" "}
            Active
          </p>
        </div>

        {/* CV section */}
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
                    dispatch(
                      uploadCv({
                        file: e.target.files[0],
                        email: user.email,
                      })
                    )
                      .unwrap()
                      .then(() => showToast("CV replaced successfully!"))
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

                <button className="cv-btn delete" onClick={handleDelete}>
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

      {/* Edit profile modal */}
      {showEdit && (
        <div className="overlay">
          <div className="edit-modal">
            <h2>Edit Profile</h2>

            <label>Full Name</label>
            <input
              type="text"
              placeholder="Your name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />

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

            <label>Age</label>
            <input
              type="number"
              placeholder="Your age"
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

// Export component
export default StudentProfile;
