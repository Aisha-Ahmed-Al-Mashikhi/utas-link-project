// =============================
//     COMPANY PROFILE PAGE
// =============================
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
    if (file) {
      dispatch(uploadLicense({ email: company.email, file }));
    }
  };

  const handleDeleteLicense = () => {
    if (window.confirm("Delete License?"))
      dispatch(deleteLicense(company.email));
  };

  if (!company) return <p>Loading...</p>;

  return (
    <div className="profile-wrapper">

      {/* ===== LEFT BIG CARD ===== */}
      <div className="profile-left">
        <div className="profile-img-container">
          <img
            src={
              company.profileImage ||
              "https://cdn-icons-png.flaticon.com/512/847/847969.png"
            }
            className="profile-img"
            alt="company"
          />
        </div>

        <h2 className="profile-name">{company.companyName}</h2>
        <p className="profile-email">{company.email}</p>

        <div className="profile-line"></div>

        <p className="profile-role">
          {company.industry} — {company.location}
        </p>
      </div>

      {/* ===== RIGHT PANEL ===== */}
      <div className="profile-right">
        <h1 className="profile-title">Hello</h1>

        <p className="profile-sub">Welcome, dear company</p>

        <p className="profile-text">
          With every job post you publish on our platform, you will find talented,
          well-qualified students applying instantly. We help you reach the perfect
          candidates quickly, easily, and with high efficiency — ensuring you
          always connect with the right skills at the right time.
        </p>

        {/* LICENSE LABEL */}
        <h3 className="license-title">Business License</h3>

        {/* ===== UPLOAD LICENSE SECTION ===== */}
        {company.businessLicense ? (
          <>
            <div className="upload-actions">
              <a
                href={`${ENV.SERVER_URL}${company.businessLicense}`}
                target="_blank"
                className="action-btn view"
              >
                View
              </a>

              <input
                id="licenseInput"
                type="file"
                accept=".pdf"
                style={{ display: "none" }}
                onChange={handleLicenseUpload}
              />

              <button
                className="action-btn replace"
                onClick={() =>
                  document.getElementById("licenseInput").click()
                }
              >
                Replace
              </button>

              <button
                className="action-btn delete"
                onClick={handleDeleteLicense}
              >
                Delete
              </button>
            </div>
          </>
        ) : (
          <>
            <input
              id="licenseInput"
              type="file"
              accept=".pdf"
              style={{ display: "none" }}
              onChange={handleLicenseUpload}
            />
            <label htmlFor="licenseInput" className="upload-label">
              Upload License (PDF)
            </label>
          </>
        )}
      </div>
    </div>
  );
};

export default CompanyProfile;
