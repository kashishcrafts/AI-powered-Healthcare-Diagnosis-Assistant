import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Users, TriangleAlert as AlertTriangle, Activity, TrendingUp, TrendingDown, Brain, Calendar, Clock, ChevronRight, Download, FileText, Shield, Zap, HeartPulse, ChartBar as BarChart3, ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import api from "../services/api";
import RiskChart from "../components/RiskChart";
import DiseaseChart from "../components/DiseaseChart";
import GenderChart from "../components/GenderChart";
import AgeGroupChart from "../components/AgeGroupChart";
import { cn } from "../lib/utils";

function Dashboard() {
  const [riskData, setRiskData] = useState([]);
  const [diseaseData, setDiseaseData] = useState([]);
  const [genderData, setGenderData] = useState([]);
  const [ageGroups, setAgeGroups] = useState([]);
  const [stats, setStats] = useState({ total_patients: 0 });
  const [highRisk, setHighRisk] = useState({ high_risk_patients: 0 });
  const [diseaseCount, setDiseaseCount] = useState({ total_diseases: 0 });
  const [topPatients, setTopPatients] = useState([]);
  const [criticalPatients, setCriticalPatients] = useState([]);
  const [notifications, setNotifications] = useState({ critical: 0, high: 0 });
  const [criticalDetails, setCriticalDetails] = useState([]);
  const [summary, setSummary] = useState({});
  const [aiInsights, setAiInsights] = useState({});
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();
  const role = localStorage.getItem("role") || "doctor";

  useEffect(() => {
    const fetchAllData = async () => {
      setIsLoading(true);
      try {
        const [
          riskRes,
          diseaseRes,
          genderRes,
          ageRes,
          statsRes,
          highRiskRes,
          diseaseCountRes,
          topPatientsRes,
          criticalPatientsRes,
          notificationsRes,
          criticalDetailsRes,
          summaryRes,
          aiInsightsRes
        ] = await Promise.allSettled([
          api.get("/risk-summary"),
          api.get("/disease-distribution"),
          api.get("/gender-distribution"),
          api.get("/age-groups"),
          api.get("/stats"),
          api.get("/high-risk-count"),
          api.get("/disease-count"),
          api.get("/top-risk-patients"),
          api.get("/critical-patients"),
          api.get("/notifications"),
          api.get("/critical-patient-details"),
          api.get("/dashboard-summary"),
          api.get("/ai-insights")
        ]);

        if (riskRes.status === 'fulfilled') setRiskData(riskRes.value.data);
        if (diseaseRes.status === 'fulfilled') setDiseaseData(diseaseRes.value.data);
        if (genderRes.status === 'fulfilled') setGenderData(genderRes.value.data);
        if (ageRes.status === 'fulfilled') setAgeGroups(ageRes.value.data);
        if (statsRes.status === 'fulfilled') setStats(statsRes.value.data);
        if (highRiskRes.status === 'fulfilled') setHighRisk(highRiskRes.value.data);
        if (diseaseCountRes.status === 'fulfilled') setDiseaseCount(diseaseCountRes.value.data);
        if (topPatientsRes.status === 'fulfilled') setTopPatients(topPatientsRes.value.data);
        if (criticalPatientsRes.status === 'fulfilled') setCriticalPatients(criticalPatientsRes.value.data);
        if (notificationsRes.status === 'fulfilled') setNotifications(notificationsRes.value.data);
        if (criticalDetailsRes.status === 'fulfilled') setCriticalDetails(criticalDetailsRes.value.data);
        if (summaryRes.status === 'fulfilled') setSummary(summaryRes.value.data);
        if (aiInsightsRes.status === 'fulfilled') setAiInsights(aiInsightsRes.value.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();

    const interval = setInterval(() => {
      api.get("/notifications").then(res => setNotifications(res.data)).catch(() => {});
    }, 30000);

    const clock = setInterval(() => setCurrentTime(new Date()), 1000);

    return () => {
      clearInterval(interval);
      clearInterval(clock);
    };
  }, []);

  const kpiCards = [
    {
      title: "Total Patients",
      value: stats.total_patients || 0,
      change: "+12.4%",
      trend: "up",
      icon: Users,
      color: "cyan",
      href: "/patients"
    },
    {
      title: "High Risk Cases",
      value: highRisk.high_risk_patients || 0,
      change: "+8.2%",
      trend: "up",
      icon: AlertTriangle,
      color: "amber",
      href: "/patients"
    },
    {
      title: "Critical Alerts",
      value: notifications.critical || 0,
      change: "-2.1%",
      trend: "down",
      icon: Activity,
      color: "rose",
      href: "/patients"
    },
    {
      title: "AI Diagnoses",
      value: diseaseCount.total_diseases || 0,
      change: "+24.6%",
      trend: "up",
      icon: Brain,
      color: "emerald",
      href: "/ai-chat"
    }
  ];

  const systemMetrics = [
    { label: "Database", status: "Operational", active: true },
    { label: "AI Engine", status: "Active", active: true },
    { label: "Analytics", status: "Running", active: true },
    { label: "API Gateway", status: "Healthy", active: true }
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full border-2 border-cyan-500/20" />
            <div className="absolute inset-0 w-16 h-16 rounded-full border-2 border-transparent border-t-cyan-500 animate-spin" />
            <HeartPulse className="absolute inset-0 m-auto w-6 h-6 text-cyan-400" />
          </div>
          <p className="text-slate-500 text-sm">Initializing Dashboard...</p>
        </div>
      </div>
    );
  }

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
            {role === "admin" ? "Executive Dashboard" : "Clinical Dashboard"}
          </h1>
          <p className="text-slate-500 mt-1">
            Welcome back, {role === "admin" ? "Administrator" : "Doctor"}. Here's your healthcare intelligence overview.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <div className="relative">
              <div className="w-2 h-2 rounded-full bg-emerald-400" />
              <div className="absolute inset-0 w-2 h-2 rounded-full bg-emerald-400 animate-ping opacity-75" />
            </div>
            <span className="text-emerald-400 text-sm font-medium">All Systems Operational</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.02] border border-white/[0.04]">
            <Clock className="w-4 h-4 text-slate-500" />
            <span className="text-slate-400 text-sm font-mono">
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Search Bar */}
      <motion.div variants={itemVariants}>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search patients, diseases, or metrics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white/[0.02] border border-white/[0.04] rounded-xl text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/50 focus:bg-white/[0.04] transition-all duration-200"
          />
        </div>
      </motion.div>

      {/* KPI Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {kpiCards.map((card, index) => {
          const Icon = card.icon;
          const colorStyles = {
            cyan: "from-cyan-500/20 to-cyan-500/5 border-cyan-500/20 text-cyan-400",
            amber: "from-amber-500/20 to-amber-500/5 border-amber-500/20 text-amber-400",
            rose: "from-rose-500/20 to-rose-500/5 border-rose-500/20 text-rose-400",
            emerald: "from-emerald-500/20 to-emerald-500/5 border-emerald-500/20 text-emerald-400"
          };

          return (
            <motion.div
              key={card.title}
              variants={itemVariants}
              whileHover={{ y: -4 }}
              onClick={() => card.href && navigate(card.href)}
              className={cn(
                "relative overflow-hidden rounded-2xl p-6 cursor-pointer group",
                "bg-gradient-to-br",
                colorStyles[card.color],
                "border backdrop-blur-xl"
              )}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/5 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative">
                <div className="flex items-start justify-between mb-4">
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center",
                    "bg-white/10 backdrop-blur-sm"
                  )}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className={cn(
                    "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
                    card.trend === "up" ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
                  )}>
                    {card.trend === "up" ? (
                      <ArrowUpRight className="w-3 h-3" />
                    ) : (
                      <ArrowDownRight className="w-3 h-3" />
                    )}
                    {card.change}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-slate-400 mb-1">{card.title}</p>
                  <p className="text-3xl font-bold text-white tracking-tight">
                    {typeof card.value === 'number' ? card.value.toLocaleString() : card.value}
                  </p>
                </div>
                <div className="absolute bottom-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ChevronRight className="w-5 h-5 text-slate-500" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Charts Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[
          { title: "Risk Distribution", chart: <RiskChart data={riskData} />, icon: BarChart3 },
          { title: "Disease Analytics", chart: <DiseaseChart data={diseaseData} />, icon: Activity },
          { title: "Gender Demographics", chart: <GenderChart data={genderData} />, icon: Users },
          { title: "Age Group Analysis", chart: <AgeGroupChart data={ageGroups} />, icon: TrendingUp }
        ].map((item, index) => (
          <motion.div
            key={item.title}
            variants={itemVariants}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/[0.06] p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                <item.icon className="w-5 h-5 text-cyan-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">{item.title}</h3>
            </div>
            {item.chart}
          </motion.div>
        ))}
      </motion.div>

      {/* AI Insights Panel */}
      <motion.div variants={itemVariants} className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-500/10 via-transparent to-emerald-500/10 border border-white/[0.06] p-6">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        <div className="relative">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">AI Intelligence Center</h3>
              <p className="text-sm text-slate-500">Real-time predictive analytics</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Prediction Model</p>
              <p className="text-lg font-semibold text-white">{aiInsights.prediction || "Analyzing..."}</p>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Confidence Score</p>
              <div className="flex items-center gap-2">
                <p className="text-lg font-semibold text-cyan-400">{aiInsights.confidence || "94"}%</p>
                <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-full"
                    style={{ width: `${aiInsights.confidence || 94}%` }}
                  />
                </div>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Risk Forecast</p>
              <p className="text-lg font-semibold text-white">{aiInsights.risk_forecast || "32 Predictions"}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Critical Alerts & Top Patients */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Critical Alerts */}
        <motion.div variants={itemVariants} className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-rose-500/10 to-rose-500/5 border border-rose-500/20 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-rose-400" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-rose-500 animate-pulse" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Critical Alerts</h3>
                <p className="text-xs text-slate-500">Immediate attention required</p>
              </div>
            </div>
            <button
              onClick={() => navigate("/patients")}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 transition-colors"
            >
              View All
            </button>
          </div>
          <div className="space-y-3">
            {criticalDetails.length > 0 ? criticalDetails.slice(0, 5).map((patient, index) => (
              <motion.div
                key={patient.patient_id || index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => navigate(`/patient/${patient.patient_id}`)}
                className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04] cursor-pointer transition-all group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-white group-hover:text-cyan-400 transition-colors">{patient.name}</p>
                    <p className="text-xs text-slate-500">{patient.disease}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "px-2 py-1 rounded-full text-xs font-medium",
                      "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                    )}>
                      Score: {patient.Risk_Score || patient.risk_score}
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              </motion.div>
            )) : (
              <div className="text-center py-8 text-slate-500">
                <CheckCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No critical patients at the moment</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Top Risk Patients */}
        <motion.div variants={itemVariants} className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500/10 to-amber-500/5 border border-amber-500/20 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">High Risk Patients</h3>
                <p className="text-xs text-slate-500">Monitoring priority list</p>
              </div>
            </div>
            <button
              onClick={() => navigate("/patients")}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 transition-colors"
            >
              View All
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.04]">
                  <th className="text-left py-3 px-2 text-xs font-medium text-slate-500 uppercase tracking-wider">Patient</th>
                  <th className="text-left py-3 px-2 text-xs font-medium text-slate-500 uppercase tracking-wider">Condition</th>
                  <th className="text-right py-3 px-2 text-xs font-medium text-slate-500 uppercase tracking-wider">Risk</th>
                </tr>
              </thead>
              <tbody>
                {topPatients.map((patient, index) => (
                  <motion.tr
                    key={patient.patient_id || index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => navigate(`/patient/${patient.patient_id}`)}
                    className="border-b border-white/[0.02] hover:bg-white/[0.02] cursor-pointer group"
                  >
                    <td className="py-3 px-2">
                      <p className="font-medium text-white group-hover:text-cyan-400 transition-colors">{patient.name}</p>
                    </td>
                    <td className="py-3 px-2">
                      <p className="text-slate-400 text-sm">{patient.disease}</p>
                    </td>
                    <td className="py-3 px-2 text-right">
                      <span className={cn(
                        "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
                        "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                      )}>
                        {patient.risk_score}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>

      {/* System Status */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/[0.06] p-6">
          <h3 className="text-lg font-semibold text-white mb-6">System Health</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {systemMetrics.map((metric, index) => (
              <div key={index} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <div className="flex items-center gap-2 mb-2">
                  <div className={cn(
                    "w-2 h-2 rounded-full",
                    metric.active ? "bg-emerald-400" : "bg-rose-400"
                  )} />
                  <span className="text-xs text-slate-500 uppercase tracking-wider">{metric.label}</span>
                </div>
                <p className={cn(
                  "text-sm font-medium",
                  metric.active ? "text-emerald-400" : "text-rose-400"
                )}>
                  {metric.status}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/[0.06] p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <button
              onClick={() => navigate("/patients")}
              className="w-full flex items-center gap-3 p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/20 transition-colors"
            >
              <Users className="w-4 h-4" />
              <span className="text-sm font-medium">View Patients</span>
              <ChevronRight className="w-4 h-4 ml-auto" />
            </button>
            <button
              onClick={() => navigate("/ai-chat")}
              className="w-full flex items-center gap-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 transition-colors"
            >
              <Brain className="w-4 h-4" />
              <span className="text-sm font-medium">AI Assistant</span>
              <ChevronRight className="w-4 h-4 ml-auto" />
            </button>
            <a
              href="http://127.0.0.1:8000/export-patients"
              target="_blank"
              rel="noreferrer"
              className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] text-slate-400 hover:bg-white/[0.04] transition-colors"
            >
              <Download className="w-4 h-4" />
              <span className="text-sm font-medium">Export Data</span>
              <ChevronRight className="w-4 h-4 ml-auto" />
            </a>
          </div>
        </div>
      </motion.div>

      {/* Footer */}
      <motion.div variants={itemVariants} className="pt-6 border-t border-white/[0.04]">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div>
            <p className="text-sm text-slate-500">
              HealthAI Intelligence Platform v2.0 Enterprise
            </p>
            <p className="text-xs text-slate-600 mt-1">
              Built with React, Python ML, & Real-time Analytics
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <Shield className="w-3 h-3" />
            <span>HIPAA Compliant</span>
            <span className="mx-2">|</span>
            <Zap className="w-3 h-3" />
            <span>99.9% Uptime</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default Dashboard;
