import { Routes, Route } from "react-router-dom";
import Dashboard from "./components/DashBoard";
import AnimalProfile from "./components/AnimalProfile";
import PredictRisk from "./components/PredictRisk";
import WelcomePage from "./components/WelcomePage";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";
import ResetPasswordPage from "./components/ResetPasswordPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<WelcomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/reset-password/:token?" element={<ResetPasswordPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/animal/:id" element={<AnimalProfile />} />
      <Route path="/predict" element={<PredictRisk />} />
    </Routes>
  );
}

export default App;
