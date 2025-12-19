import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./AuthPages.css"; 
import { useTranslation } from "react-i18next";

function ResetPasswordPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { token } = useParams();
  const [contact, setContact] = useState(""); // email or phone
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const validateContact = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;
    return emailRegex.test(value) || phoneRegex.test(value);
  };

  const handleReset = async (e) => {
    e.preventDefault();
    if (!validateContact(contact)) {
      setError("Enter valid email or 10-digit phone");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/auth/reset-password", {
        token,
        contact: contact.toLowerCase(),
        newPassword,
      });

      setSuccess(res.data.message);
      setError("");

      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Reset failed");
      setSuccess("");
    }
  };

  return (
    <div className="auth-container">
      <button className="back-btn" onClick={() => navigate("/login")}>← Back</button>
      <div className="auth-card">
        <h2>{t("resetPassword") || "Reset Password"}</h2>

        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}

        <form onSubmit={handleReset}>
          <input
            type="text"
            placeholder={t("emailPlaceholder") || "Enter email or phone number"}
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder={t("passwordPlaceholder") || "New Password"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder={t("confirmPasswordplaceholder") || "Confirm Password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button type="submit">{t("Done") || "Done"}</button>
        </form>
      </div>
    </div>
  );
}

export default ResetPasswordPage;
