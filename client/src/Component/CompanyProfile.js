import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateBankInfo, fetchCompany } from "../Features/CompanySlice";
import { useNavigate } from "react-router-dom";
import "../Styles/UserProfile.css";

const CompanyProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { company, isLoading } = useSelector((state) => state.companies);

  const [showEditPayment, setShowEditPayment] = useState(false);
  const [payment, setPayment] = useState({
    accountHolder: "",
    bankName: "",
    accountNumber: "",
    iban: "",
  });

  // Load company data from Redux or localStorage
  useEffect(() => {
    const role = localStorage.getItem("role");
    const savedUser = JSON.parse(localStorage.getItem("loggedUser"));

    if (!role || !savedUser?.email) {
      alert("Please log in again.");
      navigate("/login");
      return;
    }

    // Fetch company data if not already loaded
    if (!company?.email) {
      dispatch(fetchCompany(savedUser.email));
    }
  }, [dispatch, company?.email, navigate]);

  // Save or update bank details
  const handleSavePayment = (e) => {
    e.preventDefault();

    const savedUser = JSON.parse(localStorage.getItem("loggedUser"));
    if (!savedUser?.email) {
      alert("Please log in first!");
      return;
    }

    dispatch(updateBankInfo({ email: savedUser.email, bankData: payment }))
      .unwrap()
      .then(() => {
        alert("Bank details saved successfully!");
        setShowEditPayment(false);
      })
      .catch(() => alert("Failed to save bank details."));
  };

  if (isLoading) return <p>Loading company data...</p>;
  if (!company || !company.companyName)
    return <p>No company data found. Please log in again.</p>;

  return (
    <div className="profile-page">
      <div className="profile-card">
        <div className="profile-left">
          <div className="profile-icon">🏢</div>
          <div>
            <h2 className="profile-name">{company.companyName}</h2>
            <p className="profile-email">{company.email}</p>
            <p className="profile-detail">
              {company.industry} • {company.location}
            </p>
          </div>
        </div>
      </div>

      <div className="payment-box">
        <h3>Bank Details</h3>

        {!company.bankInfo ? (
          <div>
            <p>No bank details added yet.</p>
            <button
              className="add-btn"
              onClick={() => setShowEditPayment(true)}
            >
              Add Bank Info
            </button>
          </div>
        ) : (
          <div className="payment-info">
            <p>Account Holder: {company.bankInfo?.accountHolder}</p>
            <p>Bank Name: {company.bankInfo?.bankName}</p>
            <p>Account Number: {company.bankInfo?.accountNumber}</p>
            <p>IBAN: {company.bankInfo?.iban}</p>

            <button
              className="update-btn small"
              onClick={() => setShowEditPayment(true)}
            >
              Edit Bank
            </button>
          </div>
        )}
      </div>

      {showEditPayment && (
        <div className="modal-overlay">
          <div className="modal-content small">
            <h3>Edit Bank Info</h3>
            <form onSubmit={handleSavePayment}>
              <label>Account Holder</label>
              <input
                type="text"
                value={payment.accountHolder}
                onChange={(e) =>
                  setPayment({ ...payment, accountHolder: e.target.value })
                }
              />
              <label>Bank Name</label>
              <input
                type="text"
                value={payment.bankName}
                onChange={(e) =>
                  setPayment({ ...payment, bankName: e.target.value })
                }
              />
              <label>IBAN</label>
              <input
                type="text"
                value={payment.iban}
                onChange={(e) =>
                  setPayment({ ...payment, iban: e.target.value })
                }
              />
              <label>Account Number</label>
              <input
                type="text"
                value={payment.accountNumber}
                onChange={(e) =>
                  setPayment({ ...payment, accountNumber: e.target.value })
                }
              />
              <button type="submit" className="save-btn">
                Save
              </button>
              <button
                type="button"
                className="cancel-btn"
                onClick={() => setShowEditPayment(false)}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyProfile;
