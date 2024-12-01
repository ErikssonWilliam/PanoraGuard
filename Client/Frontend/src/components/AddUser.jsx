import { useState } from "react";
import { externalURL } from "../api/axiosConfig";

const AddnewUser = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "GUARD",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    console.log(formData);
  };

  const handleSubmit = async () => {
    // Validate password length for roles other than "GUARD"
    if (formData.role !== "GUARD" && formData.password.length <= 7) {
      setErrorMessage("Password must be longer than 7 characters.");
      return;
    }

    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${externalURL}/users/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      // If response is not ok, handle the error
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Something went wrong");
      }

      const data = await response.json();

      setFormData({
        username: "",
        email: "",
        password: "",
        role: "GUARD",
      });

      console.log("User added successfully:", data);
      alert(`User ${data.user.username} added successfully`);
      setErrorMessage("");
    } catch (error) {
      console.error("Error adding user", error);
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="font-poppins bg-gray-300 p-6 rounded-lg shadow-lg max-w-lg mx-auto mt-10">
      <h2 className="text-2xl font-semibold text-center text-NavyBlue mb-6">
        Add New User
      </h2>
      <div className="flex flex-col space-y-4">
        <div>
          <label htmlFor="name" className="block text-gray-700 font-medium">
            Name
          </label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Enter user name"
            className="mt-1 w-full p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-NavyBlue focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-gray-700 font-medium">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter email address"
            className="mt-1 w-full p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-NavyBlue focus:outline-none"
          />
        </div>
        {formData.role !== "GUARD" && (
          <div>
            <label
              htmlFor="password"
              className="block text-gray-700 font-medium"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              className="mt-1 w-full p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-NavyBlue focus:outline-none"
            />
          </div>
        )}
        <div>
          <label
            htmlFor="designation"
            className="block text-gray-700 font-medium"
          >
            Designation
          </label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="mt-1 w-full p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-NavyBlue focus:outline-none bg-white"
          >
            {/** Add more options */}
            <option value="GUARD">GUARD</option>
            <option value="OPERATOR">OPERATOR</option>
            <option value="MANAGER">MANAGER</option>
          </select>
        </div>
        <button
          className="submitButton mt-4 bg-cyan-700 hover:bg-cyan-800 text-white rounded-lg p-2 w-full"
          onClick={handleSubmit}
        >
          Submit
        </button>
        {errorMessage && (
          <div className="text-red-600 text-sm font-medium mt-2">
            <strong>Error:</strong> {errorMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default AddnewUser;
