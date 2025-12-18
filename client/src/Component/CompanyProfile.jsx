// Import React and hooks
import React, { useEffect, useState } from "react";
// Import Redux hooks
import { useDispatch, useSelector } from "react-redux";
// Import company actions
import {
  fetchCompany,
  uploadLicense,
  deleteLicense,
  updateCompany,
} from "../Features/CompanySlice";
// Import profile styles
import "../Styles/UserProfile.css";
// Import environment config
import * as ENV from "../config";
// Import navigation hook
import { useNavigate } from "react-router-dom";

// Define industries list
const INDUSTRIES = [
  "Technology",
  "Hospitality / Coffee Shops",
  "Retail / Store",
  "Education",
  "Logistics",
  "Government",
  "Other",
];

// Define locations list
const LOCATIONS = ["Salalah", "Taqah", "Mirbat", "Mughsail", "Other"];

// Define CompanyProfile component
const CompanyProfile = () => {
  // Initialize navigation
  const navigate = useNavigate();
  // Initialize dispatch
  const dispatch = useDispatch();

  // Get company data from Redux
  const { company } = useSelector((state) => state.companies);

  // Track edit modal visibility
  const [showEdit, setShowEdit] = useState(false);
  // Store form data
  const [formData, setFormData] = useState({
    companyName: "",
    industry: "",
    location: "",
    foundedDate: "",
  });

  // Store success message
  const [message, setMessage] = useState("");

  // Fetch company data on load
  useEffect(() => {
    // Get logged user
    const saved = JSON.parse(localStorage.getItem("loggedUser"));
    // Redirect if not logged in
    if (!saved?.email) return navigate("/login");
    // Dispatch fetch company
    dispatch(fetchCompany(saved.email));
  }, [dispatch, navigate]);

  // Load company data into form
  useEffect(() => {
    // Check if company exists
    if (company) {
      // Set form values
      setFormData({
        companyName: company.companyName || "",
        industry: company.industry || "",
        location: company.location || "",
        foundedDate: company.foundedDate || "",
      });
    }
  }, [company]);

  // Handle license upload
  const handleLicenseUpload = (e) => {
    // Get selected file
    const file = e.target.files[0];
    // Stop if no file
    if (!file) return;
    // Dispatch upload license
    dispatch(uploadLicense({ email: company.email, file }));
  };

  // Handle license deletion
  const handleDeleteLicense = () => {
    // Confirm deletion
    if (!window.confirm("Delete license?")) return;
    // Dispatch delete license
    dispatch(deleteLicense(company.email));
  };

  // Handle profile save
  const handleSave = () => {
    // Dispatch update company
    dispatch(updateCompany({ email: company.email, data: formData }))
      .unwrap()
      .then(() => {
        // Show success message
        setMessage("Profile updated successfully ✔");
        // Close edit modal
        setShowEdit(false);
        // Clear message after delay
        setTimeout(() => setMessage(""), 2000);
      });
  };

  // Show loading if company not ready
  if (!company) return <p>Loading...</p>;

  // Return JSX
  return (
    // Main profile page
    <div className="profile-page">
      {/* Success message */}
      {message && <div className="toast-success">{message}</div>}

      {/* Left column */}
      <div className="left-column">
        <div className="profile-card-modern">
          {/* Profile image */}
          <img
            src={
              company.profileImage ||
              "https://cdn-icons-png.flaticon.com/512/3135/3135768.png"
            }
            className="profile-avatar"
            alt="profile"
          />

          {/* Profile info */}
          <div className="profile-info">
            {/* Company name */}
            <h2>{company.companyName}</h2>
            {/* Company email */}
            <p>{company.email}</p>
            {/* Industry and location */}
            <p>
              {company.industry} • {company.location}
            </p>

            {/* Edit profile button */}
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
        {/* Company information card */}
        <div className="glass-card info-card">
          <h3>Company Information</h3>
          <p>
            <strong>Industry:</strong> {company.industry}
          </p>
          <p>
            <strong>Location:</strong> {company.location}
          </p>
          <p>
            <strong>Status:</strong> <span className="status-dot green"></span>{" "}
            Active
          </p>
        </div>

        {/* Business license card */}
        <div className="glass-card info-card">
          <h3>Business License</h3>

          {company.businessLicense ? (
            <div className="cv-section">
              {/* License success message */}
              <p className="cv-success">License Uploaded Successfully</p>

              {/* License actions */}
              <div className="cv-actions">
                {/* View license */}
                <a
                  href={`${ENV.SERVER_URL}${company.businessLicense}`}
                  className="cv-btn view"
                  target="_blank"
                >
                  View
                </a>

                {/* Hidden file input */}
                <input
                  id="licenseUP"
                  type="file"
                  accept=".pdf"
                  style={{ display: "none" }}
                  onChange={handleLicenseUpload}
                />

                {/* Replace license */}
                <button
                  className="cv-btn replace"
                  onClick={() => document.getElementById("licenseUP").click()}
                >
                  Replace
                </button>

                {/* Delete license */}
                <button className="cv-btn delete" onClick={handleDeleteLicense}>
                  Delete
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Hidden upload input */}
              <input
                id="licenseUP"
                type="file"
                accept=".pdf"
                style={{ display: "none" }}
                onChange={handleLicenseUpload}
              />
              {/* Upload label */}
              <label htmlFor="licenseUP" className="upload-cv-btn">
                Upload License (PDF)
              </label>
            </>
          )}
        </div>
      </div>

      {/* Edit modal */}
      {showEdit && (
        <div className="overlay">
          <div className="edit-modal">
            {/* Close modal */}
            <button className="modal-close" onClick={() => setShowEdit(false)}>
              ✕
            </button>

            {/* Modal title */}
            <h2>Edit Company Profile</h2>

            {/* Company name input */}
            <label>Company Name</label>
            <input
              value={formData.companyName}
              onChange={(e) =>
                setFormData({ ...formData, companyName: e.target.value })
              }
            />

            {/* Industry select */}
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

            {/* Location select */}
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

            {/* Founded date input */}
            <label>Founded Date</label>
            <input
              type="date"
              value={formData.foundedDate}
              onChange={(e) =>
                setFormData({ ...formData, foundedDate: e.target.value })
              }
            />

            {/* Modal actions */}
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

// Export CompanyProfile component
export default CompanyProfile;
