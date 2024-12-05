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
        className={`z-50 fixed top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 transform
        px-4 py-2 md:py-4 rounded-md bg-white ${textColor} border-black border-2`}
      >
        <p className="text-center text-xl font-semibold">{message}</p>
        {showButtons && (
          <div className="flex justify-center gap-4 mt-4">
            <button
              onClick={() => {
                onConfirm();
                onExit();
              }}
              className="px-4 py-2 bg-green-500 text-black text-xl rounded hover:bg-green-600"
            >
              Confirm
            </button>
            <button
              onClick={() => {
                onCancel();
                onExit("");
              }}
              className="px-4 py-2 bg-red-500 text-black text-xl rounded hover:bg-red-600"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    )
  );
};

export default MessageBox;
