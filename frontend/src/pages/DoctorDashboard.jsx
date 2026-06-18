import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, User, Plus, Search, ChevronRight, Video, MapPin, Phone, CircleCheck as CheckCircle, Circle as XCircle, CircleAlert as AlertCircle, ListFilter as Filter, RefreshCw } from "lucide-react";
import api from "../services/api";
import { cn } from "../lib/utils";

function DoctorDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showScheduler, setShowScheduler] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const [newAppointment, setNewAppointment] = useState({
    doctor: "",
    date: "",
    time: "",
    type: "in-person"
  });

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    setIsLoading(true);
    try {
      const res = await api.get("/appointments/1");
      setAppointments(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      setAppointments([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddAppointment = () => {
    if (!newAppointment.doctor || !newAppointment.date || !newAppointment.time) return;

    const appointment = {
      id: Date.now(),
      ...newAppointment,
      status: "scheduled"
    };

    setAppointments([...appointments, appointment]);
    setNewAppointment({ doctor: "", date: "", time: "", type: "in-person" });
    setShowScheduler(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "scheduled":
        return "bg-cyan-500/10 text-cyan-400 border-cyan-500/20";
      case "cancelled":
        return "bg-rose-500/10 text-rose-400 border-rose-500/20";
      default:
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "video":
        return Video;
      case "phone":
        return Phone;
      default:
        return MapPin;
    }
  };

  const filteredAppointments = appointments.filter((apt) => {
    const matchesSearch =
      apt.doctor?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.patient?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter = filterStatus === "all" || apt.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  const stats = [
    {
      label: "Today",
      value: appointments.filter((a) => a.date === new Date().toISOString().split("T")[0]).length,
      icon: Calendar,
      color: "cyan"
    },
    {
      label: "This Week",
      value: appointments.length,
      icon: Clock,
      color: "emerald"
    },
    {
      label: "Pending",
      value: appointments.filter((a) => a.status === "scheduled").length,
      icon: AlertCircle,
      color: "amber"
    }
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
            Appointment Management
          </h1>
          <p className="text-slate-500 mt-1">
            Schedule and manage patient appointments
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchAppointments()}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.02] border border-white/[0.04] text-slate-400 hover:bg-white/[0.04] transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="text-sm font-medium">Refresh</span>
          </button>
          <motion.button
            onClick={() => setShowScheduler(!showScheduler)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-600 text-white font-medium hover:from-cyan-600 hover:to-cyan-700 transition-all shadow-lg shadow-cyan-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>New Appointment</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const colorStyles = {
            cyan: "from-cyan-500/20 to-cyan-500/5 border-cyan-500/20 text-cyan-400",
            emerald: "from-emerald-500/20 to-emerald-500/5 border-emerald-500/20 text-emerald-400",
            amber: "from-amber-500/20 to-amber-500/5 border-amber-500/20 text-amber-400"
          };

          return (
            <div
              key={stat.label}
              className={cn(
                "relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br border backdrop-blur-xl",
                colorStyles[stat.color]
              )}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">{stat.label}</p>
                  <p className="text-3xl font-bold text-white mt-1">{stat.value}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          );
        })}
      </motion.div>

      {/* Search and Filters */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-slate-500" />
          </div>
          <input
            type="text"
            placeholder="Search appointments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white/[0.02] border border-white/[0.04] rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/50 focus:bg-white/[0.04] transition-all duration-200"
          />
        </div>
        <div className="flex items-center gap-2">
          {["all", "scheduled", "completed", "cancelled"].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors",
                filterStatus === status
                  ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                  : "bg-white/[0.02] text-slate-500 border border-white/[0.04] hover:bg-white/[0.04]"
              )}
            >
              {status}
            </button>
          ))}
        </div>
      </motion.div>

      {/* New Appointment Form */}
      {showScheduler && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-500/10 to-transparent border border-cyan-500/20 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Schedule New Appointment</h3>
                <p className="text-xs text-slate-500">Create a new patient appointment</p>
              </div>
            </div>
            <button
              onClick={() => setShowScheduler(false)}
              className="p-2 rounded-lg hover:bg-white/5 text-slate-500 transition-colors"
            >
              <XCircle className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-xs text-slate-500 uppercase tracking-wider">Doctor</label>
              <input
                type="text"
                value={newAppointment.doctor}
                onChange={(e) => setNewAppointment({ ...newAppointment, doctor: e.target.value })}
                placeholder="Dr. Smith"
                className="w-full mt-2 px-4 py-3 bg-white/[0.02] border border-white/[0.04] rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/50 transition-colors"
              />
            </div>
            <div>
              <label className="text-xs text-slate-500 uppercase tracking-wider">Date</label>
              <input
                type="date"
                value={newAppointment.date}
                onChange={(e) => setNewAppointment({ ...newAppointment, date: e.target.value })}
                className="w-full mt-2 px-4 py-3 bg-white/[0.02] border border-white/[0.04] rounded-xl text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
              />
            </div>
            <div>
              <label className="text-xs text-slate-500 uppercase tracking-wider">Time</label>
              <input
                type="time"
                value={newAppointment.time}
                onChange={(e) => setNewAppointment({ ...newAppointment, time: e.target.value })}
                className="w-full mt-2 px-4 py-3 bg-white/[0.02] border border-white/[0.04] rounded-xl text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
              />
            </div>
            <div>
              <label className="text-xs text-slate-500 uppercase tracking-wider">Type</label>
              <select
                value={newAppointment.type}
                onChange={(e) => setNewAppointment({ ...newAppointment, type: e.target.value })}
                className="w-full mt-2 px-4 py-3 bg-white/[0.02] border border-white/[0.04] rounded-xl text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
              >
                <option value="in-person">In-Person</option>
                <option value="video">Video Call</option>
                <option value="phone">Phone Call</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <motion.button
              onClick={handleAddAppointment}
              disabled={!newAppointment.doctor || !newAppointment.date || !newAppointment.time}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-colors",
                newAppointment.doctor && newAppointment.date && newAppointment.time
                  ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500/20"
                  : "bg-white/[0.02] text-slate-500 border border-white/[0.04]"
              )}
            >
              <CheckCircle className="w-4 h-4" />
              <span>Schedule Appointment</span>
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Appointments List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-2 border-cyan-500/20" />
              <div className="absolute inset-0 w-16 h-16 rounded-full border-2 border-transparent border-t-cyan-500 animate-spin" />
              <Calendar className="absolute inset-0 m-auto w-6 h-6 text-cyan-400" />
            </div>
            <p className="text-slate-500 text-sm">Loading appointments...</p>
          </div>
        </div>
      ) : filteredAppointments.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-20"
        >
          <Calendar className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400 text-lg font-medium">No appointments found</p>
          <p className="text-slate-500 text-sm mt-1">
            {searchQuery || filterStatus !== "all"
              ? "Try adjusting your search or filters"
              : "Click 'New Appointment' to schedule one"}
          </p>
        </motion.div>
      ) : (
        <motion.div variants={containerVariants} className="space-y-3">
          {filteredAppointments.map((appointment, index) => {
            const TypeIcon = getTypeIcon(appointment.type);
            return (
              <motion.div
                key={appointment.id || index}
                variants={itemVariants}
                whileHover={{ scale: 1.01 }}
                className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/[0.06] p-5 hover:border-white/[0.1] transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                    <TypeIcon className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <p className="font-medium text-white truncate">{appointment.doctor || appointment.doctor_name}</p>
                      <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium capitalize border", getStatusColor(appointment.status || "scheduled"))}>
                        {appointment.status || "scheduled"}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-500">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        {appointment.date || appointment.appointment_date}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        {appointment.time || appointment.appointment_time}
                      </span>
                    </div>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <ChevronRight className="w-5 h-5 text-slate-500" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* Results Summary */}
      {!isLoading && filteredAppointments.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-sm text-slate-500"
        >
          Showing {filteredAppointments.length} of {appointments.length} appointments
        </motion.div>
      )}
    </motion.div>
  );
}

export default DoctorDashboard;
