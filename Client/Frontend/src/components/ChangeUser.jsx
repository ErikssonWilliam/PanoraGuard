import { useState, useEffect } from "react";
import axios from "axios";
import { externalURL } from "../api/axiosConfig";

const ChangeUser = () => {
  const [users, setUsers] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch users from the API
  const fetchUsers = async () => {
    const accessToken = localStorage.getItem("accessToken"); // Get token from localStorage

    if (!accessToken) {
      setErrorMessage("No access token found. Please log in.");
      return;
    }

    try {
      const response = await axios.get(`${externalURL}/users/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`, // Pass token in Authorization header
        },
      });
      const data = response.data;

      // Fetch additional user details (role, etc.)
      const userWithRoles = await Promise.all(
        data.map(async (user) => {
          try {
            // Make an additional API call to get detailed user info, including the role
            const userResponse = await axios.get(
              `${externalURL}/users/${user.id}`,
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              },
            );

            return {
              id: user.id,
              username: user.username,
              email: user.email,
              role: userResponse.data.role || "Unknown", // Default to "Unknown" if no role found
            };
          } catch (error) {
            console.error("Error fetching details for user", user.id, error);
            return {
              id: user.id,
              username: user.username,
              email: user.email,
              role: "Unknown", // Fallback if role fetch fails
            };
          }
        }),
      );

      setUsers(userWithRoles);
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
      setErrorMessage("Failed to fetch users. Please try again.");
    }
  };

  // Delete user by ID
  const handleDelete = async (userId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?",
    );
    if (!confirmDelete) return;

    const accessToken = localStorage.getItem("accessToken"); // Get token from localStorage
    if (!accessToken) {
      alert("No access token found. Please log in.");
      return;
    }

    try {
      const response = await axios.delete(`${externalURL}/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`, // Pass token in Authorization header
        },
      });

      if (response.status === 200) {
        alert("User deleted successfully");
        setUsers(users.filter((user) => user.id !== userId)); // Update UI by filtering out the deleted user
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      setErrorMessage("Failed to delete user. Please try again.");
    }
  };

  // Handle role change
  const handleRoleChange = async (userId, newRole) => {
    const accessToken = localStorage.getItem("accessToken"); // Get token from localStorage

    if (!accessToken) {
      alert("No access token found. Please log in.");
      return;
    }

    try {
      const response = await axios.put(
        `${externalURL}/users/${userId}`,
        { role: newRole },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`, // Pass token in Authorization header
          },
        },
      );

      if (response.status === 200) {
        setUsers(
          users.map((user) =>
            user.id === userId ? { ...user, role: newRole } : user,
          ),
        ); // Update the user role in the local state
        alert("Role updated successfully.");
      }
    } catch (error) {
      console.error("Error updating role:", error);
      setErrorMessage("Failed to update user role. Please try again.");
    }
  };

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="font-poppins bg-gray-300 p-6 rounded-lg shadow-lg max-w-4xl mx-auto mt-10">
      <h2 className="text-2xl font-semibold text-center text-NavyBlue mb-6">
        User List
      </h2>
      {errorMessage && (
        <p className="text-center text-red-500 mb-4">{errorMessage}</p>
      )}
      <div className="bg-white p-6 rounded-lg shadow-md">
        {users && users.length > 0 ? (
          <ul className="space-y-4">
            {users.map((user) => (
              <li
                key={user.id}
                className="p-4 border border-gray-300 rounded-md bg-gray-50 shadow-sm flex items-center justify-between"
              >
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    <strong>Name:</strong> {user.username}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Email:</strong> {user.email}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Role:</strong>
                    <select
                      value={user.role}
                      onChange={(e) =>
                        handleRoleChange(user.id, e.target.value)
                      }
                      className="ml-2 px-2 py-1 border rounded-md"
                    >
                      <option value="OPERATOR">Operator</option>
                      <option value="GUARD">Guard</option>
                    </select>
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    className="text-sm px-4 py-2 rounded bg-red-500 text-white hover:bg-red-700 transition"
                    onClick={() => handleDelete(user.id)}
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-600">No users found</p>
        )}
      </div>
    </div>
  );
};

export default ChangeUser;
