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

  // LOAD LOGGED COMPANY
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
    if (window.confirm("Delete license?")) {
      dispatch(deleteLicense(company.email));
    }
  };

  if (!company) return <p>Loading...</p>;

  return (
    <div className="profile-page">

      {/* ===================== PROFILE CARD ===================== */}
      <div className="profile-card">
        <div className="profile-left">

          <div className="profile-img-container">
            <img
              src={
                company.profileImage ||
                "https://cdn-icons-png.flaticon.com/512/3135/3135768.png"
              }
              className="profile-img"
              alt="company"
            />
          </div>

          <div>
            <h2 className="profile-name">{company.companyName}</h2>
            <p className="profile-email">{company.email}</p>
            <p className="profile-detail">
              {company.industry} • {company.location}
            </p>
          </div>

        </div>
      </div>

      {/* ===================== LICENSE CARD ===================== */}
      <div className="payment-box">
        <h3>Business License</h3>

        {company.businessLicense ? (
          <div className="license-section">
            <p>License Uploaded Successfully</p>

            <div className="license-actions">

              {/* VIEW */}
              <a
                href={`${ENV.SERVER_URL}${company.businessLicense}`}
                className="action-btn view"
                target="_blank"
              >
                View
              </a>

              {/* HIDDEN INPUT */}
              <input
                id="licenseInput"
                type="file"
                accept="application/pdf"
                style={{ display: "none" }}
                onChange={handleLicenseUpload}
              />

              {/* REPLACE */}
              <button
                className="action-btn replace"
                onClick={() => document.getElementById("licenseInput").click()}
              >
                Replace
              </button>

              {/* DELETE */}
              <button
                className="action-btn delete"
                onClick={handleDeleteLicense}
              >
                Delete
              </button>
            </div>
          </div>
        ) : (
          <>
            <input
              id="licenseInput"
              type="file"
              accept="application/pdf"
              style={{ display: "none" }}
              onChange={handleLicenseUpload}
            />
            <label htmlFor="licenseInput" className="upload-btn">
              Upload License (PDF)
            </label>
          </>
        )}
      </div>
    </div>
  );
};

export default CompanyProfile;
