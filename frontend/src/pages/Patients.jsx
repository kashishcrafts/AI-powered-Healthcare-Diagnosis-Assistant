import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Search, ListFilter as Filter, ChevronRight, TriangleAlert as AlertTriangle, Activity, Download, Plus, ListSortAscending as SortAsc, ListSortDescending as SortDesc, LayoutGrid, List, RefreshCw } from "lucide-react";
import api from "../services/api";
import { cn, getRiskColor } from "../lib/utils";

function Patients() {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState("table");
  const [sortField, setSortField] = useState("risk_score");
  const [sortDirection, setSortDirection] = useState("desc");
  const [riskFilter, setRiskFilter] = useState("all");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatients = async () => {
      setIsLoading(true);
      try {
        const response = await api.get("/patients");
        setPatients(response.data || []);
      } catch (error) {
        console.error("Error fetching patients:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const filteredPatients = patients
    .filter((patient) => {
      const matchesSearch =
        patient.name?.toLowerCase().includes(search.toLowerCase()) ||
        patient.disease?.toLowerCase().includes(search.toLowerCase()) ||
        patient.risk_level?.toLowerCase().includes(search.toLowerCase());

      const matchesFilter =
        riskFilter === "all" ||
        (riskFilter === "critical" && patient.risk_level === "Critical Risk") ||
        (riskFilter === "high" && patient.risk_level === "High Risk") ||
        (riskFilter === "medium" && patient.risk_level === "Medium Risk") ||
        (riskFilter === "low" && patient.risk_level === "Low Risk");

      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      const aVal = a[sortField] || 0;
      const bVal = b[sortField] || 0;
      return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
    });

  const riskFilters = [
    { id: "all", label: "All Patients", count: patients.length },
    { id: "critical", label: "Critical", count: patients.filter(p => p.risk_level === "Critical Risk").length },
    { id: "high", label: "High", count: patients.filter(p => p.risk_level === "High Risk").length },
    { id: "medium", label: "Medium", count: patients.filter(p => p.risk_level === "Medium Risk").length },
    { id: "low", label: "Low", count: patients.filter(p => p.risk_level === "Low Risk").length }
  ];

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.03 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      className="space-y-6 max-w-[1600px] mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white tracking-tight">
            Patient Management
          </h1>
          <p className="text-slate-500 mt-1">
            {patients.length} patients registered in the system
          </p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="http://127.0.0.1:8000/export-patients"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.02] border border-white/[0.04] text-slate-400 hover:bg-white/[0.04] transition-colors"
          >
            <Download className="w-4 h-4" />
            <span className="text-sm font-medium">Export</span>
          </a>
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500/20 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="text-sm font-medium">Refresh</span>
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-slate-500" />
          </div>
          <input
            type="text"
            placeholder="Search by name, disease, or risk level..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white/[0.02] border border-white/[0.04] rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/50 focus:bg-white/[0.04] transition-all duration-200"
          />
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode("table")}
            className={cn(
              "p-2.5 rounded-lg transition-colors",
              viewMode === "table"
                ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                : "text-slate-500 hover:text-slate-400 hover:bg-white/[0.02]"
            )}
          >
            <List className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode("grid")}
            className={cn(
              "p-2.5 rounded-lg transition-colors",
              viewMode === "grid"
                ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                : "text-slate-500 hover:text-slate-400 hover:bg-white/[0.02]"
            )}
          >
            <LayoutGrid className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Risk Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {riskFilters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setRiskFilter(filter.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all",
              riskFilter === filter.id
                ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                : "bg-white/[0.02] text-slate-500 border border-white/[0.04] hover:bg-white/[0.04]"
            )}
          >
            {filter.id === "critical" && <AlertTriangle className="w-3.5 h-3.5" />}
            {filter.id === "critical" && <span className="text-cyan-400">{filter.count}</span>}
            {filter.id !== "critical" && <span>{filter.label}</span>}
            <span className={cn(
              "px-2 py-0.5 rounded-full text-xs",
              filter.id === "critical" && riskFilter === filter.id
                ? "bg-rose-500/20 text-rose-400"
                : filter.id === "high" && riskFilter === filter.id
                ? "bg-amber-500/20 text-amber-400"
                : filter.id === "medium" && riskFilter === filter.id
                ? "bg-yellow-500/20 text-yellow-400"
                : filter.id === "low" && riskFilter === filter.id
                ? "bg-emerald-500/20 text-emerald-400"
                : "bg-white/5 text-slate-500"
            )}>
              {filter.count}
            </span>
          </button>
        ))}
      </div>

      {/* Patients Table/Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-2 border-cyan-500/20" />
              <div className="absolute inset-0 w-16 h-16 rounded-full border-2 border-transparent border-t-cyan-500 animate-spin" />
              <Users className="absolute inset-0 m-auto w-6 h-6 text-cyan-400" />
            </div>
            <p className="text-slate-500 text-sm">Loading patient data...</p>
          </div>
        </div>
      ) : filteredPatients.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-20"
        >
          <Users className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400 text-lg font-medium">No patients found</p>
          <p className="text-slate-500 text-sm mt-1">
            Try adjusting your search or filters
          </p>
        </motion.div>
      ) : viewMode === "table" ? (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/[0.06]"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.04]">
                  <th className="text-left py-4 px-6 text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Patient
                  </th>
                  <th className="text-left py-4 px-6 text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Demographics
                  </th>
                  <th
                    className="text-left py-4 px-6 text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:text-slate-400 transition-colors"
                    onClick={() => handleSort("disease")}
                  >
                    <div className="flex items-center gap-2">
                      Condition
                      {sortField === "disease" && (
                        sortDirection === "asc" ? <SortAsc className="w-3 h-3" /> : <SortDesc className="w-3 h-3" />
                      )}
                    </div>
                  </th>
                  <th
                    className="text-left py-4 px-6 text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:text-slate-400 transition-colors"
                    onClick={() => handleSort("risk_score")}
                  >
                    <div className="flex items-center gap-2">
                      Risk Score
                      {sortField === "risk_score" && (
                        sortDirection === "asc" ? <SortAsc className="w-3 h-3" /> : <SortDesc className="w-3 h-3" />
                      )}
                    </div>
                  </th>
                  <th className="text-left py-4 px-6 text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Risk Level
                  </th>
                  <th className="text-right py-4 px-6 text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filteredPatients.map((patient, index) => (
                    <motion.tr
                      key={patient.patient_id || index}
                      variants={itemVariants}
                      onClick={() => navigate(`/patient/${patient.patient_id}`)}
                      className="border-b border-white/[0.02] hover:bg-white/[0.02] cursor-pointer group transition-colors"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-cyan-500/10 flex items-center justify-center text-cyan-400 font-medium">
                            {patient.name?.charAt(0)?.toUpperCase() || "P"}
                          </div>
                          <div>
                            <p className="font-medium text-white group-hover:text-cyan-400 transition-colors">
                              {patient.name}
                            </p>
                            <p className="text-xs text-slate-500">ID: {patient.patient_id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div>
                          <p className="text-sm text-slate-300">{patient.age} years</p>
                          <p className="text-xs text-slate-500">{patient.gender}</p>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <p className="text-sm text-slate-300">{patient.disease}</p>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-white">
                            {patient.risk_score}
                          </span>
                          <span className="text-xs text-slate-500">/10</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={cn("badge", getRiskColor(patient.risk_level))}>
                          {patient.risk_level}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                          <ChevronRight className="w-5 h-5 text-slate-500" />
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </motion.div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
        >
          <AnimatePresence>
            {filteredPatients.map((patient, index) => (
              <motion.div
                key={patient.patient_id || index}
                variants={itemVariants}
                whileHover={{ y: -4 }}
                onClick={() => navigate(`/patient/${patient.patient_id}`)}
                className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/[0.06] p-5 cursor-pointer group transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-cyan-500/10 flex items-center justify-center text-cyan-400 font-medium text-lg">
                      {patient.name?.charAt(0)?.toUpperCase() || "P"}
                    </div>
                    <div>
                      <p className="font-medium text-white group-hover:text-cyan-400 transition-colors">
                        {patient.name}
                      </p>
                      <p className="text-xs text-slate-500">ID: {patient.patient_id}</p>
                    </div>
                  </div>
                  <span className={cn("badge", getRiskColor(patient.risk_level))}>
                    {patient.risk_level?.replace(" Risk", "")}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                    <span className="text-xs text-slate-500">Condition</span>
                    <span className="text-sm text-slate-300">{patient.disease}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="text-center p-2 rounded-lg bg-white/[0.02]">
                      <p className="text-xs text-slate-500">Age</p>
                      <p className="text-sm font-medium text-white mt-1">{patient.age}</p>
                    </div>
                    <div className="text-center p-2 rounded-lg bg-white/[0.02]">
                      <p className="text-xs text-slate-500">Gender</p>
                      <p className="text-sm font-medium text-white mt-1">{patient.gender}</p>
                    </div>
                    <div className="text-center p-2 rounded-lg bg-white/[0.02]">
                      <p className="text-xs text-slate-500">Risk</p>
                      <p className="text-lg font-bold text-cyan-400 mt-1">{patient.risk_score}</p>
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ChevronRight className="w-5 h-5 text-cyan-400" />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Results Summary */}
      {!isLoading && filteredPatients.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-sm text-slate-500"
        >
          Showing {filteredPatients.length} of {patients.length} patients
        </motion.div>
      )}
    </motion.div>
  );
}

export default Patients;
