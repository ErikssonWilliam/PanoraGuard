import { useNavigate } from "react-router-dom";
import Header from "../components/OperatorHeader";
import ResolvedAlarms from "../components/ResolvedAlarms";

const OldAlarmsPage = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-custom-bg min-h-screen">
      <Header />
      <div className="p-4">
        <h1 className="text-2xl font-semibold mb-4 text-[#2E5984]">Old Alarms</h1>
        <ResolvedAlarms />
        <div className="flex justify-center mt-4">
          <button
            onClick={() => navigate("/operator")}
            className="bg-[#237F94] text-white px-6 py-3 rounded-lg hover:bg-[#1E6D7C] transition duration-200"
          >
            View Active Alarms
          </button>
        </div>
      </div>
    </div>
  );
};

export default OldAlarmsPage;