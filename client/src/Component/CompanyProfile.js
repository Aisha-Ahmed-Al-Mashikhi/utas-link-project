import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "../Styles/UserProfile.css";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { bankCardSchema } from "../Validations/BankCardValidation";
import {
  fetchCompany,
  uploadProfile,
  uploadLicense,
  deleteLicense,
  updateBankInfo,
  deleteBankCard,
} from "../Features/CompanySlice";
import { useNavigate } from "react-router-dom";

const CompanyProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { company } = useSelector((state) => state.companies);

  // PROFILE IMAGE PREVIEW
  const [preview, setPreview] = useState(null);

  // BANK STATES — 
  const [selectedBank, setSelectedBank] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  const [showCardModal, setShowCardModal] = useState(false);

  // REACT HOOK FORM (Validation Only)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(bankCardSchema),
  });

  /* ===============================
        LOAD COMPANY
  =============================== */
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("loggedUser"));
    if (!saved?.email) return navigate("/login");

    dispatch(fetchCompany(saved.email));
  }, [dispatch, navigate]);

  /* ===============================
        FILL BANK INFO (if exists)
  =============================== */
  useEffect(() => {
    if (company?.email) {
      setSelectedBank(company.bankName || "");
      setCardNumber(company.cardNumber || "");
      setCardName(company.cardName || "");
      setExpiry(company.expiry || "");
      setCvv(company.cvv || "");

      reset({
        selectedBank: company.bankName,
        cardNumber: company.cardNumber,
        cardName: company.cardName,
        expiry: company.expiry,
        cvv: company.cvv,
      });
    }
  }, [company, reset]);

  /* ===============================
        UPLOAD PROFILE IMAGE
  =============================== */
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    dispatch(uploadProfile({ email: company.email, file }));
    setPreview(URL.createObjectURL(file));
  };

  /* ===============================
        UPLOAD LICENSE PDF
  =============================== */
  const handleLicenseUpload = (e) => {
    const f = e.target.files[0];
    if (!f) return;

    dispatch(uploadLicense({ email: company.email, file: f }));
  };

  /* ===============================
        DELETE LICENSE
  =============================== */
  const handleDeleteLicense = () => {
    if (!window.confirm("Delete license?")) return;
    dispatch(deleteLicense(company.email));
  };

  /* ===============================
        SAVE BANK CARD INFO
  =============================== */
  const saveCardInfo = () => {
    dispatch(
      updateBankInfo({
        email: company.email,
        bankData: {
          bankName: selectedBank,
          cardNumber,
          cardName,
          expiry,
          cvv,
        },
      })
    );
    setShowCardModal(false);
  };

  /* ===============================
        DELETE BANK CARD
  =============================== */
  const removeBank = () => {
    if (!window.confirm("Delete bank card?")) return;

    dispatch(deleteBankCard(company.email));

    // RESET LOCAL STATES
    setSelectedBank("");
    setCardNumber("");
    setCardName("");
    setExpiry("");
    setCvv("");

    reset();
  };

  return (
    <div className="profile-page">
      {/* ===== PROFILE CARD ===== */}
      <div className="profile-card">
        <div className="profile-left">
          <div className="profile-img-container">
            <img
              src={
                preview ||
                company.profileImage ||
                "https://cdn-icons-png.flaticon.com/512/3135/3135768.png"
              }
              className="profile-img"
            />

            <label htmlFor="companyImg" className="upload-circle-C">
              📷
            </label>
            <input
              type="file"
              id="companyImg"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleImageUpload}
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

    {/* ===== LICENSE SECTION ===== */}
<div className="payment-box">
  <h3>Business License</h3>

  {company.tradeLicense ? (
    <div className="cv-section">
      <p className="cv-success">License Uploaded Successfully</p>

      <div className="cv-actions">

        {/* VIEW */}
        <a
          href={company.tradeLicense}
          target="_blank"
          className="cv-btn view"
        >
          View
        </a>

        {/* HIDDEN FILE INPUT */}
        <input
          id="licenseUP"
          type="file"
          accept=".pdf"
          style={{ display: "none" }}
          onChange={handleLicenseUpload}
        />

        {/* REPLACE */}
        <button
          className="cv-btn replace"
          onClick={() => document.getElementById("licenseUP").click()}
        >
          Replace
        </button>

        {/* DELETE */}
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


      {/* ===== BANK CARD ===== */}
      <div className="payment-box">
        <h3>Bank / Benefit Card</h3>

        <div className="card-preview">
          <div className="bank-card">
            <div className="bank-chip"></div>

            <p className="card-number">
              {company.cardNumber || "XXXX XXXX XXXX XXXX"}
            </p>

            <p className="card-holder">{company.cardName || "Card Holder"}</p>

            <p className="bank-name-preview">
              {company.bankName || "No Bank Selected"}
            </p>
          </div>
        </div>

        {/* BUTTONS */}
        <div className="card-buttons">
          {!company.cardNumber ? (
            <button
              className="add-card-btn"
              onClick={() => setShowCardModal(true)}
            >
              + Add Card
            </button>
          ) : (
            <>
              <button
                className="edit-card-btn"
                onClick={() => setShowCardModal(true)}
              >
                Edit Card
              </button>

              <button className="delete-card-btn" onClick={removeBank}>
                Delete Card
              </button>
            </>
          )}
        </div>
      </div>

      {/* ===== BANK MODAL ===== */}
      {showCardModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-header">
              <h3>Edit Card</h3>
              <button
                className="close-btn"
                onClick={() => setShowCardModal(false)}
              >
                ×
              </button>
            </div>

            {/* BANK OPTIONS */}
            <label>Select Bank</label>

            <div className="bank-radio-row">
              {["Bank Muscat", "Bank Dhofar", "NBO"].map((bank) => (
                <label key={bank}>
                  <input
                    type="radio"
                    value={bank}
                    {...register("selectedBank")}
                    checked={selectedBank === bank}
                    onChange={(e) => setSelectedBank(e.target.value)}
                  />
                  {bank}
                </label>
              ))}
            </div>
            <p className="error">{errors.selectedBank?.message}</p>

            {/* CARD NUMBER */}
            <label>Card Number</label>
            <input
              className="modal-input"
              {...register("cardNumber")}
              value={cardNumber}
              onChange={(e) => {
                let v = e.target.value.replace(/\D/g, "");
                v = v.match(/.{1,4}/g)?.join(" ") || v;
                setCardNumber(v);
              }}
            />
            <p className="error">{errors.cardNumber?.message}</p>

            {/* CARD HOLDER NAME */}
            <label>Cardholder Name</label>
            <input
              className="modal-input"
              {...register("cardName")}
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
            />
            <p className="error">{errors.cardName?.message}</p>

            {/* EXPIRY DATE */}
            <label>Expiration Date</label>
            <input
              type="month"
              className="modal-input"
              {...register("expiry")}
              value={expiry}
              onChange={(e) => setExpiry(e.target.value)}
            />
            <p className="error">{errors.expiry?.message}</p>

            {/* CVV */}
            <label>CVV</label>
            <input
              type="password"
              maxLength="4"
              className="modal-input"
              {...register("cvv")}
              value={cvv}
              onChange={(e) => setCvv(e.target.value)}
            />
            <p className="error">{errors.cvv?.message}</p>

            {/* BUTTONS */}
            <div className="modal-buttons">
              <button className="save-btn" onClick={handleSubmit(saveCardInfo)}>
                Save
              </button>

              <button
                className="clear-btn"
                onClick={() => {
                  reset();
                  setSelectedBank("");
                  setCardNumber("");
                  setCardName("");
                  setExpiry("");
                  setCvv("");
                }}
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyProfile;
