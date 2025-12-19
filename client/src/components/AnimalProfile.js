import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { useNavigate, useParams } from "react-router-dom";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "../components/AuthPages.css";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function AnimalProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [animal, setAnimal] = useState(null);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState("January");
  const [day, setDay] = useState(1);
  const [temperature, setTemperature] = useState("");
  const [heartRate, setHeartRate] = useState("");
  const [activity, setActivity] = useState("");
  const [appetite, setAppetite] = useState("");
  const [oxygen, setOxygen] = useState("");
  const [history, setHistory] = useState([]);
  const [showGraph, setShowGraph] = useState(false);

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  useEffect(() => {
    fetchAnimal();
    fetchLogs();
  }, []);

  const fetchAnimal = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/animal`);
      const data = await res.json();
      if (res.ok) {
        const selected = data.find((a) => a._id === id);
        setAnimal(selected);
      }
    } catch (err) {
      console.error("Error fetching animal:", err);
    }
  };

  const fetchLogs = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/animal/${id}/health`);
      const data = await res.json();
      if (res.ok) setHistory(data);
    } catch (err) {
      console.error("Error fetching logs:", err);
    }
  };

  // ✅ ML model prediction
  const getRiskFromModel = async () => {
    try {
      const response = await fetch("http://localhost:5001/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          temperature: parseFloat(temperature),
          heartRate: parseFloat(heartRate),
          activity: parseFloat(activity),
          appetite: parseFloat(appetite),
          oxygen: parseFloat(oxygen),
        }),
      });

      const data = await response.json();
      return data?.risk ?? 0;
    } catch (error) {
      console.error("Error fetching risk prediction:", error);
      alert(" Error connecting to ML model server!");
      return 0;
    }
  };

  // ✅ Save health data for the month
  const handleSaveMonth = async () => {
    if (
      !temperature ||
      !heartRate ||
      !activity ||
      !appetite ||
      !oxygen ||
      !day
    ) {
      alert("⚠️ Please enter all fields: Temperature, Heart Rate, Activity, Appetite, Oxygen, and Day");
      return;
    }

    const duplicate = history.some(
      (log) => log.month === month && log.year === year && log.day === day
    );
    if (duplicate) {
      alert(`⚠️ Data for ${month} ${day}, ${year} already exists.`);
      return;
    }

    const risk = await getRiskFromModel();

    try {
      const response = await fetch(
        `http://localhost:5000/api/animal/${id}/health`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            temperature: parseFloat(temperature),
            heartRate: parseFloat(heartRate),
            activity: parseFloat(activity),
            appetite: parseFloat(appetite),
            oxygen: parseFloat(oxygen),
            month,
            year,
            day,
            risk,
          }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        alert(" Health data saved successfully with ML prediction!");
        fetchLogs();
      } else {
        alert(data.message || "⚠️ Error saving data");
      }
    } catch (err) {
      console.error("Server error while saving month:", err);
      alert("Server error while saving data");
    }
  };

  const handleShowGraph = () => {
    if (history.length === 0) {
      alert("No data to show");
      return;
    }
    setShowGraph(true);
  };

  const handleSaveHealthLog = async () => {
    await handleSaveMonth();
    await fetchLogs();
    navigate("/dashboard", { state: { refresh: true } });
  };

  // ✅ Dynamic day limit based on month/year
  const getMaxDays = (month, year) => {
    const monthIndex = months.indexOf(month);
    return new Date(year, monthIndex + 1, 0).getDate();
  };

  const filteredHistory = history.filter(
    (log) => log.month === month && log.year === year
  );

  const chartData = {
    labels: filteredHistory.map((log) => log.day),
    datasets: [
      {
        label: "Temperature (°C)",
        data: filteredHistory.map((log) => log.temperature),
        borderColor: "#007f39",
        backgroundColor: "rgba(0,127,57,0.2)",
        tension: 0.4,
        fill: true,
      },
      {
        label: "Heart Rate (bpm)",
        data: filteredHistory.map((log) => log.heartRate),
        borderColor: "#e74c3c",
        backgroundColor: "rgba(231,76,60,0.2)",
        tension: 0.4,
        fill: true,
      },
      {
        label: "Activity",
        data: filteredHistory.map((log) => log.activity || 0),
        borderColor: "#3498db",
        backgroundColor: "rgba(52,152,219,0.2)",
        tension: 0.4,
        fill: true,
      },
      {
        label: "Appetite",
        data: filteredHistory.map((log) => log.appetite || 0),
        borderColor: "#9b59b6",
        backgroundColor: "rgba(155,89,182,0.2)",
        tension: 0.4,
        fill: true,
      },
      {
        label: "Oxygen (%)",
        data: filteredHistory.map((log) => log.oxygen || 0),
        borderColor: "#3952ce",
        backgroundColor: "rgba(57,82,206,0.2)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  return (
    <div className="animal-log-container">
      <div className="animal-log-card">
        <h2>🐄 {animal?.name || "Animal"}'s Health Monitor</h2>

        {/* Year */}
        <div className="form-group">
          <label>Year</label>
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(parseInt(e.target.value))}
          />
        </div>

        {/* Month */}
        <div className="form-group">
          <label>Month</label>
          <select value={month} onChange={(e) => setMonth(e.target.value)}>
            {months.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        {/* Day */}
        <div className="form-group">
          <label>Day</label>
          <input
            type="number"
            min="1"
            max={getMaxDays(month, year)}
            value={day}
            onChange={(e) => setDay(parseInt(e.target.value))}
            placeholder={`1 - ${getMaxDays(month, year)}`}
          />
        </div>

        {/* Temperature */}
        <div className="form-group">
          <label>Temperature (°C)</label>
          <input
            type="number"
            value={temperature}
            onChange={(e) => setTemperature(e.target.value)}
            placeholder="e.g. 38.5"
          />
        </div>

        {/* Heart Rate */}
        <div className="form-group">
          <label>Heart Rate (bpm)</label>
          <input
            type="number"
            value={heartRate}
            onChange={(e) => setHeartRate(e.target.value)}
            placeholder="e.g. 70"
          />
        </div>

        {/* Activity */}
        <div className="form-group">
          <label>Activity (1–10)</label>
          <input
            type="number"
            min="1"
            max="10"
            value={activity}
            onChange={(e) => setActivity(e.target.value)}
            placeholder="e.g. 7"
          />
        </div>

        {/* Appetite */}
        <div className="form-group">
          <label>Appetite (1–10)</label>
          <input
            type="number"
            min="1"
            max="10"
            value={appetite}
            onChange={(e) => setAppetite(e.target.value)}
            placeholder="e.g. 8"
          />
        </div>

        {/* Oxygen */}
        <div className="form-group">
          <label>Oxygen Saturation (%)</label>
<input
            type="number"
            value={oxygen}
            onChange={(e) => setOxygen(e.target.value)}
            placeholder="e.g.70"
          />
        </div>

        {/* Buttons */}
        <div className="button-group">
          <button onClick={handleSaveMonth} className="add-btn">💾 Save Month</button>
          <button onClick={handleShowGraph} className="show-graph-btn">📈 Show Graph</button>
          <button onClick={handleSaveHealthLog} className="save-btn">✅ Save Health Log</button>
        </div>

        {/* Graph Section */}
        {showGraph && filteredHistory.length > 0 && (
          <div className="chart-section">
            <Line data={chartData} />
          </div>
        )}
      </div>
    </div>
  );
}
