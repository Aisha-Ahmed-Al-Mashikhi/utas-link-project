import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../Styles/UserProfile.css";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { bankCardSchema } from "../Validations/Bank";

const UserProfile = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState({});
  const [preview, setPreview] = useState(null);

  // Modal
  const [showCardModal, setShowCardModal] = useState(false);

  // React Hook Form for card validation
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(bankCardSchema),
  });

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("loggedUser"));
    if (!savedUser?.email) {
      alert("Please log in again.");
      navigate("/login");
      return;
    }

    axios
      .get(`http://localhost:3001/user/${savedUser.email}`)
      .then((res) => {
        setUser(res.data);

        // Load saved card info into form
        reset({
          selectedBank: res.data.bankName || "",
          cardNumber: res.data.cardNumber || "",
          cardName: res.data.cardName || "",
          expiry: res.data.expiry || "",
          cvv: res.data.cvv || "",
        });
      })
      .catch((err) => console.error("Error fetching profile:", err));
  }, [navigate, reset]);

  // Upload CV
  const handleCvUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("cv", file);
    formData.append("email", user.email);

    try {
      const res = await axios.post("http://localhost:3001/uploadCV", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.cvLink) {
        setUser((prev) => ({ ...prev, cvLink: res.data.cvLink }));
        alert("CV uploaded successfully!");
      }
    } catch (err) {
      alert("Failed to upload CV.");
    }
  };

  // Image Preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setPreview(URL.createObjectURL(file));
  };

  // SAVE card to server
  const saveCardInfo = async (data) => {
    try {
      await axios.put("http://localhost:3001/updateBankCard", {
        email: user.email,
        ...data,
      });

      alert("Card saved successfully!");
      setShowCardModal(false);

      // Update displayed preview card
      setUser((prev) => ({
        ...prev,
        bankName: data.selectedBank,
        cardNumber: data.cardNumber,
        cardName: data.cardName,
        expiry: data.expiry,
      }));
    } catch (err) {
      alert("Error saving card.");
    }
  };

  if (!user?.email) return <p>Loading profile...</p>;

  return (
    <div className="profile-page">
      {/* Profile Section */}
      <div className="profile-card">
        <div className="profile-left">
          <div className="profile-img-container">
            <img
              src={
                preview ||
                user.profileImage ||
                "https://cdn-icons-png.flaticon.com/512/149/149071.png"
              }
              alt="profile"
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
            />
          </div>

          <div>
            <h2 className="profile-name">{user.name}</h2>
            <p className="profile-email">{user.email}</p>
            <p className="profile-detail">
              {user.major || "Student"} {user.age ? `• Age ${user.age}` : ""}
            </p>
          </div>
        </div>
      </div>

      {/* Academic Info */}
      <div className="payment-box">
        <h3>Academic Information</h3>
        <div className="payment-info">
          <p>
            <strong>Major:</strong> {user.major || "—"}
          </p>
          <p>
            <strong>Age:</strong> {user.age || "—"}
          </p>
          <p>
            <strong>Role:</strong> {user.role || "Student"}
          </p>
          <p>
            <strong>Status:</strong>{" "}
            <span className="status active">Active</span>
          </p>
        </div>
      </div>

      {/* CV Section */}
      <div className="payment-box">
        <h3>Curriculum Vitae (CV)</h3>

        {user.cvLink ? (
          <div className="cv-section">
            <p>CV Uploaded Successfully</p>
            <a href={user.cvLink} target="_blank" className="cv-link">
              View CV
            </a>
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

      {/* CARD DISPLAY */}
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

        <button
          className="open-card-btn"
          onClick={() => setShowCardModal(true)}
        >
          {user.cardNumber ? "Edit Card" : "+ Enter your card"}
        </button>
      </div>

      {/* MODAL */}
      {showCardModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-header">
              <h3>Enter Card Details</h3>
              <button
                className="close-btn"
                onClick={() => setShowCardModal(false)}
              >
                ×
              </button>
            </div>

            {/* BANK */}
            <label>Select Bank</label>
            <div className="bank-radio-row">
              <label>
                <input
                  type="radio"
                  value="Bank Muscat"
                  {...register("selectedBank")}
                />
                Bank Muscat
              </label>

              <label>
                <input
                  type="radio"
                  value="Bank Dhofar"
                  {...register("selectedBank")}
                />
                Bank Dhofar
              </label>

              <label>
                <input type="radio" value="NBO" {...register("selectedBank")} />
                NBO
              </label>
            </div>
            <p className="error">{errors.selectedBank?.message}</p>

            {/* Card Number */}
            <label>Card Number</label>
            <input
              className="modal-input"
              {...register("cardNumber")}
              onChange={(e) => {
                let value = e.target.value.replace(/\D/g, "");
                value = value.match(/.{1,4}/g)?.join(" ") || value;
                setValue("cardNumber", value);
              }}
            />
            <p className="error">{errors.cardNumber?.message}</p>

            {/* Name */}
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

            {/* Save + Clear */}
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

export default UserProfile;
