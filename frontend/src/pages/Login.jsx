import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { HeartPulse, User, Lock, Eye, EyeOff, CircleAlert as AlertCircle, Loader as Loader2, Shield, Zap } from "lucide-react";
import api from "../services/api";
import { cn } from "../lib/utils";

function Login({ setIsAuthenticated }) {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const login = async () => {
    if (!username || !password) {
      setError("Please enter both username and password");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const res = await api.post("/login", { username, password });

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", res.data.role);
        setIsAuthenticated(true);
        navigate("/");
      } else {
        setError("Invalid credentials");
      }
    } catch (err) {
      console.error(err);
      setError("Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      login();
    }
  };

  const demoCredentials = [
    { role: "Admin", username: "admin", password: "admin123" },
    { role: "Doctor", username: "doctor", password: "doctor123" }
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="hidden lg:flex lg:flex-1 flex-col justify-between p-12 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #0a0f1a 0%, #0f172a 50%, #1e293b 100%)"
        }}
      >
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMiI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />

        <div className="relative">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-3"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <HeartPulse className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">HealthAI</h1>
              <p className="text-xs text-slate-500">Intelligence Platform</p>
            </div>
          </motion.div>
        </div>

        <div className="relative">
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-4xl font-bold text-white mb-4"
          >
            Enterprise Healthcare
            <br />
            <span className="bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
              Intelligence Platform
            </span>
          </motion.h2>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-slate-400 max-w-md"
          >
            AI-powered clinical decision support, predictive analytics, and comprehensive patient management for modern healthcare organizations.
          </motion.p>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 flex flex-wrap gap-4"
          >
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.02] border border-white/[0.04]">
              <Shield className="w-4 h-4 text-cyan-400" />
              <span className="text-sm text-slate-400">HIPAA Compliant</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.02] border border-white/[0.04]">
              <Zap className="w-4 h-4 text-amber-400" />
              <span className="text-sm text-slate-400">99.9% Uptime</span>
            </div>
          </motion.div>
        </div>

        <div className="relative text-sm text-slate-600">
          <p>HealthAI Enterprise v2.0</p>
        </div>
      </motion.div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-[#0a0f1a]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="w-full max-w-md"
        >
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center">
              <HeartPulse className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-white">HealthAI</h1>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">Welcome back</h2>
            <p className="text-slate-500">Sign in to access the healthcare dashboard</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs text-slate-500 uppercase tracking-wider font-medium">
                Username
              </label>
              <div className="relative mt-2">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="w-5 h-5 text-slate-500" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Enter your username"
                  className="w-full pl-12 pr-4 py-3 bg-white/[0.02] border border-white/[0.06] rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/50 focus:bg-white/[0.04] transition-all duration-200"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-500 uppercase tracking-wider font-medium">
                Password
              </label>
              <div className="relative mt-2">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-slate-500" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Enter your password"
                  className="w-full pl-12 pr-12 py-3 bg-white/[0.02] border border-white/[0.06] rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/50 focus:bg-white/[0.04] transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-slate-400 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20"
              >
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <p className="text-sm text-rose-400">{error}</p>
              </motion.div>
            )}

            <motion.button
              onClick={login}
              disabled={isLoading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className={cn(
                "w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-medium transition-all",
                !isLoading
                  ? "bg-gradient-to-r from-cyan-500 to-cyan-600 text-white hover:from-cyan-600 hover:to-cyan-700 shadow-lg shadow-cyan-500/20"
                  : "bg-white/[0.02] text-slate-500 border border-white/[0.04]"
              )}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <span>Sign in</span>
              )}
            </motion.button>
          </div>

          {/* Demo Credentials */}
          <div className="mt-8 p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
            <p className="text-xs text-slate-500 uppercase tracking-wider font-medium mb-3">
              Demo Credentials
            </p>
            <div className="space-y-2">
              {demoCredentials.map((cred) => (
                <button
                  key={cred.role}
                  onClick={() => {
                    setUsername(cred.username);
                    setPassword(cred.password);
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04] transition-colors group"
                >
                  <span className="text-sm text-slate-400">{cred.role}</span>
                  <span className="text-xs text-slate-600 group-hover:text-slate-500">
                    {cred.username} / {cred.password}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <p className="text-center text-xs text-slate-600 mt-6">
            Healthcare Intelligence Platform v2.0 Enterprise
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default Login;
