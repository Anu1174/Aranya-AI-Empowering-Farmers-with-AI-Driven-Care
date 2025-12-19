import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AuthPages.css";
import axios from "axios";
import { useTranslation } from "react-i18next";

function SignupPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState(""); // NEW: full name
  const [contact, setContact] = useState(""); // email or phone
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  // Validate email or phone
  const validateContact = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;
    if (emailRegex.test(value) || phoneRegex.test(value)) {
      setError("");
      return true;
    } else {
      setError(t("invalidEmailOrPhone") || "Enter valid email or 10-digit phone");
      return false;
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!fullName) {
      alert("Full name is required");
      return;
    }
    if (!validateContact(contact)) return;
    if (password !== confirmPassword) {
      alert(t("confirmPasswordMismatch") || "Passwords do not match");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/auth/signup", {
        fullName,        // send fullName to backend
        contact: contact.toLowerCase(),
        password,
      });
      alert(res.data.message);
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || t("signupFailed") || "Signup failed");
    }
  };

  return (
    <div className="auth-container">
      <button className="back-btn" onClick={() => navigate("/login")}>← {t("back")}</button>

      <div className="auth-card">
        <h2>{t("createAccount")}</h2>
        <form onSubmit={handleSignup}>
          {/* Full Name Input */}
          <input
            type="text"
            placeholder={t("fullNamePlaceholder")}
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />

          {/* Email/Phone Input */}
          <input
            type="text"
            placeholder={t("emailPlaceholder") || "Enter email or phone number"}
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            required
          />
          {error && <p style={{ color: "red", fontSize: "0.9rem" }}>{error}</p>}

          {/* Password Input */}
          <input
            type="password"
            placeholder={t("passwordPlaceholder") || "Password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {/* Confirm Password Input */}
          <input
            type="password"
            placeholder={t("confirmPasswordPlaceholder") || "Confirm Password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <button type="submit">{t("createAccountBtn") || "Create Account"}</button>
        </form>
      </div>
    </div>
  );
}

export default SignupPage;
