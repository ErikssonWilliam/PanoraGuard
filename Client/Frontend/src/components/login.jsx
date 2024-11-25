import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { externalURL } from "../api/axiosConfig";
import axisLogo from "../assets/AxisLogo.png";

const Login = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    console.log(formData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${externalURL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Something went wrong");
      }

      const user = await response.json(); // Fetch and store user data

      localStorage.setItem("accessToken", user.access_token);
      localStorage.setItem("userId", user.user_id);
      localStorage.setItem("userRole", user.role);

      switch (user.role) {
        case "ADMIN":
          navigate("/admin");
          break;
        case "OPERATOR":
          navigate("/operator");
          break;
        case "MANAGER":
          navigate("/dashboard");
          break;
        default:
          setErrorMessage("Unknown role");
      }
      setErrorMessage("");
    } catch (error) {
      console.error("Error logging in", error);
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left Panel */}
      <div className="leftPanel flex flex-1 justify-center items-center bg-gray-100">
        <div className="flex flex-col items-center">
          <form
            onSubmit={handleSubmit}
            className="bg-LightGray p-8 rounded-lg shadow-md"
          >
            <h2 className="text-xl font-bold text-NavyBlue mb-6">
              <div className="max-w-xs text-center">
                Enter your username and password
              </div>
            </h2>

            {/* Error message */}
            {errorMessage && (
              <div style={{ color: "red", marginTop: "10px" }}>
                <strong>Error: </strong>
                {errorMessage}
              </div>
            )}

            {/* Username Input */}
            <div className="mb-4">
              <label className="block text-gray-700" htmlFor="username">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Please enter your username"
                className="mt-1 block w-full px-4 py-2 border border-ButtonsBlue rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" // Blue border
              />
            </div>

            {/* Password Input */}
            <div className="mb-4 relative">
              <label className="block text-gray-700" htmlFor="password">
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Please enter your password"
                className="mt-1 block w-full px-4 py-2 border border-ButtonsBlue rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" // Blue border
              />
              <span
                className="absolute right-4 top-9 text-gray-500 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "🙈" : "👁️"}
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-ButtonsBlue text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Submit
            </button>
          </form>

          {/* collabration text*/}
          <div className="flex items-center justify-center mt-4 space-x-2">
            <p className="text-sm text-gray-500">
              Company 3 in collaboration with
            </p>
            <img src={axisLogo} alt="Secure" className="h-3 w-8" />
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="rightPanel flex flex-1 justify-center items-center bg-NavyBlue bg-opacity-80 text-white text-6xl font-bold">
        <div className="max-w-xs text-center">
          All-Around Awareness Anytime Anywhere
        </div>
      </div>
    </div>
  );
};

export default Login;
