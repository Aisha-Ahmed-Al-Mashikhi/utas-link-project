import React, { useState, useEffect } from "react";
import "../Styles/UserProfile.css";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [cvFile, setCvFile] = useState(null);

  const [showEditInfo, setShowEditInfo] = useState(false);
  const [showEditPayment, setShowEditPayment] = useState(false);

  const [payment, setPayment] = useState(null); // start empty
  const [jobHistory, setJobHistory] = useState([]);

  // ✅ Load data from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("userData");
    if (storedUser) setUser(JSON.parse(storedUser));

    const storedJobs = localStorage.getItem("appliedJobs");
    if (storedJobs) setJobHistory(JSON.parse(storedJobs));

    const storedPayment = localStorage.getItem("paymentInfo");
    if (storedPayment) setPayment(JSON.parse(storedPayment));

    const storedCV = localStorage.getItem("userCV");
    if (storedCV) setCvFile({ name: storedCV });
  }, []);

  // ✅ Upload CV
  const handleUploadCV = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCvFile(file);
      localStorage.setItem("userCV", file.name);
    }
  };

  // ✅ Save updated info
  const handleSaveInfo = (e) => {
    e.preventDefault();
    localStorage.setItem("userData", JSON.stringify(user));
    setShowEditInfo(false);
    alert("Profile updated ✅");
  };

  // ✅ Save payment info (add or edit)
  const handleSavePayment = (e) => {
    e.preventDefault();
    localStorage.setItem("paymentInfo", JSON.stringify(payment));
    setShowEditPayment(false);
    alert("Payment details saved ✅");
  };

  // ✅ Delete payment info
  const handleDeletePayment = () => {
    localStorage.removeItem("paymentInfo");
    setPayment(null);
    alert("Payment deleted 🗑️");
  };

  if (!user) return <p style={{ textAlign: "center" }}>Loading user data...</p>;

  return (
    <div className="profile-page">
      {/* ----- Profile Header ----- */}
      <div className="profile-card">
        <div className="profile-left">
          <div className="profile-icon">👤</div>
          <div>
            <h2 className="profile-name">{user.fullName}</h2>
            <p className="profile-email">{user.email}</p>
            <p className="profile-detail">
              {user.major} • Age: {user.age} • {user.role}
            </p>
            <div className="cv-section">
              <span className="cv-label">CV:</span>
              <label className="upload-btn">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleUploadCV}
                  style={{ display: "none" }}
                />
                ⬆ Upload
              </label>
              {cvFile && <span className="cv-file">📄 {cvFile.name}</span>}
            </div>
          </div>
        </div>
        <button className="update-btn" onClick={() => setShowEditInfo(true)}>
          Update Info
        </button>
      </div>

      {/* ----- Applications Section ----- */}
      <div className="history-box">
        <h3>My Applications</h3>
        {jobHistory.length > 0 ? (
          jobHistory.map((job, index) => (
            <div key={index} className="job-item">
              <div>
                <h4>{job.title}</h4>
                <p>{job.company}</p>
              </div>
              <p
                className={`status ${job.status
                  ?.toLowerCase()
                  .replace(" ", "-")}`}
              >
                {job.status}
              </p>
            </div>
          ))
        ) : (
          <p>No applications yet.</p>
        )}
      </div>

      {/* ----- Payment Section ----- */}
      <div className="payment-box">
        <h3>Payment Details</h3>

        {/* No Payment Yet */}
        {!payment && (
          <div>
            <p>
              No payment info yet. Add your payment details to receive payouts.
            </p>
            <button
              className="add-btn"
              onClick={() => setShowEditPayment(true)}
            >
              ➕ Add your Payment
            </button>
          </div>
        )}

        {/* Show Added Payment */}
        {payment && (
          <div className="payment-info">
            <p>👤 Account Holder: {payment.accountHolder}</p>
            <p>🏦 Bank Name: {payment.bankName}</p>
            <p>💳 Account Number: {payment.accountNumber}</p>
            <p>🔢 IBAN: {payment.iban}</p>
            <p>🏢 Branch: {payment.branch}</p>
            <p>🌐 SWIFT/BIC: {payment.swift}</p>

            <div className="payment-actions">
              <button
                className="update-btn small"
                onClick={() => setShowEditPayment(true)}
              >
                ✏️ Edit Payment
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

      {/* ----- Modal: Edit Info ----- */}
      {showEditInfo && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Edit Profile Info</h3>
            <form onSubmit={handleSaveInfo}>
              <label>Full Name</label>
              <input
                type="text"
                value={user.fullName}
                onChange={(e) => setUser({ ...user, fullName: e.target.value })}
              />
              <label>Email</label>
              <input
                type="email"
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
              />
              <label>Major</label>
              <input
                type="text"
                value={user.major}
                onChange={(e) => setUser({ ...user, major: e.target.value })}
              />
              <label>Age</label>
              <input
                type="number"
                value={user.age}
                onChange={(e) => setUser({ ...user, age: e.target.value })}
              />
              <div className="modal-btns">
                <button type="submit" className="save-btn">
                  Save
                </button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowEditInfo(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ----- Modal: Add/Edit Payment ----- */}
      {showEditPayment && (
        <div className="modal-overlay">
          <div className="modal-content small">
            <h3>💳 {payment ? "Edit Payment Info" : "Add Your Payment"}</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSavePayment(e);
              }}
            >
              <label>Account Holder Name</label>
              <input
                type="text"
                placeholder="e.g. Aisha Ahmed Al-Mashani"
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
                <option value="Bank Muscat">Bank Muscat</option>
                <option value="Bank Dhofar">Bank Dhofar</option>
                <option value="National Bank of Oman">
                  National Bank of Oman
                </option>
                <option value="Oman Arab Bank">Oman Arab Bank</option>
                <option value="Sohar International">Sohar International</option>
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

              <label>Branch (optional)</label>
              <input
                type="text"
                placeholder="e.g. Salalah Branch"
                value={payment ? payment.branch || "" : ""}
                onChange={(e) =>
                  setPayment({
                    ...payment,
                    branch: e.target.value,
                  })
                }
              />

              <label>SWIFT / BIC (optional)</label>
              <input
                type="text"
                placeholder="e.g. BMUSOMRXXXX"
                value={payment ? payment.swift || "" : ""}
                onChange={(e) =>
                  setPayment({
                    ...payment,
                    swift: e.target.value,
                  })
                }
              />

              <p className="note-text">
                ⚠️ Make sure your IBAN and account number match your registered
                bank details.
              </p>

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

export default UserProfile;
