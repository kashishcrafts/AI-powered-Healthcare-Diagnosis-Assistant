import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { User, Activity, TriangleAlert as AlertTriangle, Calendar, Clock, FileText, Brain, ChevronRight, Download, Plus, Send, TrendingUp, TrendingDown, Minus, HeartPulse, Stethoscope, ClipboardList, History, CircleAlert as AlertCircle, CircleCheck as CheckCircle, Loader as Loader2 } from "lucide-react";
import api from "../services/api";
import RiskTrendChart from "../components/RiskTrendChart";
import { cn, getRiskColor, getRiskScoreColor, getRiskProgressColor } from "../lib/utils";

function PatientDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [patient, setPatient] = useState(null);
  const [aiDiagnosis, setAiDiagnosis] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [doctorName, setDoctorName] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [timeline, setTimeline] = useState([]);
  const [loadingDiagnosis, setLoadingDiagnosis] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const fetchPatientData = async () => {
      setIsLoading(true);
      try {
        const [patientRes, notesRes, appointmentsRes, timelineRes] = await Promise.all([
          api.get(`/patient-full/${id}`).catch(() => null),
          api.get(`/notes/${id}`).catch(() => ({ data: [] })),
          api.get(`/appointments/${id}`).catch(() => ({ data: [] })),
          api.get(`/timeline/${id}`).catch(() => ({ data: [] }))
        ]);

        if (patientRes?.data?.[0]) {
          setPatient(patientRes.data[0]);
        }
        setNotes(Array.isArray(notesRes?.data) ? notesRes.data : []);
        setAppointments(Array.isArray(appointmentsRes?.data) ? appointmentsRes.data : []);
        setTimeline(Array.isArray(timelineRes?.data) ? timelineRes.data : []);
      } catch (error) {
        console.error("Error fetching patient data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatientData();
  }, [id]);

  const addTimeline = async (eventType, description) => {
    try {
      await api.post(`/timeline/${id}`, { event_type: eventType, description });
      const res = await api.get(`/timeline/${id}`);
      setTimeline(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const generateDiagnosis = async () => {
    try {
      setLoadingDiagnosis(true);
      const response = await api.get(`/ai-diagnosis/${id}`);
      setAiDiagnosis(response.data);
      const rec = await api.get(`/recommendations/${id}`);
      setRecommendations(rec.data?.recommendations || []);
      await addTimeline("AI Diagnosis", "AI diagnosis generated");
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingDiagnosis(false);
    }
  };

  const saveNote = async () => {
    if (!newNote.trim()) return;
    try {
      await api.post(`/notes/${id}`, { note: newNote });
      const res = await api.get(`/notes/${id}`);
      setNotes(Array.isArray(res.data) ? res.data : []);
      await addTimeline("Doctor Note", "Clinical note added");
      setNewNote("");
    } catch (error) {
      console.error(error);
    }
  };

  const scheduleAppointment = async () => {
    if (!doctorName || !appointmentDate || !appointmentTime) return;
    try {
      await api.post(`/appointments/${id}`, {
        doctor_name: doctorName,
        appointment_date: appointmentDate,
        appointment_time: appointmentTime
      });
      const res = await api.get(`/appointments/${id}`);
      setAppointments(res.data);
      await addTimeline("Appointment", `Scheduled with ${doctorName}`);
      setDoctorName("");
      setAppointmentDate("");
      setAppointmentTime("");
    } catch (error) {
      console.error(error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full border-2 border-cyan-500/20" />
            <div className="absolute inset-0 w-16 h-16 rounded-full border-2 border-transparent border-t-cyan-500 animate-spin" />
            <User className="absolute inset-0 m-auto w-6 h-6 text-cyan-400" />
          </div>
          <p className="text-slate-500 text-sm">Loading patient data...</p>
        </div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400">Patient not found</p>
          <button
            onClick={() => navigate("/patients")}
            className="mt-4 px-4 py-2 rounded-xl bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 transition-colors"
          >
            Back to Patients
          </button>
        </div>
      </div>
    );
  }

  const bmi = patient.weight_kg && patient.height_cm
    ? (patient.weight_kg / ((patient.height_cm / 100) ** 2)).toFixed(1)
    : "N/A";

  const bmiStatus = bmi < 18.5 ? "Underweight" : bmi < 25 ? "Normal" : bmi < 30 ? "Overweight" : "Obese";
  const riskScore = patient.risk_score || patient.Risk_Score || 0;
  const riskLevel = patient.risk_level || patient.Risk_Level || "Low";

  const tabs = [
    { id: "overview", label: "Overview", icon: User },
    { id: "diagnosis", label: "AI Diagnosis", icon: Brain },
    { id: "notes", label: "Clinical Notes", icon: ClipboardList },
    { id: "appointments", label: "Appointments", icon: Calendar },
    { id: "history", label: "Timeline", icon: History }
  ];

  const vitalCards = [
    { label: "Age", value: patient.age, unit: "years", icon: User },
    { label: "BMI", value: bmi, unit: bmiStatus, icon: Activity },
    { label: "Risk Score", value: riskScore, unit: `/10`, icon: AlertTriangle },
    { label: "Weight", value: patient.weight_kg || "N/A", unit: "kg", icon: TrendingUp }
  ];

  return (
    <motion.div
      className="space-y-6 max-w-[1600px] mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
      >
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/patients")}
            className="p-2 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04] text-slate-400 transition-colors"
          >
            <ChevronRight className="w-5 h-5 rotate-180" />
          </button>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-white tracking-tight">
              {patient.name}
            </h1>
            <p className="text-slate-500 mt-1">
              Patient ID: #{patient.patient_id} | {patient.gender} | Age {patient.age}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {riskScore >= 8 && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-500/10 border border-rose-500/20"
            >
              <AlertCircle className="w-4 h-4 text-rose-400" />
              <span className="text-rose-400 text-sm font-medium">Critical Patient</span>
            </motion.div>
          )}
          <a
            href={`http://127.0.0.1:8000/download-report/${id}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500/20 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span className="text-sm font-medium">Export PDF</span>
          </a>
        </div>
      </motion.div>

      {/* Risk Level Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className={cn(
          "relative overflow-hidden rounded-2xl p-6",
          riskScore >= 8
            ? "bg-gradient-to-r from-rose-500/20 via-rose-500/10 to-transparent border border-rose-500/20"
            : riskScore >= 5
            ? "bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-transparent border border-amber-500/20"
            : "bg-gradient-to-r from-emerald-500/20 via-emerald-500/10 to-transparent border border-emerald-500/20"
        )}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={cn(
              "w-14 h-14 rounded-2xl flex items-center justify-center",
              riskScore >= 8 ? "bg-rose-500/20" : riskScore >= 5 ? "bg-amber-500/20" : "bg-emerald-500/20"
            )}>
              <HeartPulse className={cn(
                "w-7 h-7",
                riskScore >= 8 ? "text-rose-400" : riskScore >= 5 ? "text-amber-400" : "text-emerald-400"
              )} />
            </div>
            <div>
              <p className="text-sm text-slate-400 uppercase tracking-wider">Current Risk Status</p>
              <h2 className={cn(
                "text-2xl font-bold",
                riskScore >= 8 ? "text-rose-400" : riskScore >= 5 ? "text-amber-400" : "text-emerald-400"
              )}>
                {riskLevel}
              </h2>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-400">Risk Score</p>
            <p className="text-3xl font-bold text-white">{riskScore}<span className="text-lg text-slate-500">/10</span></p>
          </div>
        </div>
        <div className="mt-4 h-2 rounded-full bg-white/5 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${riskScore * 10}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className={cn("h-full rounded-full", getRiskProgressColor(riskScore))}
          />
        </div>
      </motion.div>

      {/* Vital Cards */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {vitalCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/[0.06] p-5"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-cyan-400" />
                </div>
              </div>
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">{card.label}</p>
              <p className="text-2xl font-bold text-white">
                {card.value}
                <span className="text-sm text-slate-500 ml-1">{card.unit}</span>
              </p>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex gap-1 p-1 rounded-xl bg-white/[0.02] border border-white/[0.04]"
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-cyan-500/10 text-cyan-400"
                  : "text-slate-500 hover:text-slate-300 hover:bg-white/[0.02]"
              )}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden md:inline">{tab.label}</span>
            </button>
          );
        })}
      </motion.div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === "overview" && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {/* Patient Profile Card */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/[0.06] p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">
                    {patient.name?.charAt(0)?.toUpperCase() || "P"}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{patient.name}</h3>
                  <p className="text-sm text-slate-500">{patient.disease}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                  <p className="text-xs text-slate-500">Gender</p>
                  <p className="text-sm font-medium text-white mt-1">{patient.gender}</p>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                  <p className="text-xs text-slate-500">Height</p>
                  <p className="text-sm font-medium text-white mt-1">{patient.height_cm || "N/A"} cm</p>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                  <p className="text-xs text-slate-500">Weight</p>
                  <p className="text-sm font-medium text-white mt-1">{patient.weight_kg || "N/A"} kg</p>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                  <p className="text-xs text-slate-500">BMI Status</p>
                  <p className={cn(
                    "text-sm font-medium mt-1",
                    bmiStatus === "Normal" ? "text-emerald-400" : "text-amber-400"
                  )}>
                    {bmiStatus}
                  </p>
                </div>
              </div>
            </div>

            {/* Risk Trend */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/[0.06] p-6">
              <h3 className="text-lg font-semibold text-white mb-6">Risk Trend Analysis</h3>
              <RiskTrendChart patientId={id} />
            </div>

            {/* AI Quick Actions */}
            <div className="lg:col-span-2 relative overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-500/10 via-transparent to-emerald-500/10 border border-white/[0.06] p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button
                  onClick={generateDiagnosis}
                  disabled={loadingDiagnosis}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/20 transition-all disabled:opacity-50"
                >
                  {loadingDiagnosis ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <Brain className="w-6 h-6" />
                  )}
                  <span className="text-sm font-medium">AI Diagnosis</span>
                </button>
                <button
                  onClick={() => setActiveTab("notes")}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                >
                  <Plus className="w-6 h-6" />
                  <span className="text-sm font-medium">Add Note</span>
                </button>
                <button
                  onClick={() => setActiveTab("appointments")}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 hover:bg-amber-500/20 transition-colors"
                >
                  <Calendar className="w-6 h-6" />
                  <span className="text-sm font-medium">Schedule</span>
                </button>
                <a
                  href={`http://127.0.0.1:8000/download-report/${id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] text-slate-400 hover:bg-white/[0.04] transition-colors"
                >
                  <Download className="w-6 h-6" />
                  <span className="text-sm font-medium">Export</span>
                </a>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "diagnosis" && (
          <motion.div
            key="diagnosis"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">AI Diagnosis Engine</h3>
                <p className="text-sm text-slate-500">Machine learning powered clinical decision support</p>
              </div>
              <button
                onClick={generateDiagnosis}
                disabled={loadingDiagnosis}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-600 text-white font-medium hover:from-cyan-600 hover:to-cyan-700 transition-all disabled:opacity-50 shadow-lg shadow-cyan-500/20"
              >
                {loadingDiagnosis ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Brain className="w-4 h-4" />
                    <span>Generate Diagnosis</span>
                  </>
                )}
              </button>
            </div>

            {aiDiagnosis && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/[0.06] p-6">
                  <h4 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-4">
                    Diagnosis Results
                  </h4>
                  <div className="space-y-3">
                    {aiDiagnosis.diagnosis?.map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 rounded-xl bg-gradient-to-r from-cyan-500/10 to-transparent border border-cyan-500/20"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-white">{item.disease}</p>
                            <p className="text-sm text-slate-500">Primary condition</p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-cyan-400">{item.confidence}%</p>
                            <p className="text-xs text-slate-500">Confidence</p>
                          </div>
                        </div>
                        <div className="mt-3 h-2 rounded-full bg-white/5 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${item.confidence}%` }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-full"
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/[0.06] p-6">
                  <h4 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-4">
                    AI Recommendations
                  </h4>
                  <div className="space-y-3">
                    {recommendations.length > 0 ? recommendations.map((rec, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]"
                      >
                        <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                        <p className="text-sm text-slate-300">{rec}</p>
                      </motion.div>
                    )) : (
                      <p className="text-slate-500 text-center py-4">No recommendations yet</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {!aiDiagnosis && !loadingDiagnosis && (
              <div className="text-center py-16">
                <Brain className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-500">Click "Generate Diagnosis" to analyze this patient</p>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === "notes" && (
          <motion.div
            key="notes"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/[0.06] p-6">
              <h4 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-4">
                Add Clinical Note
              </h4>
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Enter your clinical observations..."
                className="w-full h-32 p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] text-white placeholder:text-slate-600 resize-none focus:outline-none focus:border-cyan-500/50 transition-colors"
              />
              <div className="flex justify-end mt-4">
                <button
                  onClick={saveNote}
                  disabled={!newNote.trim()}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500/20 transition-colors disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span className="text-sm font-medium">Save Note</span>
                </button>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/[0.06] p-6">
              <h4 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-4">
                Clinical Notes History
              </h4>
              {notes.length > 0 ? (
                <div className="space-y-3">
                  {notes.map((note) => (
                    <div
                      key={note.id}
                      className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]"
                    >
                      <p className="text-sm text-slate-300">{note.note}</p>
                      <p className="text-xs text-slate-500 mt-2">
                        {note.createdAt ? new Date(note.createdAt).toLocaleDateString() : "Recent"}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-slate-600 mx-auto mb-2" />
                  <p className="text-slate-500">No clinical notes yet</p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === "appointments" && (
          <motion.div
            key="appointments"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/[0.06] p-6">
              <h4 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-4">
                Schedule New Appointment
              </h4>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-slate-500 uppercase tracking-wider">Doctor Name</label>
                  <input
                    type="text"
                    value={doctorName}
                    onChange={(e) => setDoctorName(e.target.value)}
                    placeholder="Dr. Smith"
                    className="w-full mt-2 px-4 py-3 rounded-xl bg-white/[0.02] border border-white/[0.04] text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/50 transition-colors"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-slate-500 uppercase tracking-wider">Date</label>
                    <input
                      type="date"
                      value={appointmentDate}
                      onChange={(e) => setAppointmentDate(e.target.value)}
                      className="w-full mt-2 px-4 py-3 rounded-xl bg-white/[0.02] border border-white/[0.04] text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 uppercase tracking-wider">Time</label>
                    <input
                      type="time"
                      value={appointmentTime}
                      onChange={(e) => setAppointmentTime(e.target.value)}
                      className="w-full mt-2 px-4 py-3 rounded-xl bg-white/[0.02] border border-white/[0.04] text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
                    />
                  </div>
                </div>
                <button
                  onClick={scheduleAppointment}
                  disabled={!doctorName || !appointmentDate || !appointmentTime}
                  className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500/20 transition-colors disabled:opacity-50"
                >
                  <Plus className="w-4 h-4" />
                  <span className="font-medium">Schedule Appointment</span>
                </button>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/[0.06] p-6">
              <h4 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-4">
                Upcoming Appointments
              </h4>
              {appointments.length > 0 ? (
                <div className="space-y-3">
                  {appointments.map((apt) => (
                    <div
                      key={apt.id}
                      className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]"
                    >
                      <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-cyan-400" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-white">{apt.doctor_name}</p>
                        <p className="text-sm text-slate-500">{apt.appointment_date} at {apt.appointment_time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-slate-600 mx-auto mb-2" />
                  <p className="text-slate-500">No scheduled appointments</p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === "history" && (
          <motion.div
            key="history"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/[0.06] p-6"
          >
            <h4 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-4">
              Patient Timeline
            </h4>
            {timeline.length > 0 ? (
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-px bg-white/[0.04]" />
                <div className="space-y-4">
                  {timeline.map((item, index) => (
                    <motion.div
                      key={item.id || index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="relative pl-10"
                    >
                      <div className="absolute left-2 top-3 w-4 h-4 rounded-full bg-cyan-500/20 border-2 border-cyan-500" />
                      <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs text-cyan-400 font-medium">{item.event_type}</span>
                        </div>
                        <p className="text-sm text-slate-300">{item.description}</p>
                        <p className="text-xs text-slate-500 mt-2">{item.timestamp || "Recent"}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <History className="w-12 h-12 text-slate-600 mx-auto mb-2" />
                <p className="text-slate-500">No timeline events yet</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default PatientDetails;
