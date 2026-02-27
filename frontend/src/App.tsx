import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import DashboardLayout from './components/DashboardLayout';
import FarmerDashboardHome from './pages/Farmer/DashboardHome';
import AdvisoryChat from './pages/Farmer/AdvisoryChat';
import ProfitEstimator from './pages/Farmer/ProfitEstimator';
import CropRecommendation from './pages/Farmer/CropRecommendation';
import WeatherAdvisory from './pages/Farmer/WeatherAdvisory';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Dashboards */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route path="farmer" element={<FarmerDashboardHome />} />
          <Route path="farmer/crop-advisory" element={<CropRecommendation />} />
          <Route path="farmer/chat" element={<AdvisoryChat />} />
          <Route path="farmer/weather" element={<WeatherAdvisory />} />
          <Route path="farmer/analytics" element={<ProfitEstimator />} />

          <Route path="admin" element={<div className="p-8 text-white font-bold">Admin Panel Access Restricted</div>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

