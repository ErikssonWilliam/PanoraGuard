import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { externalURL } from "../api/axiosConfig";
import axisLogo from "../assets/AxisLogo.png";
import c3Logo from "../assets/C3.svg";
import panoraGuardLogo from "../assets/PanoraGuard.svg";
import rightPanelImage from "../assets/pattern.png";
import axios from "axios";
import { useAuthStore } from "../utils/useAuthStore";

const Login = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const { setToken, setUserId, setUserRole } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(`${externalURL}/auth/login`, formData);

      const user = await response.data; // Fetch and store user data

      setToken(user.access_token);
      setUserId(user.user_id);
      setUserRole(user.role);

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
          setError("Unknown role");
      }
      setError("");
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      if (error.response && error.response.data && error.response.data.error) {
        setError(error.response.data.error); // Extract backend message
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
      console.error("Error logging in:", error);
    }
  };

  return (
    <div className="flex w-full h-screen">
      {/* Left Panel */}
      <div className="leftPanel flex flex-1 flex-col bg-gray-100 justify-center">
        {/* Logo positioned closer to the panel */}
        <div className="flex justify-center">
          <img src={panoraGuardLogo} alt="Logo" className="h-10" />
        </div>

        <div className="flex justify-center items-center h-auto py-4">
          <div className="flex flex-col items-center lg:w-full sm:w-4/5 p-4">
            <form
              onSubmit={handleSubmit}
              className="bg-LightGray p-8 rounded-lg shadow-md"
            >
              <h3 className="lg:text-xl font-bold text-gray-700 mb-6">
                <div className="max-w-xs text-center">
                  Please enter your login details
                </div>
              </h3>

              {/* Error message */}
              {error && (
                <div style={{ color: "red", marginTop: "10px" }}>
                  <strong>Error: </strong>
                  {error}
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
                  className="mt-1 block w-full px-4 py-2 border border-ButtonsBlue rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
                  className="mt-1 block w-full px-4 py-2 border border-ButtonsBlue rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
                className="w-full bg-cyan-700 text-white py-2 px-4 rounded-md hover:bg-cyan-800 transition-colors"
              >
                Submit
              </button>

              {isLoading && (
                <div className="flex justify-center items-bottom h-5 mt-4">
                  <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin"></div>
                </div>
              )}
            </form>

            {/* Collaboration text */}
            <div className="flex items-center justify-center mt-4 space-x-2">
              <p className="text-sm text-gray-500">made by</p>
              <img src={c3Logo} alt="Secure" className="h-5 w-5" />
              <p className="text-sm text-gray-500">in collaboration with</p>
              <img src={axisLogo} alt="Secure" className="h-3 w-8" />
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel with Image and Text */}
      <div
        className="hidden sm:flex sm:flex-1 bg-cover bg-center bg-opacity-80 text-white sm:justify-center sm:items-center lg:text-6xl sm:text-5xl font-bold"
        style={{ backgroundImage: `url(${rightPanelImage})` }}
      >
        <div className="max-w-xs text-center">
          All-Around Awareness Anytime Anywhere
        </div>
      </div>
    </div>
  );
};

export default Login;
