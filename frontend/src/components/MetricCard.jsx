import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "../lib/utils";

export default function MetricCard({
  title,
  value,
  subtitle,
  trend,
  trendValue,
  icon: Icon,
  color = "blue",
  delay = 0,
  className,
}) {
  const colorMap = {
    blue: "bg-sky-500/10 text-sky-400 border-sky-500/20",
    emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    amber: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    rose: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    violet: "bg-violet-500/10 text-violet-400 border-violet-500/20",
  };

  const iconColorMap = {
    blue: "text-sky-400",
    emerald: "text-emerald-400",
    amber: "text-amber-400",
    rose: "text-rose-400",
    violet: "text-violet-400",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={cn(
        "glass-panel p-5 transition-all duration-300 hover:bg-white/5 hover:border-white/10",
        className
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className={cn(
            "flex items-center justify-center w-10 h-10 rounded-xl border",
            colorMap[color]
          )}
        >
          {Icon && <Icon className={cn("w-5 h-5", iconColorMap[color])} />}
        </div>
        {trend && (
          <div
            className={cn(
              "flex items-center gap-1 text-xs font-medium",
              trend === "up" ? "text-emerald-400" : "text-rose-400"
            )}
          >
            {trend === "up" ? (
              <TrendingUp className="w-3.5 h-3.5" />
            ) : (
              <TrendingDown className="w-3.5 h-3.5" />
            )}
            {trendValue}
          </div>
        )}
      </div>

      <div className="space-y-1">
        <p className="text-sm text-[var(--text-muted)] font-medium">{title}</p>
        <h3 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">
          {value}
        </h3>
        {subtitle && (
          <p className="text-xs text-[var(--text-muted)]">{subtitle}</p>
        )}
      </div>
    </motion.div>
  );
}
