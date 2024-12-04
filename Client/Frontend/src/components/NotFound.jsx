import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-md text-center max-w-sm w-full">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">
          404 - Page Not Found
        </h1>
        <p className="text-gray-600 mb-6">
          Oops! The page you are looking for doesn&apos;t exist.
        </p>
        <button
          onClick={() => {
            navigate("/");
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Go to Homepage
        </button>
      </div>
    </div>
  );
};

export default NotFound;
