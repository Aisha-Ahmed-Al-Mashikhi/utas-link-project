import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "../Styles/UserProfile.css";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { bankCardSchema } from "../Validations/Bank";
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

  const [preview, setPreview] = useState(null);
  const [showCardModal, setShowCardModal] = useState(false);

  // BANK STATES – طريقة الأستاذة (useState + register)
  const [selectedBank, setSelectedBank] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  // RHF
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(bankCardSchema),
  });

  /* ====================================
        LOAD COMPANY
  ==================================== */
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("loggedUser"));
    if (!saved?.email) return navigate("/login");

    dispatch(fetchCompany(saved.email));
  }, [dispatch, navigate]);

  /* ====================================
        SYNC COMPANY DATA INTO FORM
  ==================================== */
  useEffect(() => {
    if (company?.email) {
      setSelectedBank(company.bankName || "");
      setCardNumber(company.cardNumber || "");
      setCardName(company.cardName || "");
      setExpiry(company.expiry || "");
      setCvv(company.cvv || "");

      reset({
        selectedBank: company.bankName || "",
        cardNumber: company.cardNumber || "",
        cardName: company.cardName || "",
        expiry: company.expiry || "",
        cvv: company.cvv || "",
      });
    }
  }, [company, reset]);

  /* ====================================
        UPLOAD PROFILE IMAGE
  ==================================== */
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    dispatch(uploadProfile({ email: company.email, file }));
    setPreview(URL.createObjectURL(file));
  };

  /* ====================================
        UPLOAD LICENSE PDF
  ==================================== */
  const handleLicenseUpload = (e) => {
    const f = e.target.files[0];
    if (!f) return;

    dispatch(uploadLicense({ email: company.email, file: f }));
  };

  /* ====================================
        DELETE LICENSE
  ==================================== */
  const handleDeleteLicense = () => {
    if (!window.confirm("Delete license?")) return;
    dispatch(deleteLicense(company.email));
  };

  /* ====================================
        SAVE BANK INFO
  ==================================== */
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

  /* ====================================
        DELETE BANK INFO
  ==================================== */
  const removeBank = () => {
    if (!window.confirm("Delete bank card?")) return;
    dispatch(deleteBankCard(company.email));

    reset();
    setSelectedBank("");
    setCardNumber("");
    setCardName("");
    setExpiry("");
    setCvv("");
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

        {company.licenseFile ? (
          <div className="cv-section">
            <p className="cv-success">License Uploaded Successfully</p>

            <div className="cv-actions">
              <a
                href={company.licenseFile}
                target="_blank"
                className="cv-btn view"
              >
                View
              </a>

              <label htmlFor="licenseUpload" className="cv-btn replace">
                Replace
              </label>

              <button className="cv-btn delete" onClick={handleDeleteLicense}>
                Delete
              </button>

              <input
                id="licenseUpload"
                type="file"
                accept=".pdf"
                style={{ display: "none" }}
                onChange={handleLicenseUpload}
              />
            </div>
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
            <label htmlFor="licenseUpload" className="upload-cv-btn">
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

      {/* ===== MODAL ===== */}
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
              <label>
                <input
                  type="radio"
                  value="Bank Muscat"
                  {...register("selectedBank")}
                  checked={selectedBank === "Bank Muscat"}
                  onChange={(e) => setSelectedBank(e.target.value)}
                />
                Bank Muscat
              </label>

              <label>
                <input
                  type="radio"
                  value="Bank Dhofar"
                  {...register("selectedBank")}
                  checked={selectedBank === "Bank Dhofar"}
                  onChange={(e) => setSelectedBank(e.target.value)}
                />
                Bank Dhofar
              </label>

              <label>
                <input
                  type="radio"
                  value="NBO"
                  {...register("selectedBank")}
                  checked={selectedBank === "NBO"}
                  onChange={(e) => setSelectedBank(e.target.value)}
                />
                NBO
              </label>
            </div>
            <p className="error">{errors.selectedBank?.message}</p>

            {/* NUMBER */}
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

            {/* NAME */}
            <label>Cardholder Name</label>
            <input
              className="modal-input"
              {...register("cardName")}
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
            />
            <p className="error">{errors.cardName?.message}</p>

            {/* EXPIRY */}
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

            <div className="modal-buttons">
              <button className="save-btn" onClick={handleSubmit(saveCardInfo)}>
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

export default CompanyProfile;
