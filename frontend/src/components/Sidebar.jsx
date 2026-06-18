import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Brain,
  Calendar,
  ChartBar,
  Shield,
  LogOut,
  ChevronLeft,
  ChevronRight,
  HeartPulse,
  FileText,
  Settings,
  Bell,
  Activity,
  Search
} from "lucide-react";
import { cn } from "../lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { path: "/", label: "Dashboard", icon: LayoutDashboard, roles: ["admin", "doctor"], description: "Overview & Analytics" },
  { path: "/patients", label: "Patients", icon: Users, roles: ["admin", "doctor"], description: "Patient Management" },
  { path: "/ai-chat", label: "AI Assistant", icon: Brain, roles: ["admin", "doctor"], description: "AI Diagnosis Support" },
  { path: "/analytics", label: "Analytics", icon: ChartBar, roles: ["admin"], description: "Advanced Analytics" },
  { path: "/appointments", label: "Appointments", icon: Calendar, roles: ["doctor"], description: "Schedule Management" },
];

export default function Sidebar({ onLogout }) {
  const location = useLocation();
  const [role, setRole] = useState("doctor");
  const [collapsed, setCollapsed] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const storedRole = localStorage.getItem("role") || "doctor";
    setRole(storedRole);

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const filteredNav = navItems.filter((item) => item.roles.includes(role));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "/login";
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 80 : 280 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="fixed left-0 top-0 z-40 h-screen flex flex-col border-r border-white/[0.04] bg-[#080d16]"
      style={{
        backdropFilter: "blur(40px)",
        background: "linear-gradient(180deg, #080d16 0%, #0a1019 50%, #0d1420 100%)"
      }}
    >
      {/* Logo Section */}
      <div className="relative px-4 py-5 border-b border-white/[0.04]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <motion.div
              className="flex items-center justify-center w-10 h-10 rounded-xl shrink-0 relative overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #0ea5e9 0%, #06b6d4 50%, #10b981 100%)",
                boxShadow: "0 4px 20px rgba(14, 165, 233, 0.3)"
              }}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <HeartPulse className="w-5 h-5 text-white" />
              <div className="absolute inset-0 bg-white/20 opacity-0 hover:opacity-100 transition-opacity" />
            </motion.div>
            <AnimatePresence>
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <h1 className="text-lg font-bold text-white whitespace-nowrap tracking-tight">
                    HealthAI
                  </h1>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider font-medium whitespace-nowrap">
                    Intelligence Platform
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <motion.button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg hover:bg-white/5 text-slate-500 hover:text-slate-400 transition-all duration-200"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </motion.button>
        </div>

        {/* Status Indicator */}
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="mt-4 flex items-center gap-2"
            >
              <div className="relative">
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                <div className="absolute inset-0 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              </div>
              <span className="text-xs text-slate-500">All systems operational</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/5 scrollbar-track-transparent">
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mb-3 px-3"
            >
              <p className="text-[10px] text-slate-600 uppercase tracking-wider font-semibold">
                Navigation
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {filteredNav.map((item, index) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <motion.div
              key={item.path}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative",
                    isActive
                      ? "bg-gradient-to-r from-cyan-500/10 to-transparent text-cyan-400"
                      : "text-slate-500 hover:text-slate-300 hover:bg-white/[0.02]"
                  )
                }
              >
                {isActive && (
                  <motion.div
                    layoutId="active-indicator"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-r-full"
                    style={{
                      background: "linear-gradient(180deg, #0ea5e9, #06b6d4)",
                      boxShadow: "0 0 12px rgba(14, 165, 233, 0.5)"
                    }}
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <div className={cn(
                  "flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-200",
                  isActive
                    ? "bg-cyan-500/10 text-cyan-400"
                    : "text-slate-500 group-hover:text-slate-400 group-hover:bg-white/[0.03]"
                )}>
                  <Icon className="w-[18px] h-[18px]" />
                </div>
                <AnimatePresence>
                  {!collapsed && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                      className="flex-1 min-w-0"
                    >
                      <span className={cn(
                        "text-sm font-medium whitespace-nowrap block",
                        isActive ? "text-white" : "text-slate-400"
                      )}>
                        {item.label}
                      </span>
                      <span className="text-[10px] text-slate-600 whitespace-nowrap block">
                        {item.description}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </NavLink>
            </motion.div>
          );
        })}

        {/* Role Badge */}
        <div className="mt-6 px-3 pt-4 border-t border-white/[0.04]">
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="mb-3"
              >
                <p className="text-[10px] text-slate-600 uppercase tracking-wider font-semibold">
                  Current Role
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl",
              "bg-gradient-to-r from-white/[0.02] to-transparent border border-white/[0.04]"
            )}
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-cyan-500/10">
              {role === "admin" ? (
                <Shield className="w-4 h-4 text-cyan-400" />
              ) : (
                <Activity className="w-4 h-4 text-cyan-400" />
              )}
            </div>
            <AnimatePresence>
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <span className="text-sm font-medium text-slate-300 capitalize">{role}</span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span className="text-[10px] text-slate-500">Active Session</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Time Display */}
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-4 px-3"
            >
              <div className="px-3 py-2 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                <p className="text-[10px] text-slate-600 uppercase tracking-wider font-medium mb-1">
                  Current Time
                </p>
                <p className="text-sm font-mono text-slate-400">
                  {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-white/[0.04]">
        <motion.button
          onClick={handleLogout}
          className={cn(
            "flex items-center gap-3 w-full px-3 py-2.5 rounded-xl",
            "text-slate-500 hover:text-rose-400 hover:bg-rose-500/5 transition-all duration-200"
          )}
          whileHover={{ x: 2 }}
        >
          <div className="flex items-center justify-center w-9 h-9 rounded-lg group-hover:bg-rose-500/10">
            <LogOut className="w-[18px] h-[18px]" />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="text-sm font-medium whitespace-nowrap"
              >
                Sign Out
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </motion.aside>
  );
}
