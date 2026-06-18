import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Activity, Users, TriangleAlert as AlertTriangle, Brain, Download, Calendar, Clock, RefreshCw, ChartBar as BarChart3, Zap, Shield, Database, Server } from "lucide-react";
import api from "../services/api";
import RiskChart from "../components/RiskChart";
import DiseaseChart from "../components/DiseaseChart";
import GenderChart from "../components/GenderChart";
import AgeGroupChart from "../components/AgeGroupChart";
import { cn } from "../lib/utils";

function AdminDashboard() {
  const [stats, setStats] = useState({});
  const [riskData, setRiskData] = useState([]);
  const [diseaseData, setDiseaseData] = useState([]);
  const [genderData, setGenderData] = useState([]);
  const [ageGroups, setAgeGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("month");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [statsRes, riskRes, diseaseRes, genderRes, ageRes] = await Promise.allSettled([
        api.get("/stats"),
        api.get("/risk-summary"),
        api.get("/disease-distribution"),
        api.get("/gender-distribution"),
        api.get("/age-groups")
      ]);

      if (statsRes.status === 'fulfilled') setStats(statsRes.value.data);
      if (riskRes.status === 'fulfilled') setRiskData(riskRes.value.data);
      if (diseaseRes.status === 'fulfilled') setDiseaseData(diseaseRes.value.data);
      if (genderRes.status === 'fulfilled') setGenderData(genderRes.value.data);
      if (ageRes.status === 'fulfilled') setAgeGroups(ageRes.value.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const summaryCards = [
    {
      label: "Total Patients",
      value: stats.total_patients || 0,
      change: "+12.4%",
      trend: "up",
      icon: Users,
      color: "cyan"
    },
    {
      label: "Risk Analysis",
      value: riskData.length || 0,
      change: "+8.2%",
      trend: "up",
      icon: AlertTriangle,
      color: "amber"
    },
    {
      label: "Conditions Tracked",
      value: diseaseData.length || 0,
      change: "+3.1%",
      trend: "up",
      icon: Activity,
      color: "emerald"
    },
    {
      label: "AI Accuracy",
      value: "94%",
      change: "+2.4%",
      trend: "up",
      icon: Brain,
      color: "rose"
    }
  ];

  const systemStatus = [
    { label: "Database", status: "Operational", icon: Database, active: true },
    { label: "AI Engine", status: "Active", icon: Server, active: true },
    { label: "Analytics", status: "Running", icon: BarChart3, active: true },
    { label: "Security", status: "Protected", icon: Shield, active: true }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      className="space-y-6 max-w-[1600px] mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white tracking-tight">
            Analytics Center
          </h1>
          <p className="text-slate-500 mt-1">
            Enterprise healthcare analytics and insights
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            {["week", "month", "year"].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors",
                  timeRange === range
                    ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                    : "bg-white/[0.02] text-slate-500 border border-white/[0.04] hover:bg-white/[0.04]"
                )}
              >
                {range}
              </button>
            ))}
          </div>
          <button
            onClick={fetchData}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.02] border border-white/[0.04] text-slate-400 hover:bg-white/[0.04] transition-colors"
          >
            <RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} />
            <span className="text-sm font-medium">Refresh</span>
          </button>
          <a
            href="http://127.0.0.1:8000/export-patients"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-600 text-white font-medium hover:from-cyan-600 hover:to-cyan-700 transition-all shadow-lg shadow-cyan-500/20"
          >
            <Download className="w-4 h-4" />
            <span>Export Report</span>
          </a>
        </div>
      </motion.div>

      {/* Summary Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {summaryCards.map((card) => {
          const Icon = card.icon;
          const colorStyles = {
            cyan: "from-cyan-500/20 to-cyan-500/5 border-cyan-500/20 text-cyan-400",
            amber: "from-amber-500/20 to-amber-500/5 border-amber-500/20 text-amber-400",
            emerald: "from-emerald-500/20 to-emerald-500/5 border-emerald-500/20 text-emerald-400",
            rose: "from-rose-500/20 to-rose-500/5 border-rose-500/20 text-rose-400"
          };

          return (
            <motion.div
              key={card.label}
              variants={itemVariants}
              whileHover={{ y: -4 }}
              className={cn(
                "relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br border backdrop-blur-xl cursor-pointer group"
              )}
              style={{ background: `linear-gradient(135deg, rgba(14, 165, 233, 0.1), transparent)` }}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/5 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative">
                <div className="flex items-start justify-between mb-4">
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center bg-white/10 backdrop-blur-sm"
                  )}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className={cn(
                    "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
                    card.trend === "up" ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
                  )}>
                    {card.trend === "up" ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    {card.change}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-slate-400 mb-1">{card.label}</p>
                  <p className="text-3xl font-bold text-white tracking-tight">
                    {typeof card.value === 'number' ? card.value.toLocaleString() : card.value}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Distribution */}
        <motion.div
          variants={itemVariants}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/[0.06] p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Risk Distribution</h3>
            </div>
            <div className="flex items-center gap-1 text-xs text-slate-500">
              <Clock className="w-3.5 h-3.5" />
              Updated now
            </div>
          </div>
          {isLoading ? (
            <div className="h-64 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
            </div>
          ) : (
            <RiskChart data={riskData} />
          )}
        </motion.div>

        {/* Disease Analytics */}
        <motion.div
          variants={itemVariants}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/[0.06] p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center">
                <Activity className="w-5 h-5 text-rose-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Disease Analytics</h3>
            </div>
          </div>
          {isLoading ? (
            <div className="h-64 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
            </div>
          ) : (
            <DiseaseChart data={diseaseData} />
          )}
        </motion.div>

        {/* Gender Demographics */}
        <motion.div
          variants={itemVariants}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/[0.06] p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-cyan-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Gender Demographics</h3>
            </div>
          </div>
          {isLoading ? (
            <div className="h-64 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
            </div>
          ) : (
            <GenderChart data={genderData} />
          )}
        </motion.div>

        {/* Age Group Analysis */}
        <motion.div
          variants={itemVariants}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/[0.06] p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Age Group Analysis</h3>
            </div>
          </div>
          {isLoading ? (
            <div className="h-64 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
            </div>
          ) : (
            <AgeGroupChart data={ageGroups} />
          )}
        </motion.div>
      </div>

      {/* AI Insights & System Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AI Insights */}
        <div className="lg:col-span-2 relative overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-500/10 via-transparent to-emerald-500/10 border border-white/[0.06] p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">AI Intelligence Insights</h3>
              <p className="text-sm text-slate-500">Real-time predictive analytics</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Prediction Model</p>
              <p className="text-lg font-semibold text-white">Active</p>
              <p className="text-xs text-slate-400 mt-1">Ensemble classifier</p>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Model Accuracy</p>
              <p className="text-lg font-semibold text-cyan-400">94.2%</p>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3 text-emerald-400" />
                <span className="text-xs text-emerald-400">+2.4% this month</span>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Risk Forecast</p>
              <p className="text-lg font-semibold text-white">32 Cases</p>
              <p className="text-xs text-slate-400 mt-1">Predicted next 30 days</p>
            </div>
          </div>
          <div className="mt-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Top Recommendations</p>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm text-slate-400">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                Monitor diabetic patients more frequently
              </li>
              <li className="flex items-center gap-2 text-sm text-slate-400">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                Schedule follow-up visits for high-risk cases
              </li>
              <li className="flex items-center gap-2 text-sm text-slate-400">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                Increase blood pressure monitoring
              </li>
            </ul>
          </div>
        </div>

        {/* System Status */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/[0.06] p-6">
          <h3 className="text-lg font-semibold text-white mb-6">System Status</h3>
          <div className="space-y-3">
            {systemStatus.map((system) => {
              const Icon = system.icon;
              return (
                <div
                  key={system.label}
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]"
                >
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center",
                    system.active ? "bg-emerald-500/10" : "bg-rose-500/10"
                  )}>
                    <Icon className={cn(
                      "w-5 h-5",
                      system.active ? "text-emerald-400" : "text-rose-400"
                    )} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">{system.label}</p>
                    <p className={cn(
                      "text-xs",
                      system.active ? "text-emerald-400" : "text-rose-400"
                    )}>
                      {system.status}
                    </p>
                  </div>
                  <div className={cn(
                    "w-2 h-2 rounded-full",
                    system.active ? "bg-emerald-400" : "bg-rose-400"
                  )} />
                </div>
              );
            })}
          </div>
          <div className="mt-4 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-400" />
              <span className="text-xs text-emerald-400 font-medium">All systems operational</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default AdminDashboard;
