import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUser,
  uploadCv,
  deleteCvThunk,
  updateBankCardThunk,
  deleteBankCardThunk,
} from "../Features/UserSlice";
import { useNavigate } from "react-router-dom";
import "../Styles/UserProfile.css";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { bankCardSchema } from "../Validations/BankCardValidation";
import * as ENV from "../config";

const StudentProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.users);

  const [preview, setPreview] = useState(null);
  const [showCardModal, setShowCardModal] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(bankCardSchema),
  });

  // Load logged user
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("loggedUser"));
    if (!saved?.email) return navigate("/login");

    dispatch(fetchUser(saved.email));
  }, [dispatch, navigate]);

  // Prefill card modal when opened
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

  if (!user) return <p>Loading...</p>;

  const handleCvUpload = (e) => {
    if (!e.target.files[0]) return;
    dispatch(uploadCv({ file: e.target.files[0], email: user.email }));
  };

  const handleImageChange = (e) => {
    const f = e.target.files[0];
    if (f) setPreview(URL.createObjectURL(f));
  };

  const onSaveCard = (data) => {
    dispatch(updateBankCardThunk({ email: user.email, ...data }));
    setShowCardModal(false);
  };

  return (
    <div className="profile-page">

      {/* ------------ PROFILE CARD ------------ */}
      <div className="profile-card">
        <div className="profile-left">
          <div className="profile-img-container">
            <img
              src={
                preview ||
                user.profileImage ||
                "https://cdn-icons-png.flaticon.com/512/149/149071.png"
              }
              className="profile-img"
            />

            <label htmlFor="imageUpload" className="upload-circle-C">
              📷
            </label>

            <input
              type="file"
              id="imageUpload"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: "none" }}
            />
          </div>

          <div>
            <h2 className="profile-name">{user.name}</h2>
            <p className="profile-email">{user.email}</p>
            <p className="profile-detail">
              {user.major} {user.age ? `• Age ${user.age}` : ""}
            </p>
          </div>
        </div>
      </div>

      {/* ------------ ACADEMIC INFO ------------ */}
      <div className="payment-box">
        <h3>Academic Information</h3>

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
          <strong>Status:</strong> <span className="status active">Active</span>
        </p>
      </div>

      {/* ------------ CV SECTION ------------ */}
      <div className="payment-box">
        <h3>Curriculum Vitae (CV)</h3>

        {user.cvLink ? (
          <div className="cv-section">
            <p className="cv-success">CV Uploaded Successfully</p>

            <div className="cv-actions">

              {/* ---- VIEW CV ---- */}
              <a
                href={`${ENV.SERVER_URL}${user.cvLink}`}
                target="_blank"
                className="cv-btn view"
              >
                View
              </a>

              {/* Hidden input for replace */}
              <input
                type="file"
                id="cvReplaceInput"
                accept=".pdf"
                style={{ display: "none" }}
                onChange={(e) =>
                  dispatch(uploadCv({ file: e.target.files[0], email: user.email }))
                }
              />

              {/* Replace button */}
              <button
                className="cv-btn replace"
                onClick={() =>
                  document.getElementById("cvReplaceInput").click()
                }
              >
                Replace
              </button>

              {/* Delete button */}
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
            <input
              type="file"
              id="cvUpload"
              accept=".pdf"
              style={{ display: "none" }}
              onChange={handleCvUpload}
            />

            <label htmlFor="cvUpload" className="upload-cv-btn">
              Upload CV (PDF)
            </label>
          </>
        )}
      </div>

      {/* ------------ BANK CARD SECTION ------------ */}
      <div className="payment-box">
        <h3>Bank / Benefit Card</h3>

        <div className="card-preview">
          <div className="bank-card teal-card">
            <div className="bank-chip"></div>

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
          {!user.cardNumber ? (
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
                Edit
              </button>

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

      {/* ------------ BANK MODAL ------------ */}
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

            {/* BANK OPTIONS */}
            <label>Select Bank</label>
            <div className="bank-radio-row">
              {["Bank Muscat", "Bank Dhofar", "NBO"].map((bank) => (
                <label key={bank}>
                  <input type="radio" value={bank} {...register("selectedBank")} />
                  {bank}
                </label>
              ))}
            </div>
            <p className="error">{errors.selectedBank?.message}</p>

            {/* CARD NUMBER */}
            <label>Card Number</label>
            <input
              className="modal-input"
              {...register("cardNumber", {
                onChange: (e) => {
                  let v = e.target.value.replace(/\D/g, "");
                  v = v.match(/.{1,4}/g)?.join(" ") || v;
                  setValue("cardNumber", v);
                },
              })}
            />
            <p className="error">{errors.cardNumber?.message}</p>

            {/* NAME */}
            <label>Cardholder Name</label>
            <input className="modal-input" {...register("cardName")} />
            <p className="error">{errors.cardName?.message}</p>

            {/* EXPIRY */}
            <label>Expiration Date</label>
            <input type="month" className="modal-input" {...register("expiry")} />
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

            {/* BUTTONS */}
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
