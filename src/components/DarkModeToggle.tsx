import { useState } from "react";

const DarkModeToggle = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <div
      className={`flex items-center justify-center h-screen transition-all duration-500 ${
        isDarkMode ? "bg-gray-900" : "bg-gray-200"
      }`}
    >
      <div
        className={`relative flex items-center justify-center w-24 h-24 rounded-full cursor-pointer transition-all duration-500 ${
          isDarkMode ? "bg-yellow-400 shadow-yellow-400" : "bg-gray-300"
        } shadow-lg`}
        onClick={toggleMode}
      >
        {/* Bulb Filament */}
        <div
          className={`absolute w-8 h-8 bg-yellow-400 rounded-full transition-opacity duration-500 ${
            isDarkMode ? "opacity-100" : "opacity-0"
          }`}
        ></div>

        {/* Bulb Icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-10 h-10 text-gray-800 dark:text-gray-200"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 2a7 7 0 00-7 7c0 2.39 1.2 4.48 3 5.74V17a2 2 0 002 2h4a2 2 0 002-2v-2.26A6.992 6.992 0 0019 9a7 7 0 00-7-7z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 21h6m-6 0a3 3 0 006 0m-6 0H7m10 0h2"
          />
        </svg>

        {/* Glow Effect */}
        <div
          className={`absolute w-36 h-36 rounded-full transition-all duration-500 ${
            isDarkMode
              ? "opacity-30 bg-yellow-300 animate-pulse"
              : "opacity-0 bg-transparent"
          }`}
        ></div>
      </div>
    </div>
  );
};

export default DarkModeToggle;
