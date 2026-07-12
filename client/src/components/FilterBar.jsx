import React from "react";

const FilterBar = ({ filters = [], activeFilter, onFilterChange }) => {
  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {filters.map((filter) => {
        const isActive = activeFilter === filter.value;
        return (
          <button
            key={filter.value}
            onClick={() => onFilterChange(filter.value)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer border ${
              isActive
                ? "bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-600/20"
                : "bg-slate-900/60 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-slate-200"
            }`}
          >
            {filter.label}
            {filter.count !== undefined && (
              <span
                className={`ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full ${
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-slate-800 text-slate-500"
                }`}
              >
                {filter.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default FilterBar;
