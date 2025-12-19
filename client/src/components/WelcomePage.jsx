import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import i18n from '../i18n'; // your i18n config file
import LanguageSelector from "./LanguageSelector";
import "./AuthPages.css";
import cattleImg from "../images/cow.jpg";

const WelcomePage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation(); // ✅ useTranslation hook

  return (
    <div className="welcome-container">
      <div className="welcome-content">
        <h1>
          {t("welcome") }<br/> <span style={{ color: "#2d6a4f" }}>    Cattle Care</span>
        </h1>
        <p>{t("description")}</p>

        {/* Language Selector */}
        <LanguageSelector />

        {/* Only Login Button */}
        <div className="btn-group">
          <button onClick={() => navigate("/login")}>{t("login")}</button>
        </div>
      </div>

      {/* Cattle Illustration */}
      <div className="welcome-image">
        <img src={cattleImg} alt="Cattle illustration" />
      </div>

    </div>
  );
};

export default WelcomePage;
