import React, { useEffect, useState } from "react"; // Import React and its hooks for state and lifecycle
import { useDispatch, useSelector } from "react-redux"; // Import Redux methods to dispatch actions and read state
import {
  fetchUser,
  uploadCv,
  deleteCvThunk,
  updateBankCardThunk,
  deleteBankCardThunk,
} from "../Features/UserSlice"; // Import all async thunk actions related to the user
import { useNavigate } from "react-router-dom"; // For navigation (redirecting user)
import "../Styles/UserProfile.css"; // Profile page styling
import { useForm } from "react-hook-form"; // React Hook Form for handling form input values
import { yupResolver } from "@hookform/resolvers/yup"; // Yup resolver connects Yup validation to React Hook Form
import { bankCardSchema } from "../Validations/BankCardValidation"; // Import validation schema for bank card info

const StudentProfile = () => {
  // Redux dispatcher
  const dispatch = useDispatch();

  // Navigation hook
  const navigate = useNavigate();

  // Select user info from Redux state
  const { user } = useSelector((state) => state.users);

  // Local states
  const [preview, setPreview] = useState(null); // Preview for uploaded profile picture
  const [showCardModal, setShowCardModal] = useState(false); // Controls opening/closing of the bank modal

  // React Hook Form setup with Yup schema
  const {
    register, // Registers form fields
    handleSubmit, // Handles form submission
    setValue, // Allows programmatic value changes
    reset, // Resets the form fields
    formState: { errors }, // Contains validation errors
  } = useForm({
    resolver: yupResolver(bankCardSchema), // Connect Yup schema
  });

  // Load logged user on page load
  useEffect(() => {
    // Fetch logged user from localStorage
    const saved = JSON.parse(localStorage.getItem("loggedUser"));

    // If no saved user → redirect to login
    if (!saved?.email) navigate("/login");

    // Fetch full user info from backend
    dispatch(fetchUser(saved.email));
  }, [dispatch, navigate]);

  // Pre-fill modal fields when opened
  useEffect(() => {
    if (showCardModal && user) {
      reset({
        selectedBank: user.bankName || "",
        cardNumber: user.cardNumber || "",
        cardName: user.cardName || "",
        expiry: user.expiry || "",
        cvv: user.cvv || "",
      });
    }
  }, [showCardModal, user, reset]);

  // If user not yet loaded—show loading
  if (!user) return <p>Loading...</p>;

  // Handle uploading CV file
  const handleCvUpload = (e) => {
    if (!e.target.files[0]) return;
    dispatch(uploadCv({ file: e.target.files[0], email: user.email }));
  };

  // Profile image temporary preview
  const handleImageChange = (e) => {
    const f = e.target.files[0];
    if (f) setPreview(URL.createObjectURL(f));
  };

  // Save bank card info
  const onSaveCard = (data) => {
    dispatch(updateBankCardThunk({ email: user.email, ...data }));
    setShowCardModal(false);
  };

  return (
    <div className="profile-page">
      {/* ---------- PROFILE CARD ---------- */}
      <div className="profile-card">
        <div className="profile-left">
          {/* Image section */}
          <div className="profile-img-container">
            <img
              src={
                preview ||
                user.profileImage ||
                "https://cdn-icons-png.flaticon.com/512/149/149071.png"
              }
              className="profile-img"
            />

            {/* Icon to upload new image */}
            <label htmlFor="imageUpload" className="upload-circle-C">
              📷
            </label>

            {/* Hidden file input */}
            <input
              type="file"
              id="imageUpload"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>

          {/* Basic user details */}
          <div>
            <h2 className="profile-name">{user.name}</h2>
            <p className="profile-email">{user.email}</p>
            <p className="profile-detail">
              {user.major} {user.age ? `• Age ${user.age}` : ""}
            </p>
          </div>
        </div>
      </div>

      {/* ---------- ACADEMIC INFO ---------- */}
      <div className="payment-box">
        <h3>Academic Information</h3>

        <div className="payment-info">
          <p>
            <strong>Major:</strong> {user.major}
          </p>
          <p>
            <strong>Age:</strong> {user.age}
          </p>
          <p>
            <strong>Role:</strong> {user.role}
          </p>
          <p>
            <strong>Status:</strong>{" "}
            <span className="status active">Active</span>
          </p>
        </div>
      </div>

     {/* ---------- CV SECTION ---------- */}
<div className="payment-box">
  <h3>Curriculum Vitae (CV)</h3>

  {user.cvLink ? (
    <div className="cv-section">
      <p className="cv-success">CV Uploaded Successfully</p>

      <div className="cv-actions">

        {/* ===== VIEW (Correct Link) ===== */}
        <a
          href={`${ENV.SERVER_URL}${user.cvLink}`}
          target="_blank"
          className="cv-btn view"
        >
          View
        </a>

        {/* ===== Hidden Replace Input ===== */}
        <input
          type="file"
          id="cvReplaceInput"
          accept=".pdf"
          style={{ display: "none" }}
          onChange={(e) =>
            dispatch(uploadCv({ file: e.target.files[0], email: user.email }))
          }
        />

        {/* ===== REPLACE BUTTON ===== */}
        <button
          className="cv-btn replace"
          onClick={() => document.getElementById("cvReplaceInput").click()}
        >
          Replace
        </button>

        {/* ===== DELETE BUTTON ===== */}
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
      {/* ===== Hidden Upload Input ===== */}
      <input
        type="file"
        id="cvUpload"
        accept=".pdf"
        style={{ display: "none" }}
        onChange={(e) =>
          dispatch(uploadCv({ file: e.target.files[0], email: user.email }))
        }
      />

      {/* ===== Upload Button ===== */}
      <label htmlFor="cvUpload" className="upload-cv-btn">
        Upload CV (PDF)
      </label>
    </>
  )}
</div>

      {/* ---------- BANK CARD SECTION ---------- */}
      <div className="payment-box">
        <h3>Bank / Benefit Card</h3>

        <div className="card-preview">
          <div className="bank-card teal-card">
            <div className="bank-chip"></div>

            {/* Show actual or default values */}
            <p className="card-number">
              {user.cardNumber || "XXXX XXXX XXXX XXXX"}
            </p>
            <p className="card-holder">{user.cardName || "Card Holder"}</p>
            <p className="bank-name-preview">
              {user.bankName || "No Bank Selected"}
            </p>
          </div>
        </div>

        <div className="card-buttons">
          {/* If no card → show Add */}
          {!user.cardNumber ? (
            <button
              className="add-card-btn"
              onClick={() => setShowCardModal(true)}
            >
              + Add Card
            </button>
          ) : (
            <>
              {/* Edit */}
              <button
                className="edit-card-btn"
                onClick={() => setShowCardModal(true)}
              >
                Edit
              </button>

              {/* Delete */}
              <button
                className="delete-card-btn"
                onClick={() => dispatch(deleteBankCardThunk(user.email))}
              >
                Delete
              </button>
            </>
          )}
        </div>
      </div>

      {/* ---------- BANK MODAL ---------- */}
      {showCardModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-header">
              <h3>Add Card</h3>
              <button
                className="close-btn"
                onClick={() => setShowCardModal(false)}
              >
                ×
              </button>
            </div>

            {/* Select Bank */}
            <label>Select Bank</label>

            <div className="bank-radio-row">
              {["Bank Muscat", "Bank Dhofar", "NBO"].map((bank) => (
                <label key={bank}>
                  <input
                    type="radio"
                    value={bank}
                    {...register("selectedBank")}
                  />
                  {bank}
                </label>
              ))}
            </div>

            <p className="error">{errors.selectedBank?.message}</p>

            {/* Card Number */}
            <label>Card Number</label>
            <input
              className="modal-input"
              {...register("cardNumber", {
                onChange: (e) => {
                  let v = e.target.value.replace(/\D/g, ""); // allow digits only
                  v = v.match(/.{1,4}/g)?.join(" ") || v; // format XXXX XXXX ...
                  setValue("cardNumber", v);
                },
              })}
            />
            <p className="error">{errors.cardNumber?.message}</p>

            {/* Card Name */}
            <label>Cardholder Name</label>
            <input className="modal-input" {...register("cardName")} />
            <p className="error">{errors.cardName?.message}</p>

            {/* Expiry */}
            <label>Expiration Date</label>
            <input
              type="month"
              className="modal-input"
              {...register("expiry")}
            />
            <p className="error">{errors.expiry?.message}</p>

            {/* CVV */}
            <label>CVV</label>
            <input
              type="password"
              maxLength="4"
              className="modal-input"
              {...register("cvv")}
            />
            <p className="error">{errors.cvv?.message}</p>

            {/* Buttons */}
            <div className="modal-buttons">
              <button className="save-btn" onClick={handleSubmit(onSaveCard)}>
                Save
              </button>
              <button className="clear-btn" onClick={() => reset()}>
                Clear
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentProfile;
