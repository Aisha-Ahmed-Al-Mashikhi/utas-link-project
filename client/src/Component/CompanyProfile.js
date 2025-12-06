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
      {/* Profile Card */}
      <div className="profile-card">
        <div className="profile-left">
          <div className="profile-img-container">
            <img
              src={
                company.profileImage ||
                "https://cdn-icons-png.flaticon.com/512/3135/3135768.png"
              }
              className="profile-img"
              alt="profile"
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

      {/* License Section */}
      <div className="payment-box">
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
  );
};

export default CompanyProfile;
