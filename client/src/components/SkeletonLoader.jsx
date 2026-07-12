import React from "react";

// Base skeleton block
const SkeletonBlock = ({ className = "" }) => (
  <div className={`rounded-lg animate-shimmer ${className}`} />
);

// KPI Card Skeleton
export const KPICardSkeleton = () => (
  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
    <div className="flex justify-between items-start">
      <div className="space-y-2">
        <SkeletonBlock className="h-3 w-20" />
        <SkeletonBlock className="h-8 w-16" />
      </div>
      <SkeletonBlock className="h-11 w-11 rounded-xl" />
    </div>
    <SkeletonBlock className="h-1 w-full" />
    <SkeletonBlock className="h-3 w-24" />
  </div>
);

// Chart Skeleton
export const ChartSkeleton = () => (
  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
    <SkeletonBlock className="h-4 w-32" />
    <div className="flex items-center justify-center py-8">
      <SkeletonBlock className="h-40 w-40 rounded-full" />
    </div>
  </div>
);

// Table Row Skeleton
export const TableRowSkeleton = ({ columns = 5 }) => (
  <tr className="border-b border-slate-800/40">
    {Array.from({ length: columns }).map((_, i) => (
      <td key={i} className="px-6 py-4">
        <SkeletonBlock className="h-4 w-full max-w-[120px]" />
      </td>
    ))}
  </tr>
);

// Full Table Skeleton
export const TableSkeleton = ({ rows = 5, columns = 6 }) => (
  <div className="w-full bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
    {/* Toolbar skeleton */}
    <div className="flex items-center justify-between gap-4 p-4 border-b border-slate-800">
      <SkeletonBlock className="h-9 w-64" />
      <SkeletonBlock className="h-9 w-32" />
    </div>
    {/* Table skeleton */}
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-800 bg-slate-900/80">
            {Array.from({ length: columns }).map((_, i) => (
              <th key={i} className="px-6 py-4">
                <SkeletonBlock className="h-3 w-20" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, i) => (
            <TableRowSkeleton key={i} columns={columns} />
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// Dashboard Skeleton
export const DashboardSkeleton = () => (
  <div className="space-y-6 animate-fade-in">
    {/* Header skeleton */}
    <div className="flex justify-between items-center">
      <div className="space-y-2">
        <SkeletonBlock className="h-7 w-40" />
        <SkeletonBlock className="h-4 w-64" />
      </div>
      <SkeletonBlock className="h-9 w-32 rounded-xl" />
    </div>
    {/* KPI Grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
      {Array.from({ length: 7 }).map((_, i) => (
        <KPICardSkeleton key={i} />
      ))}
    </div>
    {/* Charts row */}
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      <ChartSkeleton />
      <ChartSkeleton />
      <ChartSkeleton />
    </div>
  </div>
);

const SkeletonLoader = ({ type = "table", ...props }) => {
  switch (type) {
    case "dashboard":
      return <DashboardSkeleton />;
    case "table":
      return <TableSkeleton {...props} />;
    case "kpi":
      return <KPICardSkeleton />;
    case "chart":
      return <ChartSkeleton />;
    default:
      return <TableSkeleton {...props} />;
  }
};

export default SkeletonLoader;
