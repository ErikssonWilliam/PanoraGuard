import Header from "../components/SelectLiveFeedHeader";
import SelectLiveFeed from "../components/SelectLiveFeed.jsx";
import { isUserLoggedInWithRole } from "../utils/jwtUtils.js";
import Notification from "../components/Notification.jsx";

import { useEffect, useState } from "react";
import { externalURL } from "../api/axiosConfig";

const useFetchUserInfo = (userId) => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    const fetchUserInfo = async () => {
      setLoading(true);
      setError(""); // Clear any previous errors
      try {
        const token = localStorage.getItem("accessToken");
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
  }, [userId]);

  return { userInfo, loading, error };
};

const SelectLiveFeedPage = () => {
  const userId = localStorage.getItem("userId");

  const { userInfo } = useFetchUserInfo(userId);

  if (!isUserLoggedInWithRole("OPERATOR") && !isUserLoggedInWithRole("ADMIN")) {
    return (
      <Notification
        message={
          "You do not have access to this page. Please log in with the correct credentials."
        }
      />
    );
  }

  return (
    <div className="bg-custom-bg min-h-screen">
      <Header userInfo={userInfo} />
      <SelectLiveFeed />
    </div>
  );
};

export default SelectLiveFeedPage;
