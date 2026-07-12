import React from "react";

const KPICard = ({ title, value, icon, gradient, subtitle, delay = 0 }) => {
  return (
    <div
      className="opacity-0 animate-fade-in-up card-hover relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-xl group"
      style={{ animationDelay: `${delay}ms`, animationFillMode: "forwards" }}
    >
      {/* Gradient Background Glow */}
      <div
        className={`absolute inset-0 opacity-[0.07] bg-gradient-to-br ${gradient} group-hover:opacity-[0.12] transition-opacity duration-500`}
      />

      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xl">{icon}</span>
          <div
            className={`h-8 w-8 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300`}
          >
            <span className="text-white text-xs font-bold">{value}</span>
          </div>
        </div>
        <div className="text-2xl font-black text-slate-100 mb-1">
          {value}
        </div>
        <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
          {title}
        </div>
        {subtitle && (
          <div className="text-[10px] text-slate-500 mt-1">{subtitle}</div>
        )}
      </div>
    </div>
  );
};

export default KPICard;
