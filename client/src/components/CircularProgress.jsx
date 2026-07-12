import React from "react";

const CircularProgress = ({ value = 0, size = 120, strokeWidth = 8, color = "#6366f1", label = "" }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedValue = Math.min(Math.max(value, 0), 100);
  const offset = circumference - (clampedValue / 100) * circumference;

  // Color based on value
  const getColor = () => {
    if (clampedValue >= 75) return "#10b981";
    if (clampedValue >= 50) return "#f59e0b";
    if (clampedValue >= 25) return "#f97316";
    return "#ef4444";
  };

  const displayColor = color === "auto" ? getColor() : color;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(51, 65, 85, 0.4)"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={displayColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="animate-progress-fill transition-all duration-1000 ease-out"
          style={{
            filter: `drop-shadow(0 0 6px ${displayColor}40)`,
          }}
        />
      </svg>
      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-black text-slate-100">{Math.round(clampedValue)}%</span>
        {label && (
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5">
            {label}
          </span>
        )}
      </div>
    </div>
  );
};

export default CircularProgress;
