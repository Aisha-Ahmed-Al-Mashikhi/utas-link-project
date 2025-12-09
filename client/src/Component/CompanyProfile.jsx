// src/Component/CompanyProfile.js
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCompany,
  uploadLicense,
  deleteLicense,
  updateCompany,
} from "../Features/CompanySlice";
import "../Styles/UserProfile.css";
import * as ENV from "../config";
import { useNavigate } from "react-router-dom";

const INDUSTRIES = [
  "Technology",
  "Hospitality / Coffee Shops",
  "Retail / Store",
  "Education",
  "Logistics",
  "Government",
  "Other",
];

const LOCATIONS = ["Salalah", "Taqah", "Mirbat", "Mughsail", "Other"];

const CompanyProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { company } = useSelector((state) => state.companies);

  /* -------- EDIT MODAL STATES -------- */
  const [showEdit, setShowEdit] = useState(false);
  const [formData, setFormData] = useState({
    companyName: "",
    industry: "",
    location: "",
    foundedDate: "",
  });

  const [message, setMessage] = useState("");

  /* -------- FETCH COMPANY DATA -------- */
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("loggedUser"));
    if (!saved?.email) return navigate("/login");
    dispatch(fetchCompany(saved.email));
  }, [dispatch, navigate]);

  /* -------- LOAD DATA INTO FORM -------- */
  useEffect(() => {
    if (company) {
      setFormData({
        companyName: company.companyName || "",
        industry: company.industry || "",
        location: company.location || "",
        foundedDate: company.foundedDate || "",
      });
    }
  }, [company]);

  /* -------- LICENSE UPLOAD -------- */
  const handleLicenseUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    dispatch(uploadLicense({ email: company.email, file }));
  };

  /* -------- DELETE LICENSE -------- */
  const handleDeleteLicense = () => {
    if (!window.confirm("Delete license?")) return;
    dispatch(deleteLicense(company.email));
  };

  /* -------- SAVE UPDATED PROFILE -------- */
  const handleSave = () => {
    dispatch(updateCompany({ email: company.email, data: formData }))
      .unwrap()
      .then(() => {
        setMessage("Profile updated successfully ✔");
        setShowEdit(false);

        setTimeout(() => setMessage(""), 2000);
      });
  };

  if (!company) return <p>Loading...</p>;

  return (
    <div className="profile-page">

      {/* SUCCESS MESSAGE */}
      {message && <p className="success-msg">{message}</p>}

      {/* LEFT COLUMN */}
      <div className="left-column">
        <div className="profile-card-modern">
          <img
            src={
              company.profileImage ||
              "https://cdn-icons-png.flaticon.com/512/3135/3135768.png"
            }
            className="profile-avatar"
            alt="profile"
          />

          <div className="profile-info">
            <h2>{company.companyName}</h2>
            <p>{company.email}</p>
            <p>{company.industry} • {company.location}</p>

            {/* EDIT BUTTON */}
            <button className="edit-profile-btn" onClick={() => setShowEdit(true)}>
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN */}
      <div className="right-column">

        {/* COMPANY INFORMATION */}
        <div className="glass-card info-card">
          <h3>Company Information</h3>
          <p><strong>Industry:</strong> {company.industry}</p>
          <p><strong>Location:</strong> {company.location}</p>
          <p>
            <strong>Status:</strong> <span className="status-dot green"></span> Active
          </p>
        </div>

        {/* LICENSE */}
        <div className="glass-card info-card">
          <h3>Business License</h3>

          {company.businessLicense ? (
            <div className="cv-section">
              <p className="cv-success">License Uploaded Successfully</p>

              <div className="cv-actions">
                <a
                  href={`${ENV.SERVER_URL}${company.businessLicense}`}
                  className="cv-btn view"
                  target="_blank"
                >
                  View
                </a>

                <input
                  id="licenseUP"
                  type="file"
                  accept=".pdf"
                  style={{ display: "none" }}
                  onChange={handleLicenseUpload}
                />

                <button
                  className="cv-btn replace"
                  onClick={() => document.getElementById("licenseUP").click()}
                >
                  Replace
                </button>

                <button className="cv-btn delete" onClick={handleDeleteLicense}>
                  Delete
                </button>
              </div>
            </div>
          ) : (
            <>
              <input
                id="licenseUP"
                type="file"
                accept=".pdf"
                style={{ display: "none" }}
                onChange={handleLicenseUpload}
              />
              <label htmlFor="licenseUP" className="upload-cv-btn">
                Upload License (PDF)
              </label>
            </>
          )}
        </div>

      </div>

      {/* -------- EDIT MODAL -------- */}
      {showEdit && (
        <div className="overlay">
          <div className="edit-modal">

            <button className="modal-close" onClick={() => setShowEdit(false)}>✕</button>

            <h2>Edit Company Profile</h2>

            <label>Company Name</label>
            <input
              value={formData.companyName}
              onChange={(e) =>
                setFormData({ ...formData, companyName: e.target.value })
              }
            />

            <label>Industry</label>
            <select
              value={formData.industry}
              onChange={(e) =>
                setFormData({ ...formData, industry: e.target.value })
              }
            >
              <option value="">Select industry</option>
              {INDUSTRIES.map((i) => (
                <option key={i}>{i}</option>
              ))}
            </select>

            <label>Location</label>
            <select
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
            >
              <option value="">Select location</option>
              {LOCATIONS.map((l) => (
                <option key={l}>{l}</option>
              ))}
            </select>

            <label>Founded Date</label>
            <input
              type="date"
              value={formData.foundedDate}
              onChange={(e) =>
                setFormData({ ...formData, foundedDate: e.target.value })
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

export default CompanyProfile;
