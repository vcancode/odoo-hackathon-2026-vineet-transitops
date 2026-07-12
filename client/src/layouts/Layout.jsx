import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  IoBarChartOutline,
  IoCarOutline,
  IoPeopleOutline,
  IoNavigateOutline,
  IoBuildOutline,
  IoLogOutOutline,
  IoMenuOutline,
  IoCloseOutline,
  IoPersonOutline,
} from "react-icons/io5";

const Layout = ({ children }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Retrieve user details from localStorage
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const navigation = [
    { name: "Dashboard", path: "/dashboard", icon: IoBarChartOutline },
    { name: "Vehicles", path: "/vehicles", icon: IoCarOutline },
    { name: "Drivers", path: "/drivers", icon: IoPeopleOutline },
    { name: "Trips", path: "/trips", icon: IoNavigateOutline },
    { name: "Maintenance", path: "/maintenance", icon: IoBuildOutline },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const roleDisplayNames = {
    FleetManager: "Fleet Manager",
    Dispatcher: "Dispatcher",
    SafetyOfficer: "Safety Officer",
    Finance: "Finance Officer",
  };

  const roleColors = {
    FleetManager: "bg-emerald-500/10 text-emerald-450 border-emerald-500/20",
    Dispatcher: "bg-blue-500/10 text-blue-450 border-blue-500/20",
    SafetyOfficer: "bg-amber-500/10 text-amber-450 border-amber-500/20",
    Finance: "bg-purple-500/10 text-purple-450 border-purple-500/20",
  };

  const getRoleBadgeClass = (role) => {
    return roleColors[role] || "bg-slate-500/10 text-slate-400 border-slate-500/20";
  };

  const getRoleDisplayName = (role) => {
    return roleDisplayNames[role] || role || "Dispatcher";
  };

  // Get user avatar initials
  const getInitials = (name = "D") => {
    return name.charAt(0).toUpperCase();
  };

  const renderSidebarContent = () => (
    <div className="flex flex-col h-full bg-slate-900 border-r border-slate-800 text-slate-350 select-none">
      {/* Brand Header */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-800">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white shadow-lg shadow-indigo-500/30">
          <IoNavigateOutline className="text-2xl animate-pulse" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-slate-100 tracking-wide">TransitOps</h1>
          <span className="text-xs text-indigo-400 font-semibold uppercase tracking-wider">Fleet ERP</span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1.5 px-4 py-6">
        {navigation.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              to={item.path}
              onClick={() => setIsMobileOpen(false)}
              className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 group relative ${
                isActive
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-605/25"
                  : "hover:bg-slate-800/60 hover:text-slate-100"
              }`}
            >
              {/* Left active line decoration */}
              {isActive && (
                <span className="absolute left-0 top-1/3 bottom-1/3 w-1 bg-white rounded-r" />
              )}
              <Icon
                className={`text-lg transition-transform duration-200 group-hover:scale-110 ${
                  isActive ? "text-white" : "text-slate-400 group-hover:text-slate-100"
                }`}
              />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Logout Footer */}
      <div className="p-4 border-t border-slate-800">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold text-rose-450 hover:bg-rose-500/10 hover:text-rose-300 transition-all duration-200 group cursor-pointer"
        >
          <IoLogOutOutline className="text-lg group-hover:translate-x-0.5 transition-transform" />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 h-screen sticky top-0">
        {renderSidebarContent()}
      </aside>

      {/* Mobile Drawer Sidebar */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity duration-300 animate-fade-in"
            onClick={() => setIsMobileOpen(false)}
          />
          <aside className="relative flex flex-col w-64 h-full animate-slide-in-left">
            <button
              onClick={() => setIsMobileOpen(false)}
              className="absolute top-4 right-[-48px] p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-350 hover:text-white"
            >
              <IoCloseOutline className="text-2xl" />
            </button>
            {renderSidebarContent()}
          </aside>
        </div>
      )}

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="h-16 border-b border-slate-800 bg-slate-900/60 backdrop-blur-md sticky top-0 z-30 px-4 lg:px-8 flex items-center justify-between">
          <button
            onClick={() => setIsMobileOpen(true)}
            className="lg:hidden p-2 -ml-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <IoMenuOutline className="text-2xl" />
          </button>

          <div className="flex items-center gap-3 ml-auto select-none">
            {/* User Profile Card */}
            <div className="flex items-center gap-3 bg-slate-950/40 border border-slate-800/80 pl-2 pr-4 py-1 rounded-full">
              <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
                {getInitials(user.name || "D")}
              </div>
              <div className="text-left hidden sm:block">
                <div className="text-xs font-bold text-slate-200 leading-3">
                  {user.name || "Dispatcher"}
                </div>
                <div className="text-[9px] text-slate-500 font-medium">
                  {user.email || "dispatcher@transitops.com"}
                </div>
              </div>
              <span
                className={`text-[9px] px-2 py-0.5 rounded-full font-bold border uppercase tracking-wider ${getRoleBadgeClass(
                  user.role
                )}`}
              >
                {getRoleDisplayName(user.role)}
              </span>
            </div>

            {/* Logout Shortcut */}
            <button
              onClick={handleLogout}
              title="Logout"
              className="p-2 rounded-full border border-slate-800 text-slate-400 hover:text-rose-450 hover:border-rose-500/20 hover:bg-rose-500/5 transition-all cursor-pointer hidden sm:flex"
            >
              <IoLogOutOutline className="text-lg" />
            </button>
          </div>
        </header>

        {/* Content Wrapper */}
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto space-y-6">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
