import React, { useState } from "react";
import "./AuthPages.css";
import { useTranslation } from "react-i18next";


function ForgotPasswordPage({ onBackClick ,t}) {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");

  const handleSendLink = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      alert(data.message);
    } catch (err) {
      console.log(err);
      alert("Server error");
    }
  };

  return (
    <div className="auth-container">
        <button className="back-btn" onClick={() => navigate("/")}>← Back</button>
      <div className="auth-card">
        <h2>Forgot Password</h2>
        <form onSubmit={handleSendLink}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit">Send Link</button>
        </form>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
