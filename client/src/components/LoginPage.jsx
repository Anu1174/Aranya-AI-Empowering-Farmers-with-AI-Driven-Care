import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./AuthPages.css";
import cattleImg from "../images/login.png";

function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [contact, setContact] = useState(""); // email or phone
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        contact: contact.toLowerCase(),
        password,
      });

      // ✅ Store token and fullName in localStorage
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("fullName", res.data.fullName);

      alert(res.data.message);
      navigate("/dashboard"); // navigate after storing
    } catch (err) {
      setError(err.response?.data?.message || t("loginFailed") || "Login failed");
    }
  };

  return (
    <div className="auth-container">
      <button className="back-btn" onClick={() => navigate("/")}>
        ← {t("back")}
      </button>

      <div className="auth-card">
  {/* Logo at the top center */}
  <img src={cattleImg} alt="Logo" className="login-logo" />
  <h1>
          {t("welcome") }<br/> <span style={{ color: "#2d6a4f" }}>    Cattle Care</span>
        </h1>

  <h2>{t("login")}</h2>
  {error && <p className="error">{error}</p>}
  <form onSubmit={handleLogin}>
    <input
      type="text"
      placeholder={t("emailPlaceholder") || "Enter email or phone number"}
      value={contact}
      onChange={(e) => setContact(e.target.value)}
      required
    />
    <input
      type="password"
      placeholder={t("passwordPlaceholder") || "Password"}
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      required
    />
    <button type="submit">{t("signIn") || "Sign In"}</button>
  </form>

  <div className="links">
    <button onClick={() => navigate("/reset-password")}>
      {t("forgotPassword") || "Forgot Password"}
    </button>
    <button onClick={() => navigate("/signup")}>Need an accound?
      {t("signup") || "Sign Up"}
    </button>
  </div>
</div>

    </div>
  );
}

export default LoginPage;
