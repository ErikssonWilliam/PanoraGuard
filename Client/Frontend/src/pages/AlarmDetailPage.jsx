import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Header from "../components/OperatorHeader";
import { externalURL, lanURL } from "../api/axiosConfig";
import { formatStatusToSentenceCase } from "../utils/formatUtils";
import { useAuthStore } from "../utils/useAuthStore";
import { useCallback } from "react";

const useFetchUserInfo = (userId) => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const { token, error, setError } = useAuthStore();
  useEffect(() => {
    const fetchUserInfo = async () => {
      setLoading(true);
      setError(""); // Clear any previous errors
      try {
        const response = await fetch(`${externalURL}/users/${userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user info");
        }

        const data = await response.json();
        setUserInfo(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchUserInfo();
  }, [setError, token, userId]);

  return { userInfo, loading, error };
};

const AlarmDetailPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [alarm, setAlarm] = useState(location.state?.alarm);
  const [liveFootage, setLiveFootage] = useState(""); // State for live footage image
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationType, setNotificationType] = useState("");
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [manualNotifyVisible, setManualNotifyVisible] = useState(false);
  const [callChecked, setCallChecked] = useState(false);
  const [operatorUsername, setOperatorUsername] = useState("N/A");
  const [, setFormattedStatus] = useState("");
  const { token, userId } = useAuthStore();

  // const userId = localStorage.getItem("userId");

  const { userInfo } = useFetchUserInfo(userId);
  // const operatorId = localStorage.getItem("userId"); // Get operator ID from localStorage
  const operatorId = userId;

  const fetchOperatorDetails = useCallback(
    async (operatorId) => {
      // Fetches operator details by ID and sets the username or "N/A" on error.
      try {
        const response = await axios.get(`${externalURL}/users/${operatorId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setOperatorUsername(response.data.username || "N/A");
      } catch (error) {
        console.error("Error fetching operator details:", error);
        setOperatorUsername("N/A");
      }
    },
    [token],
  );

  useEffect(() => {
    const fetchOperatorDetailsIfNeeded = async (alarm) => {
      if (
        alarm?.status !== "PENDING" &&
        alarm?.operator_id &&
        alarm.operator_id !== "N/A"
      ) {
        await fetchOperatorDetails(alarm.operator_id);
      } else {
        console.log("something missing from alarm data");
      }
    };

    if (alarm) {
      fetchOperatorDetailsIfNeeded(alarm);
    }
  }, [alarm, fetchOperatorDetails]);

  useEffect(() => {
    const fetchAlarmImage = async () => {
      try {
        const imageResponse = await axios.get(
          `${externalURL}/alarms/${alarm.id}/image`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        if (imageResponse.data && imageResponse.data.image) {
          // Update liveFootage with Base64 image data URL
          setLiveFootage(`data:image/jpeg;base64,${imageResponse.data.image}`);
        }
      } catch (error) {
        console.error("Error fetching image:", error);
        setNotificationMessage("Failed to load alarm image.");
        setNotificationType("error");
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${externalURL}/users/guards`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(response.data);
      } catch (err) {
        console.error("Error fetching guards:", err);
        setNotificationMessage("Failed to load guards.");
        setNotificationType("error");
      }
    };

    // Call all functions when component loads
    // fetchAlarmDetails();
    fetchAlarmImage();
    fetchUsers();
  }, [navigate, location, alarm.id, token]);

  useEffect(() => {
    if (alarm?.status) {
      const status = formatStatusToSentenceCase(alarm.status);
      setFormattedStatus(status);
    }
  }, [alarm]);

  useEffect(() => {
    if (location.state?.notifyFailed) {
      setNotificationMessage(
        "Notification failed. Call the guard and confirm manual handling.",
      );
      setNotificationType("error");
      setManualNotifyVisible(true);
    }
  }, [location.state]);

  //Gustav and Alinas attempt to do functions to avoid code duplications.
  const stopExternalSpeaker = async () => {
    try {
      const speakerResponse = await axios.post(
        `${lanURL}/speaker/stop-speaker`,
      ); //hard coded server
      if (speakerResponse.status === 200) {
        console.log(
          "External speaker stopped successfully:",
          speakerResponse.data,
        );
      } else {
        console.warn(
          "Failed to stop the external speaker:",
          speakerResponse.data,
        );
      }
    } catch (speakerError) {
      console.error("Error stopping external speaker:", speakerError);
    }
  };

  const updateAlarmStatus = async (newStatus, guardID = null) => {
    if (newStatus === "RESOLVED") {
      const confirmResolve = window.confirm(
        "Are you sure you want to resolve the alarm?",
      );
      if (!confirmResolve) {
        return; // Exit if user cancels the confirmation
      }
    }

    try {
      const response = await axios.put(
        `${externalURL}/alarms/${alarm.id}/status`,
        {
          status: newStatus,
          guard_id: guardID, // Include guard_id in the request payload
          operator_id: operatorId, // Include operator_id from localStorage
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setAlarm((prevAlarm) => ({
        ...prevAlarm,
        status: response.data.status,
        operator_id: response.data.operator_id,
      }));

      const navigateToHome = () => {
        switch (userInfo.role.toLowerCase()) {
          case "admin":
            navigate("/admin");
            break;
          case "operator":
            navigate("/operator");
            break;
        }
      };

      fetchOperatorDetails(response.data.operator_id);

      switch (newStatus) {
        case "IGNORED":
          window.alert("Alarm dismissed successfully.");
          navigateToHome(); // Navigate back to the operator page after confirmation
          stopExternalSpeaker();
          break;

        case "NOTIFIED":
          window.alert(`Alarm status updated to Notified`);
          navigateToHome(); // Navigate back to the operator page after confirmation
          break;

        case "RESOLVED":
          window.alert(`Alarm status updated to Resolved`);
          navigateToHome(); // Navigate back to the operator page after confirmation
          stopExternalSpeaker();
          break;

        default:
          console.log("Unknown status:", newStatus);
          break;
      }
    } catch (err) {
      console.error("Error updating alarm status:", err);
      setNotificationMessage(`Failed to update status to ${newStatus}.`);
      setNotificationType("error");
    }
  };

  const notifyGuard = async (guardID) => {
    try {
      const response = await axios.post(
        `${externalURL}/alarms/notify/${guardID}/${alarm.id}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const guardName =
        users.find((user) => user.id === guardID)?.username || "the guard";
      console.log(`Guard ${guardName} notified successfully:`, response.data);

      setNotificationMessage(`Notification sent to ${guardName}.`);
      setNotificationType("success");
      setManualNotifyVisible(false);

      return true; // Notification succeeded
    } catch (err) {
      console.error(
        "Error notifying the guard:",
        err.response ? err.response.data : err.message,
      );

      // Set notification message on failure
      setNotificationMessage("Failed to notify the guard.");
      setNotificationType("error");
      setManualNotifyVisible(true);

      return false; // Notification failed
    }
  };

  const handleNotifyAndUpdate = async () => {
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
      setNotificationMessage("");
      const notifySuccess = await notifyGuard(selectedUserId);
      if (notifySuccess) {
        await updateAlarmStatus("NOTIFIED", selectedUserId);
      } else {
        setAlarm((prevAlarm) => ({
          ...prevAlarm,
          status: "PENDING",
        }));
        setNotificationMessage(
          "Notification failed. Call the guard immediately to ensure the alert is acknowledged.",
        );
        setNotificationType("error");
      }
    } catch (err) {
      console.error("Error during notification and status update:", err);
      setNotificationMessage("Failed to update status and notify the guard.");
      setNotificationType("error");
    }
  };

  const handleDismissAlert = () => {
    const confirmDismiss = window.confirm(
      "Are you sure you want to dismiss the alarm?",
    );
    if (!confirmDismiss) {
      return;
    }
    updateAlarmStatus("IGNORED");
  };

  const handleManualNotifyConfirm = async () => {
    if (callChecked) {
      await updateAlarmStatus("NOTIFIED");
      setNotificationMessage(
        "Manual notification confirmed. Status updated to notified.",
      );
      setNotificationType("success");
      setManualNotifyVisible(false);
    } else {
      setNotificationMessage(
        "Please call the guard and check Call to confirm manual notification.",
      );
      setNotificationType("error");
    }
  };

  return (
    <div className="bg-custom-bg min-h-screen max-h-screen flex flex-col overflow-hidden">
      <Header userInfo={userInfo} />
      <div className="flex-grow flex flex-col items-center p-8 overflow-hidden">
        <div className="flex w-11/12 justify-between bg-custom-bg max-w-6xl overflow-hidden">
          <div className="w-2/5 overflow-hidden">
            <button
              onClick={() => navigate(-1)}
              className="absolute top-2 left-2 bg-[#237F94] text-white px-4 py-2 rounded-lg hover:bg-[#1E6D7C] transition duration-200"
            >
              Back
            </button>
            <img
              src={liveFootage}
              alt="Live footage"
              className="w-full h-full object-contain rounded-lg"
            />
          </div>
          <div className="w-2/5 bg-gray-200 rounded-lg p-2 ml-2 overflow-y-auto max-h-[300px]">
            {alarm ? (
              <>
                <p className="text-xl font-semibold mb-2">
                  Alert number: {alarm.id || "N/A"}
                </p>
                <p className="text-lg">Camera ID: {alarm.camera_id}</p>
                <p className="text-lg">Location: {alarm.camera_location}</p>
                <p className="text-lg">Type: {alarm.type}</p>
                <p className="text-lg">
                  Confidence Level:{" "}
                  {alarm.confidence_score
                    ? (alarm.confidence_score * 100).toFixed(2) + "%"
                    : "N/A"}
                </p>
                <p className="text-lg">
                  Timestamp:{" "}
                  {alarm.timestamp !== "N/A"
                    ? new Date(alarm.timestamp).toLocaleString()
                    : "N/A"}
                </p>
                <p className="text-lg">Operator: {operatorUsername}</p>
                <p className="text-lg">
                  Status: {formatStatusToSentenceCase(alarm.status)}
                </p>
              </>
            ) : (
              <p>Loading alarm details...</p>
            )}
          </div>
        </div>
        {alarm?.status !== "RESOLVED" && alarm?.status !== "IGNORED" && (
          <div className="flex flex-col items-center w-10/12 max-w-6xl mt-6 overflow-hidden">
            {alarm?.status === "NOTIFIED" ? (
              // Layout for "NOTIFIED" status
              <div className="flex justify-center w-full space-x-4">
                <button
                  onClick={() =>
                    navigate("/live-feed", {
                      state: {
                        id: alarm.id,
                        alarm,
                        camera_id: alarm.camera_id,
                      },
                    })
                  }
                  className="bg-[#237F94] text-white px-6 py-3 rounded-lg hover:bg-[#1E6D7C] transition duration-200"
                >
                  Look at the live feed
                </button>
                <button
                  onClick={() => updateAlarmStatus("RESOLVED")}
                  className="bg-[#EBB305] text-white px-6 py-3 rounded-lg hover:bg-[#FACC14] transition duration-200"
                >
                  Resolve Alarm
                </button>
              </div>
            ) : (
              // Layout for "PENDING" och other statuses
              <div className="flex justify-between w-full">
                <button
                  onClick={() =>
                    navigate("/live-feed", {
                      state: { id: alarm.id, camera_id: alarm.camera_id },
                    })
                  }
                  className="bg-[#237F94] text-white px-6 py-3 rounded-lg hover:bg-[#1E6D7C] transition duration-200"
                >
                  Look at the live feed
                </button>
                <div>
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
                    onClick={handleNotifyAndUpdate}
                    className="ml-2 bg-[#237F94] text-white px-6 py-3 rounded-lg hover:bg-[#1E6D7C] transition duration-200"
                  >
                    Notify the Guard
                  </button>
                </div>
                <button
                  onClick={handleDismissAlert}
                  className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition duration-200"
                >
                  Dismiss the alert
                </button>
              </div>
            )}
            {/* Notification Message and Manual Notify */}
            <div className="mt-2 h-20 flex flex-col items-center">
              {notificationMessage && (
                <p
                  className={`text-center ${
                    notificationType === "success"
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {notificationMessage}
                </p>
              )}
              {manualNotifyVisible && (
                <div className="mt-2 flex space-x-2 items-center">
                  <label className="flex items-center space-x-1">
                    <input
                      type="checkbox"
                      checked={callChecked}
                      onChange={() => setCallChecked(!callChecked)}
                      className="form-checkbox"
                    />
                    <span>Confirm call and manual alert handling.</span>
                  </label>
                  <button
                    onClick={handleManualNotifyConfirm}
                    className="bg-[#237F94] text-white px-2 py-2 rounded-lg hover:bg-[#1E6D7C] transition duration-200"
                  >
                    Confirm
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlarmDetailPage;
