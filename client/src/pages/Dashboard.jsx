import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  IoCarOutline,
  IoPeopleOutline,
  IoNavigateOutline,
  IoBuildOutline,
  IoRefreshOutline,
  IoArrowForwardOutline,
} from "react-icons/io5";
import API from "../services/api";
import Spinner from "../components/Spinner";

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const response = await API.get("/dashboard");
      if (response.data.success) {
        setData(response.data);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load dashboard statistics");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (isLoading && !data) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  const stats = data?.stats || {};
  const recentTrips = data?.recentTrips || [];
  const recentMaintenance = data?.recentMaintenance || [];

  const statCards = [
    {
      title: "Vehicles Status",
      icon: IoCarOutline,
      color: "from-blue-600 to-indigo-600 shadow-indigo-500/25",
      badgeColor: "text-blue-400 bg-blue-500/10 border-blue-500/20",
      total: stats.totalVehicles,
      metrics: [
        { label: "Available", value: stats.availableVehicles, color: "text-emerald-400" },
        { label: "On Trip", value: stats.vehiclesOnTrip, color: "text-blue-400" },
        { label: "In Shop", value: stats.vehiclesInShop, color: "text-amber-400" },
      ],
    },
    {
      title: "Drivers Status",
      icon: IoPeopleOutline,
      color: "from-emerald-600 to-teal-600 shadow-teal-500/25",
      badgeColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
      total: stats.totalDrivers,
      metrics: [
        { label: "Available", value: stats.availableDrivers, color: "text-emerald-400" },
        { label: "On Trip", value: stats.driversOnTrip, color: "text-blue-400" },
        { label: "Suspended", value: stats.suspendedDrivers, color: "text-rose-400" },
      ],
    },
    {
      title: "Trip Metrics",
      icon: IoNavigateOutline,
      color: "from-purple-600 to-indigo-600 shadow-purple-500/25",
      badgeColor: "text-purple-400 bg-purple-500/10 border-purple-500/20",
      total: stats.totalTrips,
      metrics: [
        { label: "Active", value: stats.activeTrips, color: "text-blue-400" },
        { label: "Completed", value: stats.completedTrips, color: "text-emerald-400" },
      ],
    },
    {
      title: "Maintenance Stats",
      icon: IoBuildOutline,
      color: "from-amber-600 to-orange-600 shadow-orange-500/25",
      badgeColor: "text-amber-400 bg-amber-500/10 border-amber-500/20",
      total: stats.totalMaintenance,
      metrics: [
        { label: "Pending", value: stats.pendingMaintenance, color: "text-amber-400" },
        { label: "Completed", value: stats.completedMaintenance, color: "text-emerald-400" },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome & Action Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl lg:text-3xl font-extrabold text-slate-100 tracking-tight">
            Dashboard
          </h2>
          <p className="text-sm text-slate-400 mt-1">Real-time status of your fleet and operations</p>
        </div>
        <button
          onClick={fetchDashboardData}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 border border-slate-800 bg-slate-900 text-slate-300 hover:text-slate-100 hover:bg-slate-800 rounded-xl text-sm transition-all cursor-pointer shadow-lg shadow-slate-950/20"
        >
          <IoRefreshOutline className={`text-lg ${isLoading ? "animate-spin" : ""}`} />
          Refresh Stats
        </button>
      </div>

      {/* Statistics Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:border-slate-700/80 group"
            >
              {/* Card Header */}
              <div className="flex justify-between items-start mb-4 relative z-10">
                <div>
                  <h4 className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
                    {card.title}
                  </h4>
                  <p className="text-3xl font-black text-slate-100 mt-1.5">{card.total}</p>
                </div>
                <div
                  className={`h-11 w-11 rounded-xl bg-gradient-to-tr ${card.color} text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}
                >
                  <Icon className="text-xl" />
                </div>
              </div>

              {/* Card Metrics Breakdown */}
              <div className="flex gap-4 border-t border-slate-800/80 pt-4 relative z-10">
                {card.metrics.map((m, mIdx) => (
                  <div key={mIdx} className="flex-1 text-center">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">
                      {m.label}
                    </span>
                    <span className={`text-sm font-bold block mt-0.5 ${m.color}`}>
                      {m.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity Tables Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Recent Trips Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-800 flex justify-between items-center">
            <div className="flex items-center gap-2.5">
              <IoNavigateOutline className="text-indigo-400 text-lg" />
              <h3 className="text-base font-bold text-slate-100">Recent Trips</h3>
            </div>
            <span className="text-xs text-slate-500 font-medium">Last 5 dispatches</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/50 text-slate-400 font-semibold text-xs uppercase tracking-wider">
                  <th className="px-6 py-3.5">Vehicle</th>
                  <th className="px-6 py-3.5">Driver</th>
                  <th className="px-6 py-3.5">Route</th>
                  <th className="px-6 py-3.5">Cargo</th>
                  <th className="px-6 py-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {recentTrips.length > 0 ? (
                  recentTrips.map((trip) => (
                    <tr key={trip._id} className="hover:bg-slate-850/20 transition-colors">
                      <td className="px-6 py-3 whitespace-nowrap">
                        <div className="font-semibold text-slate-200">
                          {trip.vehicle?.registrationNumber || "N/A"}
                        </div>
                        <div className="text-[10px] text-slate-500">{trip.vehicle?.model || "-"}</div>
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap">
                        <div className="text-slate-200">{trip.driver?.name || "N/A"}</div>
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-xs">
                          <span>{trip.source}</span>
                          <IoArrowForwardOutline className="text-slate-500 text-[10px]" />
                          <span>{trip.destination}</span>
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5">
                          {trip.plannedDistance} km
                        </div>
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap font-medium text-xs">
                        {trip.cargoWeight} kg
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap">
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                            trip.status === "Completed"
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                              : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                          }`}
                        >
                          {trip.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500 text-xs">
                      No recent trips found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Maintenance Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-800 flex justify-between items-center">
            <div className="flex items-center gap-2.5">
              <IoBuildOutline className="text-amber-400 text-lg" />
              <h3 className="text-base font-bold text-slate-100">Recent Maintenance</h3>
            </div>
            <span className="text-xs text-slate-500 font-medium">Last 5 service logs</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/50 text-slate-400 font-semibold text-xs uppercase tracking-wider">
                  <th className="px-6 py-3.5">Vehicle</th>
                  <th className="px-6 py-3.5">Issue</th>
                  <th className="px-6 py-3.5">Cost</th>
                  <th className="px-6 py-3.5">Date</th>
                  <th className="px-6 py-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {recentMaintenance.length > 0 ? (
                  recentMaintenance.map((m) => (
                    <tr key={m._id} className="hover:bg-slate-850/20 transition-colors">
                      <td className="px-6 py-3 whitespace-nowrap">
                        <div className="font-semibold text-slate-200">
                          {m.vehicle?.registrationNumber || "N/A"}
                        </div>
                        <div className="text-[10px] text-slate-500">{m.vehicle?.model || "-"}</div>
                      </td>
                      <td className="px-6 py-3">
                        <div className="text-slate-200 font-medium line-clamp-1">{m.issue}</div>
                        <div className="text-[10px] text-slate-500 line-clamp-1">
                          {m.description || "-"}
                        </div>
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap text-slate-200 font-semibold text-xs">
                        ₹{m.cost.toLocaleString()}
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap text-xs text-slate-400">
                        {new Date(m.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap">
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                            m.status === "Completed"
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                              : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                          }`}
                        >
                          {m.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500 text-xs">
                      No recent maintenance entries.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
