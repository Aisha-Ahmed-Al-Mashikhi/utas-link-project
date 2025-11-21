import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../Styles/UserProfile.css";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { bankCardSchema } from "../Validations/Bank";

const StudentProfile = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState({});
  const [preview, setPreview] = useState(null);
  const [showCardModal, setShowCardModal] = useState(false);

  // RHF
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(bankCardSchema),
  });

  // Load profile
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

        reset({
          selectedBank: res.data.bankName || "",
          cardNumber: res.data.cardNumber || "",
          cardName: res.data.cardName || "",
          expiry: res.data.expiry || "",
          cvv: res.data.cvv || "",
        });
      })
      .catch((err) => console.error(err));
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
    } catch {
      alert("Failed to upload CV.");
    }
  };

  // Delete CV
  const handleDeleteCV = async () => {
    const confirmDelete = window.confirm("Delete your CV?");
    if (!confirmDelete) return;

    try {
      await axios.put("http://localhost:3001/deleteCV", { email: user.email });

      setUser((prev) => ({ ...prev, cvLink: null }));

      alert("CV deleted successfully!");
    } catch {
      alert("Error deleting CV.");
    }
  };

  // Replace CV
  const handleReplaceCV = () => {
    document.getElementById("cvReplaceInput").click();
  };

  // Image preview
  const handleImageChange = (e) => {
    const f = e.target.files[0];
    if (f) setPreview(URL.createObjectURL(f));
  };

  // DELETE BANK CARD
  const handleDeleteBankCard = async () => {
    const ok = window.confirm("Delete saved card?");
    if (!ok) return;

    try {
      await axios.put("http://localhost:3001/updateBankCard", {
        email: user.email,
        bankName: "",
        cardNumber: "",
        cardName: "",
        expiry: "",
        cvv: "",
      });

      setUser((prev) => ({
        ...prev,
        bankName: "",
        cardNumber: "",
        cardName: "",
        expiry: "",
        cvv: "",
      }));

      alert("Card deleted.");
    } catch {
      alert("Failed to delete card.");
    }
  };

  // SAVE CARD
  const saveCardInfo = async (data) => {
    try {
      await axios.put("http://localhost:3001/updateBankCard", {
        email: user.email,
        bankName: data.selectedBank,
        cardNumber: data.cardNumber,
        cardName: data.cardName,
        expiry: data.expiry,
        cvv: data.cvv,
      });

      alert("Card saved successfully!");
      setShowCardModal(false);

      setUser((prev) => ({
        ...prev,
        bankName: data.selectedBank,
        cardNumber: data.cardNumber,
        cardName: data.cardName,
        expiry: data.expiry,
        cvv: data.cvv,
      }));
    } catch {
      alert("Error saving card.");
    }
  };

  if (!user?.email) return <p>Loading profile...</p>;

  return (
    <div className="profile-page">
      {/* PROFILE CARD */}
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

      {/* ACADEMIC INFO */}
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

      {/* CV */}
      <div className="payment-box">
        <h3>Curriculum Vitae (CV)</h3>

        {user.cvLink ? (
          <div className="cv-section">
            <p className="cv-success">CV Uploaded Successfully</p>

            <div className="cv-actions">
              <a href={user.cvLink} target="_blank" className="cv-btn view">
                View
              </a>

              <input
                type="file"
                id="cvReplaceInput"
                accept=".pdf"
                style={{ display: "none" }}
                onChange={handleCvUpload}
              />

              <button className="cv-btn replace" onClick={handleReplaceCV}>
                Replace
              </button>

              <button className="cv-btn delete" onClick={handleDeleteCV}>
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

      {/* BANK CARD */}
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
          {!user.cardNumber && (
            <button
              className="add-card-btn"
              onClick={() => setShowCardModal(true)}
            >
              + Add Card
            </button>
          )}

          {user.cardNumber && (
            <>
              <button
                className="edit-card-btn"
                onClick={() => setShowCardModal(true)}
              >
                Edit Card
              </button>

              <button
                className="delete-card-btn"
                onClick={handleDeleteBankCard}
              >
                Delete Card
              </button>
            </>
          )}
        </div>
      </div>

      {/* MODAL */}
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
              <label>
                <input
                  type="radio"
                  value="Bank Muscat"
                  {...register("selectedBank", {
                    onChange: (e) => setValue("selectedBank", e.target.value),
                  })}
                />
                Bank Muscat
              </label>

              <label>
                <input
                  type="radio"
                  value="Bank Dhofar"
                  {...register("selectedBank", {
                    onChange: (e) => setValue("selectedBank", e.target.value),
                  })}
                />
                Bank Dhofar
              </label>

              <label>
                <input
                  type="radio"
                  value="NBO"
                  {...register("selectedBank", {
                    onChange: (e) => setValue("selectedBank", e.target.value),
                  })}
                />
                NBO
              </label>
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
            <input
              className="modal-input"
              {...register("cardName", {
                onChange: (e) => setValue("cardName", e.target.value),
              })}
            />
            <p className="error">{errors.cardName?.message}</p>

            {/* EXPIRY */}
            <label>Expiration Date</label>
            <input
              type="month"
              className="modal-input"
              {...register("expiry", {
                onChange: (e) => setValue("expiry", e.target.value),
              })}
            />
            <p className="error">{errors.expiry?.message}</p>

            {/* CVV */}
            <label>CVV</label>
            <input
              type="password"
              maxLength="4"
              className="modal-input"
              {...register("cvv", {
                onChange: (e) => setValue("cvv", e.target.value),
              })}
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

export default StudentProfile;
