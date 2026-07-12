import React from "react";

const EmptyState = ({ icon = "📭", title = "No Data Found", message = "", actionLabel, onAction }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 animate-fade-in-up">
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="text-lg font-bold text-slate-200 mb-1">{title}</h3>
      {message && (
        <p className="text-sm text-slate-400 text-center max-w-sm mb-4">{message}</p>
      )}
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-indigo-600/20 cursor-pointer"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
