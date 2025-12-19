import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../components/AuthPages.css";
import cowIcon from "../images/cow.jpg";
import logo from "../images/aranya-logo.png";

function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const fullName = localStorage.getItem("fullName") || "User";

  const [showModal, setShowModal] = useState(false);
  const [animals, setAnimals] = useState([]);
  const [newAnimal, setNewAnimal] = useState({ name: "", breed: "" });
  const [predictions, setPredictions] = useState({}); // store risk per animal per month
  const [chatOpen, setChatOpen] = useState(false);
const [userInput, setUserInput] = useState("");
const [chatResponse, setChatResponse] = useState("");

const handleChatSubmit = async () => {
  if (!userInput.trim()) return;
  try {
    const response = await fetch("http://localhost:5002/chatbot/symptoms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ symptoms: userInput }),
    });
    const data = await response.json();
    if (response.ok) {
      setChatResponse(`${data.Disease}: ${data.Description}\nTreatment: ${data.Solution}`);
    } else {
      setChatResponse(data.error || "Error fetching response");
    }
  } catch (error) {
    setChatResponse("Server error. Try again later.");
  }
};

const handleImageUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const formData = new FormData();
  formData.append("image", file);

  try {
    const response = await fetch("http://localhost:5002/chatbot/image", {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    if (response.ok) {
      setChatResponse(`${data.Disease}: ${data.Description}\nTreatment: ${data.Solution}`);
    } else {
      setChatResponse(data.error || "Error detecting disease");
    }
  } catch (error) {
    setChatResponse("Server error. Try again later.");
  }
};

  // Fetch animals
  useEffect(() => {
    const fetchAnimals = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/animal/");
        const data = await response.json();
        if (response.ok) setAnimals(data);
        else console.error("Failed to fetch animals:", data.message);
      } catch (err) {
        console.error("Error loading animals:", err);
      }
    };
    fetchAnimals();
  }, [location.state?.refresh]);

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("fullName");
    localStorage.removeItem("userId");
    navigate("/");
  };

  // Modal
  const handleAddAnimal = () => setShowModal(true);
  const handleModalClose = () => {
    setShowModal(false);
    setNewAnimal({ name: "", breed: "" });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAnimal({ ...newAnimal, [name]: value });
  };

  const handleSaveAnimal = async () => {
    if (!newAnimal.name || !newAnimal.breed) {
      alert("Enter both name and breed.");
      return;
    }
    try {
      const response = await fetch("http://localhost:5000/api/animal/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAnimal),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Animal added!");
        setAnimals([...animals, data]);
        handleModalClose();
      } else alert(data.message || "Failed");
    } catch (err) {
      console.error(err);
      alert("Server error while adding animal.");
    }
  };

  const handleOpenAnimal = (id) => {
    const animalData = animals.find((a) => a._id === id);
    navigate(`/animal/${id}`, { state: { animal: animalData } });
  };

  // 🔹 Predict risk per animal per month (with oxygen)
  const handlePredict = async (animal, monthYear, logs) => {
    try {
      if (!logs || logs.length === 0) {
        alert("No health logs to predict risk for this month.");
        return;
      }

      const lastLog = logs[logs.length - 1]; // last entry of that month

      // ✅ Oxygen validation
      if (
        lastLog.oxygen === undefined ||
        lastLog.oxygen < 50 ||
        lastLog.oxygen > 100
      ) {
        alert("Oxygen value must be between 70 and 100.");
        return;
      }

      const response = await fetch("http://localhost:5001/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          temperature: lastLog.temperature,
          heartRate: lastLog.heartRate,
          activity: lastLog.activity || 5,
          appetite: lastLog.appetite || 5,
          oxygen: lastLog.oxygen,
        }),
      });

      const data = await response.json();
      if (!response.ok || data.error) {
        alert(data.error || "Error predicting risk");
        return;
      }

      // Store per animal per month
      setPredictions((prev) => ({
        ...prev,
        [`${animal._id}_${monthYear}`]: data,
      }));
    } catch (err) {
      console.error(err);
      alert("Server error connecting to prediction API");
    }
  };

  // Group logs by month-year
  const groupLogsByMonth = (logs) => {
    const grouped = {};
    logs.forEach((log) => {
      const key = `${log.month}-${log.year}`;
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(log);
    });
    return grouped;
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-left">
          <img src={logo} alt="Aranya Logo" className="dashboard-logo" />
          <h2>Aranya AI</h2>
        </div>
        <div className="header-right">
          <button className="add-btn" onClick={handleAddAnimal}>
            + Add New Animal
          </button>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <section className="welcome-section">
        <h2>
          Welcome back, <span>{fullName}!</span>
        </h2>
        <p>Monitor your cattle's health and wellbeing </p>
      </section>

      <section className="cattle-section">
        <h3 className="section-title">Your Cattle</h3>
        {animals.length === 0 ? (
          <p style={{ marginTop: "20px", color: "#777" }}>
            No animals yet. Click <strong>Add New Animal</strong> to begin.
          </p>
        ) : (
          <div className="cattle-cards-container">
            {animals.map((animal) => (
              <div
                key={animal._id}
                className="cattle-card-small"
                onClick={() => handleOpenAnimal(animal._id)}
              >
                <img src={cowIcon} alt="Cow" className="cattle-icon-small" />
                <div className="cattle-info-small">
                  <h4>{animal.name}</h4>
                  <p className="breed">{animal.breed}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
       {/* 💬 Chatbot Floating Icon */}
<div
  className="chatbot-icon"
  onClick={() => setChatOpen(!chatOpen)}
  title="Open Chatbot"
>
  💬
</div>

{/* Chatbot Popup */}
{chatOpen && (
  <div className="chatbot-popup">
    <div className="chatbot-header">
      <h4>Cattle Chatbot 🐄</h4>
      <button onClick={() => setChatOpen(false)}>✖</button>
    </div>

    <div className="chatbot-body">
      <p>Ask me about cattle diseases or upload an image!</p>

      {/* Text-based query */}
      <input
        type="text"
        placeholder="Enter symptoms or disease name..."
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
      />
      <button onClick={handleChatSubmit}>Send</button>

      {/* Image upload */}
      <input type="file" onChange={handleImageUpload} />
    </div>

    {chatResponse && (
      <div className="chatbot-response">
        <strong>Response:</strong>
        <p>{chatResponse}</p>
      </div>
    )}
  </div>
)}

      {/* 🔹 Health History Section */}
      <section className="history-section">
        <h3 className="section-title">📜 History</h3>
        {animals.map((animal) =>
          animal.healthLogs?.length > 0 ? (
            <div key={animal._id} className="history-animal">
              <h4>{animal.name}</h4>

              {/* Group logs by month */}
              {Object.entries(groupLogsByMonth(animal.healthLogs)).map(
                ([monthYear, logs]) => (
                  <div key={monthYear} style={{ marginBottom: "20px" }}>
                    <h5>{monthYear}</h5>
                    <table className="history-table">
                      <thead>
                        <tr>
                          <th>Day</th>
                          <th>Temperature (°C)</th>
                          <th>Heart Rate (bpm)</th>
                          <th>Activity</th>
                          <th>Appetite</th>
                          <th>Oxygen (%)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {logs.map((log, idx) => (
                          <tr key={idx}>
                            <td>{log.day}</td>
                            <td>{log.temperature}</td>
                            <td>{log.heartRate}</td>
                            <td>{log.activity}</td>
                            <td>{log.appetite}</td>
                            <td>{log.oxygen}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {/* Risk Prediction per month */}
                    <div style={{ textAlign: "center", marginTop: "10px" }}>
                      {predictions[`${animal._id}_${monthYear}`] ? (
                        <>
                          Risk Score:{" "}
                          {predictions[
                            `${animal._id}_${monthYear}`
                          ].risk_score?.toFixed(4) ?? "N/A"}{" "}
                          <br />
                          <span
                            style={{
                              display: "inline-block",
                              marginTop: "5px",
                              padding: "4px 10px",
                              borderRadius: "12px",
                              color: "white",
                              backgroundColor:
                                predictions[`${animal._id}_${monthYear}`]
                                  .risk_score < 1.0
                                  ? "green"
                                  : predictions[`${animal._id}_${monthYear}`]
                                      .risk_score < 2.0
                                  ? "orange"
                                  : "red",
                            }}
                          >
                            {predictions[`${animal._id}_${monthYear}`].status}
                          </span>
                        </>
                      ) : (
                        "Not predicted"
                      )}
                    </div>

                    <button
                      className="predict-btn"
                      style={{ marginTop: "8px" }}
                      onClick={() => handlePredict(animal, monthYear, logs)}
                    >
                      Predict Risk
                    </button>
                  </div>
                )
              )}
            </div>
          ) : null
        )}
      </section>

      {/* Add Animal Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Add New Animal</h3>
            <label>Animal Name or ID</label>
            <input
              type="text"
              name="name"
              value={newAnimal.name}
              onChange={handleInputChange}
            />

            <label>Breed</label>
            <select
              name="breed"
              value={newAnimal.breed}
              onChange={handleInputChange}
            >
              <option value="">Select Breed</option>
              <option value="Jersey">Jersey</option>
              <option value="Holstein">Holstein</option>
              <option value="Gir">Gir</option>
              <option value="Sahiwal">Sahiwal</option>
              <option value="Indigenous">Indigenous</option>
            </select>

            <div className="modal-actions">
              <button className="cancel-btn" onClick={handleModalClose}>
                Cancel
              </button>
              <button className="add-btn" onClick={handleSaveAnimal}>
                Add Animal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
