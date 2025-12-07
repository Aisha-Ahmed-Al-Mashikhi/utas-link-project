import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCompany,
  uploadLicense,
  deleteLicense,
} from "../Features/CompanySlice";
import "../Styles/UserProfile.css";
import * as ENV from "../config";
import { useNavigate } from "react-router-dom";

const CompanyProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { company } = useSelector((state) => state.companies);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("loggedUser"));
    if (!saved?.email) return navigate("/login");

    dispatch(fetchCompany(saved.email));
  }, [dispatch, navigate]);

  const handleLicenseUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    dispatch(uploadLicense({ email: company.email, file }));
  };

  const handleDeleteLicense = () => {
    if (!window.confirm("Delete license?")) return;
    dispatch(deleteLicense(company.email));
  };

  if (!company) return <p>Loading...</p>;

  return (
    <div className="profile-page">

      {/* LEFT SIDE PROFILE CARD */}
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
            <p>
              {company.industry} • {company.location}
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="right-column">

        {/* CARD 2: Company Information */}
        <div className="glass-card info-card">
          <h3>Company Information</h3>
          <p><strong>Industry:</strong> {company.industry}</p>
          <p><strong>Location:</strong> {company.location}</p>
          <p><strong>Status:</strong> <span className="status-dot green"></span> Active</p>
        </div>

        {/* CARD 3: License Section */}
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
    </div>
  );
};

export default CompanyProfile;
