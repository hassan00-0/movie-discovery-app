import React from "react";

const LoaderIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="48"
    height="48"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-infinity text-purple-500 animate-spin-slow"
  >
    <path d="M12 12c-2-2.67-4-4-6-4a4 4 0 1 0 0 8c2 0 4-1.33 6-4Zm0 0c2 2.67 4 4 6 4a4 4 0 0 0 0-8c-2 0-4 1.33-6 4Z" />
  </svg>
);

const Loader = () => {
  return (
    <>
      <style>
        {`
          @keyframes spin-slow {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          .animate-spin-slow {
            animation: spin-slow 3s linear infinite; /* Adjust duration as needed */
          }

          /* Adjusted pulse-fade for dark background for subtlety */
          @keyframes pulse-fade {
            0%, 100% { opacity: 0.9; transform: scale(0.98); }
            50% { opacity: 1; transform: scale(1); }
          }
          .animate-pulse-fade {
            animation: pulse-fade 2s ease-in-out infinite;
          }

          @keyframes progress {
            0% { width: 0%; }
            100% { width: 100%; }
          }
          .animate-progress {
            animation: progress 2s ease-out forwards; /* Simulates a progress bar filling */
          }
        `}
      </style>

      <div className="flex flex-col items-center justify-center p-8 bg-gray-900 rounded-xl shadow-2xl transform transition-all duration-300 hover:scale-105 animate-pulse-fade">
        <LoaderIcon />

        <p className="mt-4 text-xl font-semibold text-white">Loading ...</p>

        <div className="w-full bg-gray-800 rounded-full h-2.5 mt-4 overflow-hidden">
          <div
            className="bg-gradient-to-r from-purple-400 to-purple-600 h-2.5 rounded-full animate-progress"
            style={{ width: "0%" }}
          ></div>
        </div>
      </div>
    </>
  );
};

export default Loader;
