import Admin from "./pages/admin";
import PanoraGuardDashboard from "./components/PanoraGuardDashboard";
import ProfilePage from "./components/profile";
import Login from "./components/login";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import OperatorPage from "./pages/OperatorPage";
import AlarmDetailPage from "./pages/AlarmDetailPage";
import LiveFeedPage from "./pages/LiveFeedPage";
import OldAlarmsPage from "./pages/OldAlarmsPage";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/dashboard" element={<PanoraGuardDashboard />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/operator" element={<OperatorPage />} />
        <Route path="/alert-details" element={<AlarmDetailPage />} />
        <Route path="/live-feed" element={<LiveFeedPage />} />
        <Route path="/old-alarms" element={<OldAlarmsPage />} />
      </Routes>
    </BrowserRouter>
  );
};
export default App;
