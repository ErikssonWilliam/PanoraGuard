import { useEffect, useState } from "react";
import Header from "../components/SelectLiveFeedHeader";
import SelectLiveFeed from "../components/SelectLiveFeed";
import Notification from "../components/Notification";
import { useAuthStore } from "../utils/useAuthStore";
import { externalURL } from "../api/axiosConfig";

// Loader Component
const Loader = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin"></div>
  </div>
);

const SelectLiveFeedPage = () => {
  const { token, setError, userId, role } = useAuthStore();
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user information
  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!userId || !token) {
        setError("Unauthorized access.");
        return;
      }

      setLoading(true);
      setError("");
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
        setError(error.message || "Failed to fetch user info.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [userId, token, setError]);

  // Role-based access control
  if (!["OPERATOR", "ADMIN"].includes(role)) {
    return (
      <Notification message="You do not have access to this page. Please log in with the correct credentials." />
    );
  }

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="bg-custom-bg min-h-screen">
      <Header userInfo={userInfo} />
      <SelectLiveFeed />
    </div>
  );
};

export default SelectLiveFeedPage;
