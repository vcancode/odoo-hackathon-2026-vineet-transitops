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

  const roleColors = {
    FleetManager: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    Dispatcher: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    SafetyOfficer: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    Finance: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  };

  const getRoleBadgeClass = (role) => {
    return roleColors[role] || "bg-slate-500/10 text-slate-400 border-slate-500/20";
  };

  const renderSidebarContent = () => (
    <div className="flex flex-col h-full bg-slate-900 border-r border-slate-800 text-slate-300">
      {/* Brand Header */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-800">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white shadow-lg shadow-indigo-500/30">
          <IoNavigateOutline className="text-2xl animate-pulse" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-slate-100 tracking-wide">TransitOps</h1>
          <span className="text-xs text-indigo-400 font-medium">Fleet ERP</span>
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
              className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/25"
                  : "hover:bg-slate-800/60 hover:text-slate-100"
              }`}
            >
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
          className="flex w-full items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-200 group"
        >
          <IoLogOutOutline className="text-lg group-hover:translate-x-0.5 transition-transform" />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 h-screen sticky top-0">
        {renderSidebarContent()}
      </aside>

      {/* Mobile Drawer Sidebar */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileOpen(false)}
          />
          <aside className="relative flex flex-col w-64 h-full animate-in slide-in-from-left duration-250">
            <button
              onClick={() => setIsMobileOpen(false)}
              className="absolute top-4 right-[-48px] p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-300 hover:text-white"
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

          <div className="flex items-center gap-3 ml-auto">
            {/* User Profile Card */}
            <div className="flex items-center gap-3 bg-slate-950/40 border border-slate-800/80 pl-3 pr-4 py-1.5 rounded-full">
              <div className="h-7 w-7 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <IoPersonOutline className="text-sm" />
              </div>
              <div className="text-left">
                <div className="text-xs font-semibold text-slate-200 leading-3">
                  {user.name || "Dispatcher"}
                </div>
                <div className="text-[10px] text-slate-400 font-medium">
                  {user.email || "dispatcher@transitops.com"}
                </div>
              </div>
              <span
                className={`ml-2 text-[10px] px-2 py-0.5 rounded-full font-semibold border ${getRoleBadgeClass(
                  user.role
                )}`}
              >
                {user.role || "Dispatcher"}
              </span>
            </div>

            {/* Logout Shortcut */}
            <button
              onClick={handleLogout}
              title="Logout"
              className="p-2 rounded-full border border-slate-800 text-slate-400 hover:text-red-400 hover:border-red-500/20 hover:bg-red-500/5 transition-all hidden sm:flex"
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
