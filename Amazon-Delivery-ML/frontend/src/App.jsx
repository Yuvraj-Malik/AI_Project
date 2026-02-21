import { Navigate, Route, Routes } from "react-router-dom";
import DashboardLayout from "./components/layout/DashboardLayout.jsx";
import { useAuth } from "./state/AuthContext.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import OverviewPage from "./pages/OverviewPage.jsx";
import LivePredictionPage from "./pages/LivePredictionPage.jsx";
import AnalyticsPage from "./pages/AnalyticsPage.jsx";
import ModelPerformancePage from "./pages/ModelPerformancePage.jsx";
import UploadDataPage from "./pages/UploadDataPage.jsx";
import ReportsPage from "./pages/ReportsPage.jsx";
import AboutModelPage from "./pages/AboutModelPage.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";

function ProtectedRoutes() {
  const { token } = useAuth();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <DashboardLayout>
      <Routes>
        <Route path="/dashboard" element={<OverviewPage />} />
        <Route
          path="/dashboard/live-prediction"
          element={<LivePredictionPage />}
        />
        <Route path="/dashboard/analytics" element={<AnalyticsPage />} />
        <Route
          path="/dashboard/model-performance"
          element={<ModelPerformancePage />}
        />
        <Route path="/upload-data" element={<UploadDataPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/about-model" element={<AboutModelPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </DashboardLayout>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/*" element={<ProtectedRoutes />} />
    </Routes>
  );
}

export default App;
