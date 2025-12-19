import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function PredictRisk() {
  const location = useLocation();
  const { animal, log } = location.state;

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePredict = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5001/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          temperature: log.temperature,
          heartRate: log.heartRate,
        }),
      });

      const data = await response.json();
      if (response.ok) setPrediction(data.prediction);
      else alert(data.error || "Prediction error");
    } catch (err) {
      console.error(err);
      alert("Server error connecting to prediction API");
    }
    setLoading(false);
  };

  return (
    <div className="predict-container">
      <h2>🐄 Predict Risk for {animal.name}</h2>
      <p>
        Month: {log.month}, Temp: {log.temperature}°C, Heart Rate: {log.heartRate} bpm
      </p>
      <button onClick={handlePredict} disabled={loading}>
        {loading ? "Predicting..." : "Predict Risk"}
      </button>
      {prediction && (
        <div className="prediction-result">
          <h3>Predicted Risk Value: {prediction}</h3>
        </div>
      )}
    </div>
  );
}
