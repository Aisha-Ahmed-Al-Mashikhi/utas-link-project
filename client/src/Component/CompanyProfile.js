import React, { useState, useEffect } from "react";
import "../Styles/UserProfile.css"; // نستخدم نفس التنسيق لصفحة الطالب

const CompanyProfile = () => {
  const [company, setCompany] = useState(null);
  const [payment, setPayment] = useState(null);
  const [showEditCompany, setShowEditCompany] = useState(false);
  const [showEditPayment, setShowEditPayment] = useState(false);
  const [jobCount, setJobCount] = useState(0);

  // ✅ تحميل بيانات الشركة من localStorage
  useEffect(() => {
    const storedCompany = localStorage.getItem("companyData");
    if (storedCompany) setCompany(JSON.parse(storedCompany));

    const storedPayment = localStorage.getItem("companyPayment");
    if (storedPayment) setPayment(JSON.parse(storedPayment));

    const storedJobs = localStorage.getItem("jobs");
    if (storedJobs) {
      const jobs = JSON.parse(storedJobs);
      setJobCount(jobs.length);
    }
  }, []);

  // ✅ حفظ بيانات الشركة بعد التعديل
  const handleSaveCompany = (e) => {
    e.preventDefault();
    localStorage.setItem("companyData", JSON.stringify(company));
    setShowEditCompany(false);
    alert("Company info updated ✅");
  };

  // ✅ حفظ أو تعديل بيانات الدفع
  const handleSavePayment = (e) => {
    e.preventDefault();
    localStorage.setItem("companyPayment", JSON.stringify(payment));
    setShowEditPayment(false);
    alert("Bank details saved ✅");
  };

  // ✅ حذف بيانات الدفع
  const handleDeletePayment = () => {
    localStorage.removeItem("companyPayment");
    setPayment(null);
    alert("Bank details removed 🗑️");
  };

  if (!company)
    return <p style={{ textAlign: "center" }}>Loading company data...</p>;

  return (
    <div className="profile-page">
      {/* ----- Company Info ----- */}
      <div className="profile-card">
        <div className="profile-left">
          <div className="profile-icon">🏢</div>
          <div>
            <h2 className="profile-name">{company.companyName}</h2>
            <p className="profile-email">{company.email}</p>
            <p className="profile-detail">
              {company.industry} • {company.location}
            </p>
            <p className="profile-detail">
              Founded: {company.foundedDate || "N/A"}
            </p>
          </div>
        </div>
        <button className="update-btn" onClick={() => setShowEditCompany(true)}>
          Update Info
        </button>
      </div>

      {/* ----- Job Statistics ----- */}
      <div className="history-box">
        <h3>📋 Job Statistics</h3>
        <p>
          Total Jobs Posted: <strong>{jobCount}</strong>
        </p>
      </div>

      {/* ----- Bank Details ----- */}
      <div className="payment-box">
        <h3>🏦 Bank Details</h3>

        {!payment ? (
          <div>
            <p>No bank details added yet.</p>
            <button
              className="add-btn"
              onClick={() => setShowEditPayment(true)}
            >
              ➕ Add Bank Info
            </button>
          </div>
        ) : (
          <div className="payment-info">
            <p>👤 Account Holder: {payment.accountHolder}</p>
            <p>🏦 Bank Name: {payment.bankName}</p>
            <p>💳 Account Number: {payment.accountNumber}</p>
            <p>🔢 IBAN: {payment.iban}</p>

            <div className="payment-actions">
              <button
                className="update-btn small"
                onClick={() => setShowEditPayment(true)}
              >
                ✏️ Edit Bank
              </button>
              <button
                className="delete-btn small"
                onClick={handleDeletePayment}
              >
                🗑️ Delete
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ----- Modal: Edit Company Info ----- */}
      {showEditCompany && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Edit Company Info</h3>
            <form onSubmit={handleSaveCompany}>
              <label>Company Name</label>
              <input
                type="text"
                value={company.companyName}
                onChange={(e) =>
                  setCompany({ ...company, companyName: e.target.value })
                }
              />

              <label>Email</label>
              <input
                type="email"
                value={company.email}
                onChange={(e) =>
                  setCompany({ ...company, email: e.target.value })
                }
              />

              <label>Industry</label>
              <input
                type="text"
                value={company.industry}
                onChange={(e) =>
                  setCompany({ ...company, industry: e.target.value })
                }
              />

              <label>Location</label>
              <input
                type="text"
                value={company.location}
                onChange={(e) =>
                  setCompany({ ...company, location: e.target.value })
                }
              />

              <label>Founded Date</label>
              <input
                type="date"
                value={company.foundedDate}
                onChange={(e) =>
                  setCompany({ ...company, foundedDate: e.target.value })
                }
              />

              <div className="modal-btns">
                <button type="submit" className="save-btn">
                  Save
                </button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowEditCompany(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ----- Modal: Edit/Add Bank Info ----- */}
      {showEditPayment && (
        <div className="modal-overlay">
          <div className="modal-content small">
            <h3>💳 {payment ? "Edit Bank Info" : "Add Bank Info"}</h3>
            <form onSubmit={handleSavePayment}>
              <label>Account Holder</label>
              <input
                type="text"
                placeholder="e.g. Dhofar Advertising Co."
                value={payment ? payment.accountHolder || "" : ""}
                onChange={(e) =>
                  setPayment({
                    ...payment,
                    accountHolder: e.target.value,
                  })
                }
                required
              />

              <label>Bank Name</label>
              <select
                value={payment ? payment.bankName || "" : ""}
                onChange={(e) =>
                  setPayment({
                    ...payment,
                    bankName: e.target.value,
                  })
                }
                required
              >
                <option value="">Select your bank</option>
                <option>Bank Muscat</option>
                <option>Bank Dhofar</option>
                <option>National Bank of Oman</option>
                <option>Oman Arab Bank</option>
                <option>Sohar International</option>
              </select>

              <label>IBAN</label>
              <input
                type="text"
                placeholder="e.g. OM84 0000 0000 1234 5678 9012"
                value={payment ? payment.iban || "" : ""}
                onChange={(e) =>
                  setPayment({
                    ...payment,
                    iban: e.target.value,
                  })
                }
              />

              <label>Account Number</label>
              <input
                type="text"
                placeholder="e.g. 123456789012"
                value={payment ? payment.accountNumber || "" : ""}
                onChange={(e) =>
                  setPayment({
                    ...payment,
                    accountNumber: e.target.value,
                  })
                }
              />

              <div className="modal-btns">
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
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyProfile;
