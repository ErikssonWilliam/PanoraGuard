import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { externalURL } from "../api/axiosConfig";
import { useAuthStore } from "../utils/useAuthStore";
import MessageBox from "./MessageBox";

const ChangeUser = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { error, token, setError } = useAuthStore();
  const [successMessage, setSuccessMessage] = useState("");
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [idToDelete, setIdToDelete] = useState("");
  const [roleChanges, setRoleChanges] = useState({}); // Tracks role changes for each user

  // Fetch users from the API
  const fetchUsers = useCallback(async () => {
    if (!token) {
      setError("No access token found. Please log in.");
      return;
    }

    try {
      const response = await axios.get(`${externalURL}/users/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = response.data;

      // Fetch additional user details (role, etc.)
      const userWithRoles = await Promise.all(
        data.map(async (user) => {
          try {
            const userResponse = await axios.get(
              `${externalURL}/users/${user.id}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              },
            );

            return {
              id: user.id,
              username: user.username,
              email: user.email,
              role: userResponse.data.role || "Unknown",
            };
          } catch (error) {
            console.error("Error fetching details for user", user.id, error);
            return {
              id: user.id,
              username: user.username,
              email: user.email,
              role: "Unknown",
            };
          }
        }),
      );

      setUsers(userWithRoles);
      setFilteredUsers(userWithRoles);
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
      setFilteredUsers([]);
      setError("Failed to fetch users. Please try again.");
    }
  }, [setError, token]);
  // Delete user by ID
  const handleDelete = async (userId) => {
    if (!token) {
      setError("No access token found. Please log in.");
      return;
    }

    try {
      const response = await axios.delete(`${externalURL}/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        setSuccessMessage("User deleted successfully");
        setUsers(users.filter((user) => user.id !== userId));
        setFilteredUsers(filteredUsers.filter((user) => user.id !== userId));
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      setError("Failed to delete user. Please try again.");
    }
  };

  // Handle role change in dropdown
  const handleRoleChange = (userId, newRole) => {
    setRoleChanges((prevChanges) => ({
      ...prevChanges,
      [userId]: newRole,
    }));
  };

  // Update role for a specific user
  const handleRoleUpdate = async (userId) => {
    const newRole = roleChanges[userId];
    if (!newRole) return;

    if (!token) {
      setError("No access token found. Please log in.");
      return;
    }

    try {
      const response = await axios.put(
        `${externalURL}/users/${userId}`,
        { role: newRole },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.status === 200) {
        setUsers(
          users.map((user) =>
            user.id === userId ? { ...user, role: newRole } : user,
          ),
        );
        setFilteredUsers(
          filteredUsers.map((user) =>
            user.id === userId ? { ...user, role: newRole } : user,
          ),
        );
        setRoleChanges((prevChanges) => {
          const updatedChanges = { ...prevChanges };
          delete updatedChanges[userId];
          return updatedChanges;
        });
        setSuccessMessage("Role updated successfully.");
      }
    } catch (error) {
      console.error("Error updating role:", error);
      setError("Failed to update user role. Please try again.");
    }
  };

  // Filter users based on search term
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = users.filter((user) =>
      user.username.toLowerCase().includes(term),
    );
    setFilteredUsers(filtered);
  };

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers, setError]);

  return (
    <div className="font-poppins bg-gray-300 p-6 rounded-lg shadow-lg max-w-4xl mx-auto mt-10">
      <h2 className="text-2xl font-semibold text-center text-NavyBlue mb-6">
        User List
      </h2>

      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name"
          value={searchTerm}
          onChange={handleSearch}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {filteredUsers && filteredUsers.length > 0 ? (
        <ul className="space-y-4">
          {filteredUsers.map((user) => (
            <li
              key={user.id}
              className={`p-4 border border-gray-300 rounded-md shadow-sm flex items-center justify-between ${
                user.role === "ADMIN" ? "bg-blue-100" : "bg-gray-50"
              }`}
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
                    value={roleChanges[user.id] || user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    className="ml-2 px-2 py-1 border rounded-md"
                    disabled={user.role === "ADMIN"} // Disable dropdown for Admin users
                  >
                    <option value="ADMIN" disabled hidden>
                      Admin
                    </option>{" "}
                    {/**So that admin role would show as Admin instead of showing operation as admin role */}
                    <option value="OPERATOR">Operator</option>
                    <option value="GUARD">Guard</option>
                    <option value="MANAGER">Manager</option>
                  </select>
                </p>
              </div>
              <div className="flex space-x-2">
                {user.role !== "ADMIN" && (
                  <>
                    <button
                      className="text-sm py-2 px-4 rounded-md bg-NewRed text-white hover:bg-red-700 transition"
                      onClick={() => {
                        setConfirmationMessage(
                          "Are you sure you want to delete this user",
                        );
                        setIdToDelete(user.id);
                      }}
                    >
                      Remove
                    </button>
                    {roleChanges[user.id] &&
                      roleChanges[user.id] !== user.role && (
                        <button
                          className="text-sm px-4 py-2 bg-cyan-700 text-white rounded-md hover:bg-cyan-800 transition-colors"
                          onClick={() => handleRoleUpdate(user.id)}
                        >
                          Update
                        </button>
                      )}
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-600">No users found</p>
      )}
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
          onConfirm={() => {
            handleDelete(idToDelete);
          }}
          onExit={() => {
            setConfirmationMessage("");
          }}
        />
      )}
    </div>
  );
};

export default ChangeUser;
