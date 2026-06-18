import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Send, User, Bot, Loader as Loader2, Sparkles, CircleAlert as AlertCircle, CircleCheck as CheckCircle, Info, Zap, Shield, Activity } from "lucide-react";
import api from "../services/api";
import { cn } from "../lib/utils";

function AIChat() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const sendMessage = async () => {
    if (!message.trim() || isLoading) return;

    const userMsg = { role: "user", text: message, timestamp: new Date() };
    setChat((prev) => [...prev, userMsg]);
    setMessage("");
    setIsLoading(true);

    try {
      const res = await api.post("/ai-diagnosis", { message });
      const aiMsg = {
        role: "assistant",
        text: res.data.diagnosis,
        confidence: res.data.confidence,
        recommendations: res.data.recommendations || [],
        timestamp: new Date()
      };
      setChat((prev) => [...prev, aiMsg]);
    } catch (error) {
      console.error(error);
      const errorMsg = {
        role: "assistant",
        text: "I apologize, but I encountered an error processing your request. Please try again.",
        isError: true,
        timestamp: new Date()
      };
      setChat((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickPrompts = [
    { icon: Activity, text: "Analyze symptoms: chest pain, fatigue, shortness of breath", color: "cyan" },
    { icon: Shield, text: "Explain risk factors for cardiovascular disease", color: "emerald" },
    { icon: Zap, text: "Recommend diagnostic tests for diabetes screening", color: "amber" },
    { icon: Brain, text: "Interpret lab results: elevated glucose, high cholesterol", color: "rose" }
  ];

  return (
    <motion.div
      className="flex flex-col max-w-[1200px] mx-auto h-[calc(100vh-120px)]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[#0a0f1a] flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">AI Diagnosis Assistant</h1>
            <p className="text-sm text-slate-500">Clinical decision support powered by machine learning</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
          <div className="relative">
            <div className="w-2 h-2 rounded-full bg-emerald-400" />
            <div className="absolute inset-0 w-2 h-2 rounded-full bg-emerald-400 animate-ping opacity-75" />
          </div>
          <span className="text-emerald-400 text-sm font-medium">AI Engine Active</span>
        </div>
      </div>

      {/* Chat Container */}
      <div className="flex-1 flex flex-col min-h-0 relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/[0.06]">
        <div className="flex-1 overflow-y-auto p-6 space-y-4 scroll-y">
          {chat.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="h-full flex flex-col items-center justify-center text-center py-12"
            >
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 flex items-center justify-center mb-6">
                <Sparkles className="w-10 h-10 text-cyan-400" />
              </div>
              <h2 className="text-xl font-semibold text-white mb-2">
                How can I help you today?
              </h2>
              <p className="text-slate-500 max-w-md mb-8">
                I'm your AI-powered clinical assistant. Describe symptoms, ask for differential diagnoses,
                or request medical recommendations.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl">
                {quickPrompts.map((prompt, index) => {
                  const Icon = prompt.icon;
                  const colorStyles = {
                    cyan: "bg-cyan-500/10 border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/20",
                    emerald: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20",
                    amber: "bg-amber-500/10 border-amber-500/20 text-amber-400 hover:bg-amber-500/20",
                    rose: "bg-rose-500/10 border-rose-500/20 text-rose-400 hover:bg-rose-500/20"
                  };
                  return (
                    <motion.button
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => setMessage(prompt.text)}
                      className={cn(
                        "flex items-center gap-3 p-4 rounded-xl border transition-colors text-left",
                        colorStyles[prompt.color]
                      )}
                    >
                      <Icon className="w-5 h-5 shrink-0" />
                      <span className="text-sm font-medium">{prompt.text}</span>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          ) : (
            <AnimatePresence>
              {chat.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={cn(
                    "flex gap-4",
                    msg.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  {msg.role === "assistant" && (
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center shrink-0">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                  )}
                  <div
                    className={cn(
                      "max-w-[70%] rounded-2xl p-4",
                      msg.role === "user"
                        ? "bg-cyan-500/10 border border-cyan-500/20"
                        : msg.isError
                        ? "bg-rose-500/10 border border-rose-500/20"
                        : "bg-white/[0.02] border border-white/[0.04]"
                    )}
                  >
                    {msg.role === "user" ? (
                      <p className="text-white">{msg.text}</p>
                    ) : (
                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <CheckCircle className="w-4 h-4 text-emerald-400" />
                            <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">
                              Diagnosis
                            </p>
                          </div>
                          <p className={cn("text-slate-300", msg.isError && "text-rose-400")}>
                            {msg.text}
                          </p>
                        </div>

                        {msg.confidence && (
                          <div className="p-3 rounded-xl bg-cyan-500/5 border border-cyan-500/10">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs text-slate-500 uppercase tracking-wider">Confidence</span>
                              <span className="text-lg font-bold text-cyan-400">{msg.confidence}%</span>
                            </div>
                            <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${msg.confidence}%` }}
                                transition={{ duration: 0.5 }}
                                className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-full"
                              />
                            </div>
                          </div>
                        )}

                        {msg.recommendations?.length > 0 && (
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <Info className="w-4 h-4 text-amber-400" />
                              <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">
                                Recommendations
                              </p>
                            </div>
                            <ul className="space-y-2">
                              {msg.recommendations.map((rec, i) => (
                                <li
                                  key={i}
                                  className="flex items-start gap-2 text-sm text-slate-400"
                                >
                                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                                  {rec}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        <p className="text-xs text-slate-600">
                          {msg.timestamp?.toLocaleTimeString() || "Just now"}
                        </p>
                      </div>
                    )}
                  </div>
                  {msg.role === "user" && (
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center shrink-0">
                      <User className="w-5 h-5 text-white" />
                    </div>
                  )}
                </motion.div>
              ))}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-4"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center shrink-0">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div className="bg-white/[0.02] border border-white/[0.04] rounded-2xl p-4">
                    <div className="flex items-center gap-3">
                      <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
                      <span className="text-slate-400 text-sm">Analyzing clinical data...</span>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={chatEndRef} />
            </AnimatePresence>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-white/[0.04]">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Describe symptoms, ask for diagnoses, or request clinical recommendations..."
                rows={1}
                className="w-full px-4 py-3 bg-white/[0.02] border border-white/[0.04] rounded-xl text-white placeholder:text-slate-600 resize-none focus:outline-none focus:border-cyan-500/50 focus:bg-white/[0.04] transition-all duration-200"
                style={{ minHeight: "48px", maxHeight: "120px" }}
              />
            </div>
            <motion.button
              onClick={sendMessage}
              disabled={!message.trim() || isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium transition-colors",
                message.trim() && !isLoading
                  ? "bg-gradient-to-r from-cyan-500 to-cyan-600 text-white hover:from-cyan-600 hover:to-cyan-700 shadow-lg shadow-cyan-500/20"
                  : "bg-white/[0.02] text-slate-500 border border-white/[0.04]"
              )}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Send</span>
                </>
              )}
            </motion.button>
          </div>
          <p className="text-center text-xs text-slate-600 mt-3">
            AI recommendations are for clinical decision support only. Always verify with professional medical judgment.
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default AIChat;
