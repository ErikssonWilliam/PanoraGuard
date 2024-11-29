import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { externalURL, lanURL } from "../api/axiosConfig";

const LiveFeed = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationType, setNotificationType] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");
  // const [imageSrc, setImageSrc] = useState("");
  const [users, setUsers] = useState([]);
  const id = location.state?.id;
  const camera_id = location.state?.camera_id;
  const alarmState = location.state?.alarm_state; 
  const isNotified = alarmState?.status === "NOTIFIED";
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(`${externalURL}/users/guards`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(response.data);
      } catch (err) {
        console.error("Error fetching guards:", err);
        setError("Failed to load guards.");
      }
    };
    fetchUsers();
  }, []);

  // useEffect(() => {
  //   // Fetch the image with axios
  //   const fetchImage = async () => {
  //     try {
  //       const response = await axios.get(`${lanURL}/livestream/${camera_id}`, {
  //         headers: {
  //           'Authorization': `Bearer ${localStorage.getItem("accessToken")}`,
  //         },
  //         responseType: 'blob', // Important to get the image as a Blob
  //       });

  //       // Create a URL for the image blob
  //       const imageObjectURL = URL.createObjectURL(response.data);

  //       // Set the image source
  //       setImageSrc(imageObjectURL);
  //     } catch (error) {
  //       console.error('Error loading live feed:', error);
  //     }
  //   };

  //   fetchImage();
  // }, [camera_id, imageSrc]);

  const updateAlarmStatus = async (newStatus) => {
    const confirmAction = window.confirm(
      `Are you sure you want to ${newStatus === "RESOLVED" ? "resolve" : "dismiss"} the alarm?`,
    );
    if (!confirmAction) return;

    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.put(
        `${externalURL}/alarms/${id}/status`,
        {
          status: newStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log(`Alarm status updated to ${newStatus}:`, response.data);
      if (newStatus === "RESOLVED") {
        window.alert("Alarm resolved successfully.");
      } else {
        window.alert("Alarm not resolved.");
      }
      navigate("/operator");
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
      "Are you sure you want to notify the guard?",
    );
    if (!confirmNotify) return;

    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.post(
        `${externalURL}/alarms/notify/${selectedUserId}/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log("Guard notified successfully:", response.data);
      setNotificationMessage("Notification sent successfully.");
      setNotificationType("success");
      setError("");
    } catch (err) {
      console.error("Failed to notify the guard:", err);
      setNotificationMessage(
        "Notification failed. Please navigate back to handle the alert manually.",
      );
      setNotificationType("error");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center flex-grow p-4">
      <h2 className="text-xl font-semibold mb-2 text-[#2E5984]">
        Live feed of Camera : {camera_id || "Unknown"}
      </h2>
      <div className="relative w-full max-w-2xl" style={{ height: "65vh" }}>
        <img
          src={`${lanURL}/livestream/${camera_id}`}
          alt="Live feed"
          className="w-full h-full object-contain rounded-lg"
        />
      </div>

      {/* controls if status is Notified */}
      {isNotified ? (
        <div className="flex justify-center w-full mt-4">
          <button
            onClick={() => updateAlarmStatus("RESOLVED")}
            className="bg-[#EBB305] text-white px-6 py-3 rounded-lg hover:bg-[#FACC14] transition duration-200"
          >
            Resolve Alarm
          </button>
        </div>
      ) : (
        <div className="flex justify-between w-full mt-4 max-w-2xl">
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
            onClick={() => updateAlarmStatus("IGNORED")}
            className="bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700 transition duration-200"
          >
            Dismiss the alert
          </button>
        </div>
      )}

      {/* Placeholder for  notification and error messages */}
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