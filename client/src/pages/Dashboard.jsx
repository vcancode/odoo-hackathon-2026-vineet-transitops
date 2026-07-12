import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  IoRefreshOutline,
  IoCarOutline,
  IoPeopleOutline,
  IoNavigateOutline,
  IoBuildOutline,
  IoAddOutline,
  IoArrowForwardOutline,
  IoTrophyOutline,
  IoTimeOutline,
  IoFlashOutline,
  IoShieldCheckmarkOutline,
} from "react-icons/io5";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import API from "../services/api";
import AnimatedNumber from "../components/AnimatedNumber";
import CircularProgress from "../components/CircularProgress";
import StatusBadge from "../components/StatusBadge";
import { DashboardSkeleton } from "../components/SkeletonLoader";
import { canCurrentUser } from "../utils/rolePermissions";

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [drivers, setDrivers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const [dashRes, driversRes] = await Promise.all([
        API.get("/dashboard"),
        API.get("/drivers"),
      ]);
      if (dashRes.data.success) setData(dashRes.data);
      if (driversRes.data.success) setDrivers(driversRes.data.drivers);
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
    return <DashboardSkeleton />;
  }

  const stats = data?.stats || {};
  const recentTrips = data?.recentTrips || [];
  const recentMaintenance = data?.recentMaintenance || [];

  // ── KPI Cards Config ──
  const kpiCards = [
    {
      title: "Total Vehicles",
      value: stats.totalVehicles || 0,
      icon: "🚚",
      gradient: "from-blue-600 to-indigo-600",
    },
    {
      title: "Available",
      value: stats.availableVehicles || 0,
      icon: "🟢",
      gradient: "from-emerald-600 to-teal-600",
    },
    {
      title: "On Trip",
      value: stats.vehiclesOnTrip || 0,
      icon: "🟡",
      gradient: "from-amber-500 to-yellow-500",
    },
    {
      title: "In Shop",
      value: stats.vehiclesInShop || 0,
      icon: "🔴",
      gradient: "from-rose-600 to-red-600",
    },
    {
      title: "Total Drivers",
      value: stats.totalDrivers || 0,
      icon: "👨",
      gradient: "from-violet-600 to-purple-600",
    },
    {
      title: "Active Trips",
      value: stats.activeTrips || 0,
      icon: "📦",
      gradient: "from-cyan-600 to-blue-600",
    },
    {
      title: "Pending Maint.",
      value: stats.pendingMaintenance || 0,
      icon: "🛠",
      gradient: "from-orange-600 to-amber-600",
    },
  ];

  // ── Charts Data ──
  const vehicleChartData = [
    { name: "Available", value: stats.availableVehicles || 0 },
    { name: "On Trip", value: stats.vehiclesOnTrip || 0 },
    { name: "In Shop", value: stats.vehiclesInShop || 0 },
  ];
  const vehicleChartColors = ["#10b981", "#f59e0b", "#ef4444"];

  const tripChartData = [
    { name: "Completed", value: stats.completedTrips || 0 },
    { name: "Active", value: stats.activeTrips || 0 },
  ];
  const tripChartColors = ["#10b981", "#6366f1"];

  const driverBarData = [
    { name: "Available", count: stats.availableDrivers || 0, fill: "#10b981" },
    { name: "On Trip", count: stats.driversOnTrip || 0, fill: "#f59e0b" },
    { name: "Suspended", count: stats.suspendedDrivers || 0, fill: "#ef4444" },
  ];

  // ── Fleet Health Score ──
  const totalV = stats.totalVehicles || 1;
  const totalD = stats.totalDrivers || 1;
  const totalT = stats.totalTrips || 1;
  const fleetHealth = Math.round(
    0.4 * ((stats.availableVehicles || 0) / totalV) * 100 +
    0.3 * ((stats.availableDrivers || 0) / totalD) * 100 +
    0.3 * ((stats.completedTrips || 0) / totalT) * 100
  );

  const getHealthLabel = (score) => {
    if (score >= 80) return { text: "Excellent", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" };
    if (score >= 60) return { text: "Good", color: "text-blue-400 bg-blue-500/10 border-blue-500/20" };
    if (score >= 40) return { text: "Fair", color: "text-amber-400 bg-amber-500/10 border-amber-500/20" };
    return { text: "Critical", color: "text-rose-400 bg-rose-500/10 border-rose-500/20" };
  };

  const healthLabel = getHealthLabel(fleetHealth);

  // ── Fleet Utilization ──
  const fleetUtilization = stats.totalVehicles
    ? Math.round(((stats.vehiclesOnTrip || 0) / stats.totalVehicles) * 100)
    : 0;

  // ── Driver Leaderboard ──
  const topDrivers = [...drivers]
    .sort((a, b) => {
      if ((b.safetyScore || 0) !== (a.safetyScore || 0))
        return (b.safetyScore || 0) - (a.safetyScore || 0);
      return (b.tripCompletion || 0) - (a.tripCompletion || 0);
    })
    .slice(0, 5);

  const medals = ["🏆", "🥈", "🥉", "4", "5"];

  // ── Activity Timeline ──
  const timeline = [
    ...recentTrips.map((t) => ({
      id: t._id,
      type: "trip",
      title: t.status === "Completed" ? "Trip Completed" : "Trip Created",
      subtitle: `${t.source} → ${t.destination}`,
      vehicle: t.vehicle?.registrationNumber,
      time: t.updatedAt || t.createdAt,
      status: t.status,
    })),
    ...recentMaintenance.map((m) => ({
      id: m._id,
      type: "maintenance",
      title: m.status === "Completed" ? "Maintenance Completed" : "Maintenance Started",
      subtitle: m.issue,
      vehicle: m.vehicle?.registrationNumber,
      time: m.updatedAt || m.createdAt,
      status: m.status,
    })),
  ].sort((a, b) => new Date(b.time) - new Date(a.time));

  // ── Custom Chart Tooltip ──
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 shadow-xl text-xs">
          <p className="text-slate-200 font-semibold">{payload[0].name}</p>
          <p className="text-indigo-400">{payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  // ── Custom Pie Label ──
  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, name, value }) => {
    if (value === 0) return null;
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize="11" fontWeight="600">
        {value}
      </text>
    );
  };

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-fade-in-up">
        <div>
          <h2 className="text-2xl lg:text-3xl font-extrabold text-slate-100 tracking-tight">
            Dashboard
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Real-time status of your fleet and operations
          </p>
        </div>
        <button
          onClick={fetchDashboardData}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 border border-slate-800 bg-slate-900 text-slate-300 hover:text-slate-100 hover:bg-slate-800 rounded-xl text-sm transition-all cursor-pointer shadow-lg shadow-slate-950/20"
        >
          <IoRefreshOutline className={`text-lg ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* ── KPI Cards Grid ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
        {kpiCards.map((card, idx) => (
          <div
            key={idx}
            className="opacity-0 animate-fade-in-up card-hover relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 p-4 sm:p-5 shadow-xl group"
            style={{ animationDelay: `${idx * 60}ms`, animationFillMode: "forwards" }}
          >
            {/* Gradient glow */}
            <div
              className={`absolute inset-0 opacity-[0.07] bg-gradient-to-br ${card.gradient} group-hover:opacity-[0.15] transition-opacity duration-500`}
            />
            <div className="relative z-10">
              <span className="text-xl">{card.icon}</span>
              <div className="text-2xl font-black text-slate-100 mt-2">
                <AnimatedNumber value={card.value} />
              </div>
              <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mt-1">
                {card.title}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Quick Actions ── */}
      <div className="opacity-0 animate-fade-in-up" style={{ animationDelay: "350ms", animationFillMode: "forwards" }}>
        <div className="flex flex-wrap gap-2">
          {canCurrentUser("vehicles", "add") && (
            <button
              onClick={() => navigate("/vehicles")}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 hover:border-slate-700 rounded-xl text-xs font-medium transition-all cursor-pointer"
            >
              <IoAddOutline className="text-sm text-emerald-400" />
              Add Vehicle
            </button>
          )}
          {canCurrentUser("drivers", "add") && (
            <button
              onClick={() => navigate("/drivers")}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 hover:border-slate-700 rounded-xl text-xs font-medium transition-all cursor-pointer"
            >
              <IoAddOutline className="text-sm text-blue-400" />
              Add Driver
            </button>
          )}
          {canCurrentUser("trips", "add") && (
            <button
              onClick={() => navigate("/trips")}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 hover:border-slate-700 rounded-xl text-xs font-medium transition-all cursor-pointer"
            >
              <IoAddOutline className="text-sm text-indigo-400" />
              Dispatch Trip
            </button>
          )}
          {canCurrentUser("maintenance", "add") && (
            <button
              onClick={() => navigate("/maintenance")}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 hover:border-slate-700 rounded-xl text-xs font-medium transition-all cursor-pointer"
            >
              <IoAddOutline className="text-sm text-amber-400" />
              Maintenance
            </button>
          )}
        </div>
      </div>

      {/* ── Charts + Fleet Health + Utilization Row ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Vehicle Status Doughnut */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl opacity-0 animate-fade-in-up" style={{ animationDelay: "200ms", animationFillMode: "forwards" }}>
          <div className="flex items-center gap-2 mb-4">
            <IoCarOutline className="text-indigo-400 text-lg" />
            <h3 className="text-sm font-bold text-slate-100">Vehicle Status</h3>
          </div>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={vehicleChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                  labelLine={false}
                  label={renderCustomLabel}
                  animationDuration={1000}
                >
                  {vehicleChartData.map((_, i) => (
                    <Cell key={i} fill={vehicleChartColors[i]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-2">
            {vehicleChartData.map((d, i) => (
              <div key={i} className="flex items-center gap-1.5 text-xs text-slate-400">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: vehicleChartColors[i] }}
                />
                {d.name}
              </div>
            ))}
          </div>
        </div>

        {/* Trip Status Pie */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl opacity-0 animate-fade-in-up" style={{ animationDelay: "300ms", animationFillMode: "forwards" }}>
          <div className="flex items-center gap-2 mb-4">
            <IoNavigateOutline className="text-purple-400 text-lg" />
            <h3 className="text-sm font-bold text-slate-100">Trip Status</h3>
          </div>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={tripChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={0}
                  outerRadius={85}
                  paddingAngle={2}
                  dataKey="value"
                  labelLine={false}
                  label={renderCustomLabel}
                  animationDuration={1000}
                >
                  {tripChartData.map((_, i) => (
                    <Cell key={i} fill={tripChartColors[i]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-2">
            {tripChartData.map((d, i) => (
              <div key={i} className="flex items-center gap-1.5 text-xs text-slate-400">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: tripChartColors[i] }}
                />
                {d.name}
              </div>
            ))}
          </div>
        </div>

        {/* Driver Status Bar */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl opacity-0 animate-fade-in-up" style={{ animationDelay: "400ms", animationFillMode: "forwards" }}>
          <div className="flex items-center gap-2 mb-4">
            <IoPeopleOutline className="text-emerald-400 text-lg" />
            <h3 className="text-sm font-bold text-slate-100">Driver Status</h3>
          </div>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={driverBarData} barCategoryGap="25%">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(51,65,85,0.3)" />
                <XAxis
                  dataKey="name"
                  tick={{ fill: "#94a3b8", fontSize: 11 }}
                  axisLine={{ stroke: "rgba(51,65,85,0.3)" }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#94a3b8", fontSize: 11 }}
                  axisLine={{ stroke: "rgba(51,65,85,0.3)" }}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" radius={[6, 6, 0, 0]} animationDuration={1200}>
                  {driverBarData.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ── Fleet Health + Utilization + Leaderboard ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Fleet Health Score */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl card-hover opacity-0 animate-fade-in-up" style={{ animationDelay: "450ms", animationFillMode: "forwards" }}>
          <div className="flex items-center gap-2 mb-5">
            <IoShieldCheckmarkOutline className="text-emerald-400 text-lg" />
            <h3 className="text-sm font-bold text-slate-100">Fleet Health Score</h3>
          </div>
          <div className="flex flex-col items-center">
            <CircularProgress value={fleetHealth} size={140} strokeWidth={10} color="auto" />
            <span className={`mt-4 text-xs px-3 py-1 rounded-full font-bold border ${healthLabel.color}`}>
              {healthLabel.text}
            </span>
            <div className="mt-4 grid grid-cols-3 gap-3 w-full text-center">
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-500">Vehicles</div>
                <div className="text-xs font-bold text-slate-300">40%</div>
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-500">Drivers</div>
                <div className="text-xs font-bold text-slate-300">30%</div>
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-500">Trips</div>
                <div className="text-xs font-bold text-slate-300">30%</div>
              </div>
            </div>
          </div>
        </div>

        {/* Fleet Utilization */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl card-hover opacity-0 animate-fade-in-up" style={{ animationDelay: "500ms", animationFillMode: "forwards" }}>
          <div className="flex items-center gap-2 mb-5">
            <IoFlashOutline className="text-amber-400 text-lg" />
            <h3 className="text-sm font-bold text-slate-100">Fleet Utilization</h3>
          </div>
          <div className="flex flex-col items-center">
            <CircularProgress
              value={fleetUtilization}
              size={140}
              strokeWidth={10}
              color="#6366f1"
              label="Utilized"
            />
            <div className="mt-4 grid grid-cols-2 gap-4 w-full text-center">
              <div className="bg-slate-800/40 rounded-xl px-3 py-2">
                <div className="text-[10px] uppercase font-bold text-slate-500">On Trip</div>
                <div className="text-lg font-black text-slate-100">{stats.vehiclesOnTrip || 0}</div>
              </div>
              <div className="bg-slate-800/40 rounded-xl px-3 py-2">
                <div className="text-[10px] uppercase font-bold text-slate-500">Total</div>
                <div className="text-lg font-black text-slate-100">{stats.totalVehicles || 0}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Driver Leaderboard */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl card-hover opacity-0 animate-fade-in-up" style={{ animationDelay: "550ms", animationFillMode: "forwards" }}>
          <div className="flex items-center gap-2 mb-4">
            <IoTrophyOutline className="text-amber-400 text-lg" />
            <h3 className="text-sm font-bold text-slate-100">Top Drivers</h3>
          </div>
          <div className="space-y-2.5">
            {topDrivers.length > 0 ? (
              topDrivers.map((driver, idx) => (
                <div
                  key={driver._id}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-slate-800/30 hover:bg-slate-800/50 transition-colors"
                >
                  <span className="text-lg w-6 text-center">
                    {idx < 3 ? medals[idx] : (
                      <span className="text-xs font-bold text-slate-500">#{idx + 1}</span>
                    )}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-slate-200 truncate">
                      {driver.name}
                    </div>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-[10px] text-slate-400">
                        Safety <span className="font-bold text-emerald-400">{driver.safetyScore || 0}</span>
                      </span>
                      <span className="text-[10px] text-slate-400">
                        Trips <span className="font-bold text-blue-400">{driver.tripCompletion || 0}</span>
                      </span>
                    </div>
                  </div>
                  <StatusBadge status={driver.status} size="xs" />
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 text-center py-4">No drivers available</p>
            )}
          </div>
        </div>
      </div>

      {/* ── Activity Timeline + Recent Tables ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Timeline */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl opacity-0 animate-fade-in-up" style={{ animationDelay: "600ms", animationFillMode: "forwards" }}>
          <div className="flex items-center gap-2 mb-4">
            <IoTimeOutline className="text-indigo-400 text-lg" />
            <h3 className="text-sm font-bold text-slate-100">Activity Timeline</h3>
          </div>
          <div className="space-y-0">
            {timeline.length > 0 ? (
              timeline.slice(0, 8).map((item, idx) => (
                <div key={item.id + idx} className="flex gap-3 group">
                  {/* Timeline line */}
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${
                        item.type === "trip"
                          ? "bg-indigo-500"
                          : "bg-amber-500"
                      }`}
                    />
                    {idx < timeline.slice(0, 8).length - 1 && (
                      <div className="w-px flex-1 bg-slate-800 my-1" />
                    )}
                  </div>
                  {/* Content */}
                  <div className="pb-4 min-w-0">
                    <div className="text-xs font-semibold text-slate-200">{item.title}</div>
                    <div className="text-[10px] text-slate-400 truncate">{item.subtitle}</div>
                    <div className="flex items-center gap-2 mt-1">
                      {item.vehicle && (
                        <span className="text-[10px] text-slate-500">{item.vehicle}</span>
                      )}
                      <span className="text-[10px] text-slate-600">
                        {new Date(item.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 text-center py-4">No recent activity</p>
            )}
          </div>
        </div>

        {/* Recent Trips */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden opacity-0 animate-fade-in-up" style={{ animationDelay: "650ms", animationFillMode: "forwards" }}>
          <div className="px-6 py-5 border-b border-slate-800 flex justify-between items-center">
            <div className="flex items-center gap-2.5">
              <IoNavigateOutline className="text-indigo-400 text-lg" />
              <h3 className="text-sm font-bold text-slate-100">Recent Trips</h3>
            </div>
            <span className="text-[10px] text-slate-500 font-medium">Last 5</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/50 text-slate-400 font-semibold text-[10px] uppercase tracking-wider">
                  <th className="px-5 py-3">Vehicle</th>
                  <th className="px-5 py-3">Route</th>
                  <th className="px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {recentTrips.length > 0 ? (
                  recentTrips.map((trip) => (
                    <tr key={trip._id} className="hover:bg-slate-800/20 transition-colors">
                      <td className="px-5 py-3 whitespace-nowrap">
                        <div className="font-semibold text-slate-200 text-xs">
                          {trip.vehicle?.registrationNumber || "N/A"}
                        </div>
                      </td>
                      <td className="px-5 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-1 text-[11px]">
                          <span>{trip.source}</span>
                          <IoArrowForwardOutline className="text-slate-500 text-[9px]" />
                          <span>{trip.destination}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 whitespace-nowrap">
                        <StatusBadge status={trip.status} size="xs" />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="px-5 py-8 text-center text-slate-500 text-xs">
                      No recent trips
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Maintenance */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden opacity-0 animate-fade-in-up" style={{ animationDelay: "700ms", animationFillMode: "forwards" }}>
          <div className="px-6 py-5 border-b border-slate-800 flex justify-between items-center">
            <div className="flex items-center gap-2.5">
              <IoBuildOutline className="text-amber-400 text-lg" />
              <h3 className="text-sm font-bold text-slate-100">Recent Maintenance</h3>
            </div>
            <span className="text-[10px] text-slate-500 font-medium">Last 5</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/50 text-slate-400 font-semibold text-[10px] uppercase tracking-wider">
                  <th className="px-5 py-3">Vehicle</th>
                  <th className="px-5 py-3">Issue</th>
                  <th className="px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {recentMaintenance.length > 0 ? (
                  recentMaintenance.map((m) => (
                    <tr key={m._id} className="hover:bg-slate-800/20 transition-colors">
                      <td className="px-5 py-3 whitespace-nowrap">
                        <div className="font-semibold text-slate-200 text-xs">
                          {m.vehicle?.registrationNumber || "N/A"}
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <div className="text-slate-200 text-xs font-medium truncate max-w-[150px]">
                          {m.issue}
                        </div>
                      </td>
                      <td className="px-5 py-3 whitespace-nowrap">
                        <StatusBadge status={m.status} size="xs" />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="px-5 py-8 text-center text-slate-500 text-xs">
                      No recent maintenance
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
