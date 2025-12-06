import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCompany,
  uploadLicense,
  deleteLicense,
} from "../Features/CompanySlice";
import "../Styles/CompanyProfile.css";
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
    <div className="company-page">

      {/* MAIN CARD */}
      <div className="company-card">

        {/* TOP SECTION */}
        <div className="top-section">
          <div className="profile-img-box">
            <img
              src={company.profileImage || "https://cdn-icons-png.flaticon.com/512/847/847969.png"}
              className="profile-img"
              alt="company"
            />
          </div>

          <div className="info-box">
            <h2 className="company-name">{company.companyName}</h2>
            <p className="company-email">{company.email}</p>
            <p className="company-meta">{company.industry} • {company.location}</p>
          </div>
        </div>

        {/* ABOUT SECTION */}
        <div className="about-section">
          <h1 className="hello-title">Hello</h1>
          <p className="welcome-title">Welcome, dear company</p>

          <p className="about-text">
            With every job post you publish on our platform, you will find talented,
            well-qualified students applying instantly. We help you reach the perfect
            candidates quickly, easily, and with high efficiency — ensuring you always
            connect with the right skills at the right time.
          </p>
        </div>

        {/* LICENSE SECTION */}
        <div className="license-section">
          <h3 className="license-title">Business License</h3>

          {company.businessLicense ? (
            <div className="license-actions">

              <a
                href={`${ENV.SERVER_URL}${company.businessLicense}`}
                target="_blank"
                className="btn view"
              >
                View
              </a>

              <input
                id="licenseUpload"
                type="file"
                accept=".pdf"
                style={{ display: "none" }}
                onChange={handleLicenseUpload}
              />

              <button
                className="btn replace"
                onClick={() => document.getElementById("licenseUpload").click()}
              >
                Replace
              </button>

              <button
                className="btn delete"
                onClick={handleDeleteLicense}
              >
                Delete
              </button>
            </div>
          ) : (
            <>
              <input
                id="licenseUpload"
                type="file"
                accept=".pdf"
                style={{ display: "none" }}
                onChange={handleLicenseUpload}
              />
              <label htmlFor="licenseUpload" className="upload-btn">
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
