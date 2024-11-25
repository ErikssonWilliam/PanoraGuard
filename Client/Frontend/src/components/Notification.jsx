import { useNavigate } from "react-router-dom";

const Notification = ({ message }) => {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-md text-center max-w-sm w-full">
        <p className="text-gray-800 mb-4">{message}</p>
        <button
          onClick={() => {
            navigate("/");
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Go to Login
        </button>
      </div>
    </div>
  );
};

export default Notification;
