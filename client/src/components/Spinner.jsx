import React from "react";

const Spinner = ({ size = "md", color = "indigo" }) => {
  const sizeClasses = {
    sm: "w-5 h-5 border-2",
    md: "w-8 h-8 border-3",
    lg: "w-12 h-12 border-4",
  };

  const colorClasses = {
    indigo: "border-indigo-500 border-t-transparent",
    blue: "border-blue-500 border-t-transparent",
    emerald: "border-emerald-500 border-t-transparent",
  };

  return (
    <div className="flex items-center justify-center py-4">
      <div
        className={`animate-spin rounded-full ${sizeClasses[size] || sizeClasses.md} ${
          colorClasses[color] || colorClasses.indigo
        }`}
        role="status"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};

export default Spinner;
