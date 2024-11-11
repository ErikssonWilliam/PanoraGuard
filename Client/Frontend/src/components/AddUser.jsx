// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import { baseURL } from "../api/axiosConfig"; 

const AddnewUser = () => {
  const [errorMessage, setErrorMessage] = useState();
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
    try {
      const response = await fetch(
        `${baseURL}/users/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      // If response is not ok, handle the error
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Something went wrong"); // Display error message from response
      }

      const data = await response.json();
      console.log("User added successfully:", data);
      setFormData({
        username: "",
        email: "",
        password: "",
        role: "GUARD",
      });

      setErrorMessage("");
    } catch (error) {
      console.error("Error adding user", error);
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="font-poppings text-sm space-y-2">
      <div className=" flex flex-col">
        <label htmlFor="name" className="text-blue-600">
          Name:
        </label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          className="p-2 rounded-lg w-3/4 ring-1 ring-blue-900"
        />
      </div>
      <div className="flex flex-col">
        <label htmlFor="location" className="text-blue-600">
          Email:
        </label>
        <input
          type="email"
          name="email"
          className="p-2 rounded-lg w-3/4 ring-1 ring-blue-900"
          value={formData.email}
          onChange={handleChange}
        />
      </div>
      {formData.role != "GUARD" &&
      <div className="flex flex-col">
        <label htmlFor="passwird" className="text-blue-600">
          Password:
        </label>
        <input
          type="password"
          name="password"
          className="p-2 rounded-lg w-3/4 ring-1 ring-blue-900"
          value={formData.password}
          onChange={handleChange}
        />
      </div>
      }
      <div className="col-span-1 flex flex-col">
        <label htmlFor="camera-number" className="text-blue-600">
          Designation:
        </label>
        <select
          id="camera-number"
          name="role"
          className="p-2 rounded-lg w-3/4 ring-1 ring-blue-900"
          value={formData.designation}
          onChange={handleChange}
        >
          {/**Add more option */}
          <option value="GUARD">GUARD</option>
          <option value="OPERATOR">OPERATOR</option>
        </select>
      </div>
      <button
        className="w-1/5 bg-NavyBlue text-white rounded-lg p-2"
        onClick={handleSubmit}
      >
        Submit
      </button>
      {errorMessage && (
        <div style={{ color: 'red', marginTop: '10px' }}>
          <strong>Error: </strong>{errorMessage}
        </div>
      )}
    </div>
  );
};

export default AddnewUser;
