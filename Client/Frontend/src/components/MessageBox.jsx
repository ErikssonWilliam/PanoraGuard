import { useEffect, useRef } from "react";

const MessageBox = ({
  textColor = "text-black", // Default text color
  message = "",
  showButtons = false, // Whether to show confirmation/cancel buttons
  onConfirm = () => {}, // Callback for the confirm button
  onCancel = () => {}, // Callback for the cancel button
  onExit = () => {},
}) => {
  const messageBoxRef = useRef(null);

  useEffect(() => {
    if (!message || showButtons) return;
    console.log(message);
    const timer = setTimeout(() => {
      onExit(); // Clear the message after 2 seconds
    }, 1000);

    return () => clearTimeout(timer); // Cleanup timeout on component unmount or dependency change
  }, [message, onExit, showButtons]);

  return (
    message && (
      <div
        ref={messageBoxRef}
        className={`z-50 fixed bottom-1/4 inset-0 flex items-center justify-center p-4`}
      >
        <div
          className={`max-w-sm w-full rounded-lg shadow-lg font-semibold bg-white border ${textColor} transform transition-all duration-300 ease-in-out`}
        >
          <p className="text-center text-2xl  py-4">{message}</p>
          {showButtons && (
            <div className="flex justify-center gap-4 p-4 border-t">
              <button
                onClick={() => {
                  onConfirm();
                  onExit();
                }}
                className="px-6 py-2 bg-green-500 text-white text-xl rounded-md shadow-sm hover:bg-green-600 transition-colors"
              >
                Confirm
              </button>
              <button
                onClick={() => {
                  onCancel();
                  onExit("");
                }}
                className="px-6 py-2 bg-red-500 text-white text-xl rounded-md shadow-sm hover:bg-red-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    )
  );
};

export default MessageBox;
