import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Header from "../components/OperatorHeader";
import { externalURL, lanURL } from "../api/axiosConfig";
import { formatStatusToSentenceCase } from "../utils/formatUtils";
import { useAuthStore } from "../utils/useAuthStore";
import { HiOutlineArrowLeft } from "react-icons/hi";
import { useCallback } from "react";
import MessageBox from "../components/MessageBox";

const useFetchUserInfo = (userId) => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const { token, error, setError } = useAuthStore();
  useEffect(() => {
    const fetchUserInfo = async () => {
      setLoading(true);
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
  const [alarm, setAlarm] = useState(location.state?.alarm); // Extract alarm details from the passed state
  const [liveFootage, setLiveFootage] = useState(""); // State for live footage image
  const [users, setUsers] = useState([]); // List of guards
  const [selectedUserId, setSelectedUserId] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [confirmationSubject, setConfirmationSubject] = useState("");
  const [operatorUsername, setOperatorUsername] = useState("N/A");
  const [, setFormattedStatus] = useState("");
  const { error, setError, token, userId } = useAuthStore();

  // const userId = localStorage.getItem("userId");

  const { userInfo } = useFetchUserInfo(userId);
  // const operatorId = localStorage.getItem("userId"); // Get operator ID from localStorage
  const operatorId = userId;

  const fetchOperatorDetails = useCallback(
    // Fetches operator details by ID and updates the operator username
    async (operatorId) => {
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
    // Fetches operator details if the alarm is not "PENDING" and has a valid operator_id
    const fetchOperatorDetailsIfNeeded = async (alarm) => {
      if (
        alarm?.status !== "PENDING" &&
        alarm?.operator_id &&
        alarm.operator_id !== "N/A"
      ) {
        await fetchOperatorDetails(alarm.operator_id);
      }
    };

    if (alarm) {
      fetchOperatorDetailsIfNeeded(alarm);
    }
  }, [alarm, fetchOperatorDetails]);

  useEffect(() => {
    const fetchAlarmImage = async () => {
      if (alarm.status !== "IGNORED")
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
            setLiveFootage(
              `data:image/jpeg;base64,${imageResponse.data.image}`,
            );
          }
        } catch (error) {
          console.error("Error fetching image:", error);
          setError("Failed to load alarm image.");
        }
    };

    // Fetches the list of guards from the server and updates the users state
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
        setError("Failed to load guards.");
      }
    };

    fetchAlarmImage();
    fetchUsers();
  }, [navigate, location, alarm.id, token, setError, alarm.status]);

  useEffect(() => {
    if (alarm?.status) {
      const status = formatStatusToSentenceCase(alarm.status);
      setFormattedStatus(status);
    }
  }, [alarm]);

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
      setError(`Error stopping external speaker: ${speakerError}`);
    }
  };

  // Updates the alarm status on the server and handles associated actions (navigation, notifications, stopping speaker) based on the new status.
  const updateAlarmStatus = async (newStatus, guardID = null) => {
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
          stopExternalSpeaker();
          navigateToHome();
          break;

        case "NOTIFIED":
          navigateToHome();
          break;

        case "RESOLVED":
          stopExternalSpeaker();
          navigateToHome();
          break;

        default:
          setError(`Unknown status: ${newStatus}`);
          break;
      }
    } catch (err) {
      console.error("Error updating alarm status:", err);
      setError(`Failed to update status to ${newStatus}.`);
    }
  };

  //Notify the guard function
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

      return true; // Notification succeeded
    } catch (err) {
      console.error(
        "Error notifying the guard:",
        err.response ? err.response.data : err.message,
      );

      // Set notification message on failure
      setError("Failed to notify the guard.");

      return false; // Notification failed
    }
  };

  // Handles notifying a selected guard and updating the alarm status to "NOTIFIED"; manages error handling and user feedback if the notification fails.
  const handleNotifyAndUpdate = async () => {
    if (!selectedUserId) {
      setError("Please select a guard to notify.");
      return;
    }
    setConfirmationMessage("Are you sure you want to notify the guard?");
    setConfirmationSubject("notify");
  };

  const handleDismissAlert = () => {
    setConfirmationMessage("Are you sure you want to dismiss the alarm?");
    setConfirmationSubject("dismiss");
  };

  // Manual confirmation in case notify the guard function fails

  return (
    <div className="bg-custom-bg min-h-screen max-h-screen flex flex-col overflow-hidden">
      <Header userInfo={userInfo} />
      <div className="flex-grow flex flex-col items-center p-8 overflow-hidden">
        <div className="flex w-11/12 justify-between bg-custom-bg max-w-6xl overflow-hidden">
          {/* Left Image Box */}
          <div className="w-2/5 overflow-hidden">
            <HiOutlineArrowLeft
              onClick={() => navigate(-1)}
              className="absolute top-4 left-4 text-Black text-2xl cursor-pointer transition-transform duration-200 hover:scale-110"
              title="Go Back"
            />
            {alarm?.status !== "IGNORED" ? (
              <img
                src={liveFootage}
                className="w-full h-full object-contain rounded-lg"
                alt="Live Footage"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-[#F4F7FA] rounded-lg"></div>
            )}
          </div>

          {/* Right Details Box */}
          <div className="w-2/5 bg-gray-200 rounded-lg p-2 ml-2 overflow-y-auto max-h-[500px]">
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
              <div className="flex justify-center w-full space-x-4 bg-gray-200 p-4 rounded-lg shadow-md">
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
                  className="border-2 border-[#237F94] text-[#237F94] font-semibold px-6 py-3 rounded-lg hover:bg-[#1E6D7C] hover:text-white transition duration-200"
                >
                  Look at the live feed
                </button>
                <button
                  onClick={() => {
                    setConfirmationMessage(
                      "Are you sure you want to resolve the alarm?",
                    );
                    setConfirmationSubject("resolve");
                  }}
                  className="bg-[#EBB305] text-white px-6 py-3 rounded-lg hover:bg-[#FACC14] transition duration-200"
                >
                  Resolve Alarm
                </button>
              </div>
            ) : (
              // Layout for "PENDING" och other statuses
              <div className="flex justify-evenly w-full bg-gray-200 p-4 rounded-lg shadow-md">
                <button
                  onClick={() =>
                    navigate("/live-feed", {
                      state: { id: alarm.id, camera_id: alarm.camera_id },
                    })
                  }
                  className="border-2 border-[#237F94] text-[#237F94] font-semibold px-6 py-3 rounded-lg hover:bg-[#1E6D7C] hover:text-white transition duration-200"
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
                  className="border-2 border-NewRed text-NewRed font-semibold px-6 py-3 rounded-lg hover:bg-red-700 hover:text-white transition duration-200"
                >
                  Dismiss the alert
                </button>
              </div>
            )}
            {/* Message Boxes*/}
            {error && (
              <MessageBox
                message={error}
                onExit={() => {
                  setError("");
                }}
              />
            )}
            {successMessage && (
              <MessageBox
                message={successMessage}
                onExit={() => {
                  setSuccessMessage("");
                }}
              />
            )}
            {confirmationMessage && (
              <MessageBox
                message={confirmationMessage}
                showButtons
                onConfirm={async () => {
                  switch (confirmationSubject) {
                    case "dismiss": {
                      updateAlarmStatus("IGNORED");
                      break;
                    }
                    case "resolve": {
                      updateAlarmStatus("RESOLVED");
                      break;
                    }
                    case "notify": {
                      try {
                        const notifySuccess = await notifyGuard(selectedUserId);
                        if (notifySuccess) {
                          await updateAlarmStatus("NOTIFIED", selectedUserId);
                        } else {
                          setAlarm((prevAlarm) => ({
                            ...prevAlarm,
                            status: "PENDING",
                          }));
                          setConfirmationMessage("");
                          setConfirmationSubject("");
                          setError(
                            "Notification failed. Call the guard immediately to ensure the alert is acknowledged.",
                          );
                        }
                      } catch (err) {
                        setConfirmationMessage("");
                        setConfirmationSubject("");
                        console.error(
                          "Error during notification and status update:",
                          err,
                        );
                        setError(
                          "Failed to update status and notify the guard.",
                        );
                      }
                      break;
                    }
                  }
                }}
                onExit={() => {
                  setConfirmationMessage("");
                  setConfirmationSubject("");
                }}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AlarmDetailPage;
