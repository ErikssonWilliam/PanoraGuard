import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import liveFootage from "../assets/live-footage.png";
import { baseURL } from "../api/axiosConfig";

const LiveFeed = () => {
  const location = useLocation();
  const [error, setError] = useState("");
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationType, setNotificationType] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${baseURL}/users/guards`);
        setUsers(response.data);
      } catch (err) {
        console.error("Error fetching guards:", err);
        setError("Failed to load guards.");
      }
    };
    fetchUsers();
  }, []);

  const id = location.state?.id;

  const updateAlarmStatus = async (newStatus) => {
    const confirmAction = window.confirm(
      `Are you sure you want to ${
        newStatus === "ignored" ? "dismiss" : "update"
      } the alarm?`
    );
    if (!confirmAction) return;

    try {
      const response = await axios.put(`${baseURL}/alarms/${id}/status`, {
        status: newStatus,
      });
      console.log(`Alarm status updated to ${newStatus}:`, response.data);
      setNotificationMessage("Alarm dismissed successfully.");
      setNotificationType("success");
      setError("");
    } catch (err) {
      console.error(`Error updating alarm status to ${newStatus}:`, err);
      setNotificationMessage(`Failed to update status to ${newStatus}.`);
      setNotificationType("error");
    }
  };

  const notifyGuard = async () => {
    if (!selectedUserId) {
      setNotificationMessage("Please select a guard to notify.");
      setNotificationType("error");
      return;
    }

    const confirmNotify = window.confirm(
      "Are you sure you want to notify the guard?"
    );
    if (!confirmNotify) return;

    try {
      const response = await axios.post(
        `${baseURL}/alarms/notify/${selectedUserId}/${id}`
      );
      console.log("Guard notified successfully:", response.data);
      setNotificationMessage("Notification sent successfully.");
      setNotificationType("success");
      setError("");
    } catch (err) {
      console.error("Failed to notify the guard:", err);
      setNotificationMessage(
        "Notification failed. Please navigate back to handle the alert manually."
      );
      setNotificationType("error");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center flex-grow p-4">
      <h2 className="text-xl font-semibold mb-2 text-[#2E5984]">
        Live feed of Camera : 2
      </h2>
      <div className="relative w-full max-w-2xl" style={{ height: "65vh" }}>
        <img
          src={liveFootage}
          alt="Live feed"
          className="w-full h-full object-contain rounded-lg"
        />
      </div>
      <div className="flex justify-between w-full mt-2 max-w-2xl">
        <select
          value={selectedUserId}
          onChange={(e) => setSelectedUserId(e.target.value)}
          className="border p-2 rounded-md"
        >
          <option value="">Select a guard</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.username}
            </option>
          ))}
        </select>
        <button
          onClick={notifyGuard}
          className="bg-[#237F94] text-white px-5 py-2 rounded-lg hover:bg-[#1E6D7C] transition duration-200"
        >
          Notify the Guard
        </button>
        <button
          onClick={() => updateAlarmStatus("ignored")}
          className="bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700 transition duration-200"
        >
          Dismiss the alert
        </button>
      </div>
      {/* Placeholder for notification to prevent content shift */}
      <div className="mt-3 text-sm h-6">
        {notificationMessage && (
          <p
            className={`${
              notificationType === "success" ? "text-green-500" : "text-red-500"
            }`}
          >
            {notificationMessage}
          </p>
        )}
      </div>
      {error && <p className="mt-3 text-red-500 text-sm">{error}</p>}
    </div>
  );
};

export default LiveFeed;
