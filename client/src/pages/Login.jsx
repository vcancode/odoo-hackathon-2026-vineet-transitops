import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { IoMailOutline, IoLockClosedOutline, IoNavigateOutline, IoPersonOutline } from "react-icons/io5";
import API from "../services/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      return toast.error("Please enter email and password");
    }

    setIsLoading(true);
    const loadingToast = toast.loading("Authenticating...");
    try {
      const response = await API.post("/auth/login", { email, password });
      toast.dismiss(loadingToast);

      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        toast.success(response.data.message || "Welcome to TransitOps!");
        navigate("/dashboard");
      } else {
        toast.error(response.data.message || "Login failed");
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      console.error(error);
      const errorMsg = error.response?.data?.message || "Invalid credentials or network error";
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const fillCredentials = (roleEmail, rolePassword) => {
    setEmail(roleEmail);
    setPassword(rolePassword);
  };

  const quickRoles = [
    {
      title: "Fleet Manager",
      email: "fleet@transitops.com",
      color: "border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10",
    },
    {
      title: "Dispatcher",
      email: "dispatcher@transitops.com",
      color: "border-blue-500/30 text-blue-400 hover:bg-blue-500/10",
    },
    {
      title: "Safety Officer",
      email: "safety@transitops.com",
      color: "border-amber-500/30 text-amber-400 hover:bg-amber-500/10",
    },
    {
      title: "Finance Officer",
      email: "finance@transitops.com",
      color: "border-purple-500/30 text-purple-400 hover:bg-purple-500/10",
    },
  ];

  return (
    <div className="relative min-h-screen bg-slate-950 flex flex-col justify-center items-center px-4 overflow-hidden">
      {/* Dynamic Background Blurs */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-indigo-600/15 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[300px] h-[300px] rounded-full bg-blue-600/10 blur-[100px] pointer-events-none" />

      {/* Main Glassmorphic Container */}
      <div className="w-full max-w-md bg-slate-900/60 border border-slate-800/80 rounded-2xl p-8 shadow-2xl backdrop-blur-md relative z-10">
        
        {/* Brand Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white flex items-center justify-center shadow-lg shadow-indigo-500/30 mb-3">
            <IoNavigateOutline className="text-3xl animate-bounce" />
          </div>
          <h2 className="text-2xl font-bold text-slate-100 tracking-wide text-center">
            Welcome to TransitOps
          </h2>
          <p className="text-sm text-slate-400 mt-1">Fleet Management & ERP System</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 pl-1">
              Email Address
            </label>
            <div className="relative">
              <IoMailOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
              <input
                type="email"
                placeholder="dispatcher@transitops.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 pl-1">
              Password
            </label>
            <div className="relative">
              <IoLockClosedOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
              <input
                type="password"
                placeholder="••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 disabled:bg-indigo-600/40 text-white font-medium rounded-xl text-sm transition-all shadow-lg shadow-indigo-600/20 hover:shadow-indigo-500/25 flex items-center justify-center gap-2 cursor-pointer"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Quick Credentials Seeding Section */}
        <div className="mt-8 border-t border-slate-800/80 pt-6">
          <div className="flex items-center gap-2 mb-4 justify-center">
            <IoPersonOutline className="text-slate-400 text-sm" />
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Quick Connect (Demo Accounts)
            </h4>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            {quickRoles.map((role) => (
              <button
                key={role.title}
                onClick={() => fillCredentials(role.email, "123456")}
                className={`py-2 px-3 border rounded-xl text-center text-xs font-medium transition-colors cursor-pointer ${role.color}`}
              >
                {role.title}
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;
