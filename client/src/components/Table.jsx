import React, { useState, useMemo } from "react";
import {
  IoSearchOutline,
  IoChevronBack,
  IoChevronForward,
  IoChevronUp,
  IoChevronDown,
  IoDownloadOutline,
} from "react-icons/io5";
import EmptyState from "./EmptyState";

const Table = ({
  columns,
  data = [],
  searchPlaceholder = "Search...",
  filterFunction,
  actions,
  filterBar,
  itemsPerPage = 10,
  emptyIcon = "📭",
  emptyTitle = "No Records Found",
  emptyMessage = "Try adjusting your search or filters",
  onExportCSV,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

  // Search filter
  const filteredData = useMemo(() => {
    return data.filter((row) => {
      if (filterFunction) {
        return filterFunction(row, searchTerm);
      }
      if (!searchTerm) return true;

      // Default search looks through all column values
      return columns.some((col) => {
        const value = col.render ? col.render(row) : row[col.key];
        if (value === null || value === undefined) return false;
        return String(value).toLowerCase().includes(searchTerm.toLowerCase());
      });
    });
  }, [data, searchTerm, columns, filterFunction]);

  // Sorting
  const sortedData = useMemo(() => {
    if (!sortConfig.key || !sortConfig.direction) return filteredData;

    return [...filteredData].sort((a, b) => {
      const col = columns.find((c) => c.key === sortConfig.key);
      let aVal, bVal;

      if (col?.sortAccessor) {
        aVal = col.sortAccessor(a);
        bVal = col.sortAccessor(b);
      } else {
        aVal = a[sortConfig.key];
        bVal = b[sortConfig.key];
      }

      // Handle null/undefined
      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return 1;
      if (bVal == null) return -1;

      // Numeric comparison
      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortConfig.direction === "asc" ? aVal - bVal : bVal - aVal;
      }

      // String comparison
      const aStr = String(aVal).toLowerCase();
      const bStr = String(bVal).toLowerCase();
      if (aStr < bStr) return sortConfig.direction === "asc" ? -1 : 1;
      if (aStr > bStr) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortConfig, columns]);

  // Pagination calculations
  const totalItems = sortedData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = sortedData.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        if (prev.direction === "asc") return { key, direction: "desc" };
        if (prev.direction === "desc") return { key: null, direction: null };
      }
      return { key, direction: "asc" };
    });
  };

  const SortIcon = ({ columnKey }) => {
    if (sortConfig.key !== columnKey) {
      return (
        <span className="ml-1 inline-flex flex-col text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
          <IoChevronUp className="text-[8px] -mb-0.5" />
          <IoChevronDown className="text-[8px]" />
        </span>
      );
    }
    return (
      <span className="ml-1 text-indigo-400">
        {sortConfig.direction === "asc" ? (
          <IoChevronUp className="text-[10px]" />
        ) : (
          <IoChevronDown className="text-[10px]" />
        )}
      </span>
    );
  };

  return (
    <div className="w-full bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden shadow-lg backdrop-blur-md animate-fade-in-up">
      {/* Table Toolbar */}
      <div className="flex flex-col gap-3 p-4 border-b border-slate-800 bg-slate-900/40">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:max-w-xs">
            <IoSearchOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 bg-slate-950/60 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm transition-all"
            />
          </div>
          <div className="w-full sm:w-auto flex items-center justify-end gap-2">
            {onExportCSV && (
              <button
                onClick={onExportCSV}
                className="flex items-center gap-1.5 px-3 py-2 border border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg text-xs font-medium transition-all cursor-pointer"
                title="Export as CSV"
              >
                <IoDownloadOutline className="text-sm" />
                Export
              </button>
            )}
            {actions}
          </div>
        </div>
        {filterBar && <div>{filterBar}</div>}
      </div>

      {/* Desktop Table */}
      <div className="overflow-x-auto hidden md:block">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/80 text-slate-400 font-semibold uppercase tracking-wider text-xs">
              {columns.map((col, idx) => {
                const isSortable = col.key && col.key !== "actions";
                return (
                  <th
                    key={idx}
                    className={`px-6 py-4 ${isSortable ? "cursor-pointer select-none group hover:text-slate-200 transition-colors" : ""}`}
                    onClick={() => isSortable && handleSort(col.key)}
                  >
                    <span className="inline-flex items-center">
                      {col.header}
                      {isSortable && <SortIcon columnKey={col.key} />}
                    </span>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-300">
            {paginatedData.length > 0 ? (
              paginatedData.map((row, rowIdx) => (
                <tr
                  key={row._id || rowIdx}
                  className="hover:bg-slate-800/30 transition-colors"
                >
                  {columns.map((col, colIdx) => (
                    <td key={colIdx} className="px-6 py-4 whitespace-nowrap">
                      {col.render ? col.render(row) : row[col.key] || "-"}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length}>
                  <EmptyState
                    icon={emptyIcon}
                    title={emptyTitle}
                    message={emptyMessage}
                  />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden divide-y divide-slate-800/60">
        {paginatedData.length > 0 ? (
          paginatedData.map((row, rowIdx) => (
            <div
              key={row._id || rowIdx}
              className="p-4 hover:bg-slate-800/20 transition-colors space-y-2"
            >
              {columns.map((col, colIdx) => {
                if (col.key === "actions") {
                  return (
                    <div key={colIdx} className="pt-2 border-t border-slate-800/40">
                      {col.render ? col.render(row) : null}
                    </div>
                  );
                }
                return (
                  <div key={colIdx} className="flex items-center justify-between gap-2">
                    <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                      {col.header}
                    </span>
                    <span className="text-sm text-slate-300">
                      {col.render ? col.render(row) : row[col.key] || "-"}
                    </span>
                  </div>
                );
              })}
            </div>
          ))
        ) : (
          <EmptyState
            icon={emptyIcon}
            title={emptyTitle}
            message={emptyMessage}
          />
        )}
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-900/20 text-slate-400 text-xs">
          <div>
            Showing <span className="font-semibold text-slate-300">{startIndex + 1}</span> to{" "}
            <span className="font-semibold text-slate-300">
              {Math.min(startIndex + itemsPerPage, totalItems)}
            </span>{" "}
            of <span className="font-semibold text-slate-300">{totalItems}</span> results
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-1.5 rounded bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-slate-300 transition-colors cursor-pointer disabled:cursor-not-allowed"
            >
              <IoChevronBack className="text-base" />
            </button>
            <span className="text-slate-300">
              Page <span className="font-semibold">{currentPage}</span> of{" "}
              <span className="font-semibold">{totalPages}</span>
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-slate-300 transition-colors cursor-pointer disabled:cursor-not-allowed"
            >
              <IoChevronForward className="text-base" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Table;
