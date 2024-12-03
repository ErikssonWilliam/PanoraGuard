import Admin from "./pages/admin";
import PanoraGuardDashboard from "./components/PanoraGuardDashboard";
import ProfilePage from "./components/profile";
import Login from "./pages/LoginPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import OperatorPage from "./pages/OperatorPage";
import AlarmDetailPage from "./pages/AlarmDetailPage";
import LiveFeedPage from "./pages/LiveFeedPage";
import NotFound from "./components/NotFound";
import ChangeUser from "./components/ChangeUser"; // Import the new component
import SelectLiveFeedPage from "./pages/SelectLiveFeedPage";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/dashboard" element={<PanoraGuardDashboard />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/operator" element={<OperatorPage />} />
        <Route path="/alarm-details" element={<AlarmDetailPage />} />
        <Route path="/live-feed" element={<LiveFeedPage />} />
        <Route path="/change-user" element={<ChangeUser />} /> {/* New Route */}
        <Route path="/select-live-feed" element={<SelectLiveFeedPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
