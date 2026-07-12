import React from "react";

const statusConfig = {
  Available: {
    emoji: "🟢",
    classes: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  },
  "On Trip": {
    emoji: "🟡",
    classes: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  },
  "In Shop": {
    emoji: "🔴",
    classes: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  },
  Retired: {
    emoji: "⚫",
    classes: "bg-slate-500/10 text-slate-400 border-slate-500/20",
  },
  Suspended: {
    emoji: "⚫",
    classes: "bg-rose-500/10 text-rose-400 border-rose-500/20",
  },
  "Off Duty": {
    emoji: "🔵",
    classes: "bg-slate-500/10 text-slate-400 border-slate-500/20",
  },
  Completed: {
    emoji: "✅",
    classes: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  },
  Dispatched: {
    emoji: "🟡",
    classes: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  },
  Pending: {
    emoji: "🟠",
    classes: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  },
};

const StatusBadge = ({ status, size = "sm" }) => {
  const config = statusConfig[status] || {
    emoji: "⚪",
    classes: "bg-slate-500/10 text-slate-400 border-slate-500/20",
  };

  const sizeClasses = {
    xs: "text-[10px] px-1.5 py-0.5 gap-1",
    sm: "text-xs px-2.5 py-1 gap-1.5",
    md: "text-sm px-3 py-1.5 gap-1.5",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full font-semibold border whitespace-nowrap ${config.classes} ${sizeClasses[size] || sizeClasses.sm}`}
    >
      <span className="text-[10px] leading-none">{config.emoji}</span>
      {status}
    </span>
  );
};

export default StatusBadge;
