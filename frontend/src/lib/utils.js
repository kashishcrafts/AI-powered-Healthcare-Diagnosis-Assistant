import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatNumber(num) {
  if (num === null || num === undefined) return "0";
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function getRiskColor(level) {
  const colors = {
    "Critical Risk": "text-rose-400 bg-rose-500/10 border-rose-500/20",
    "High Risk": "text-amber-400 bg-amber-500/10 border-amber-500/20",
    "Medium Risk": "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
    "Low Risk": "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    critical: "text-rose-400 bg-rose-500/10 border-rose-500/20",
    high: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    medium: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
    low: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  };
  return colors[level] || colors.low;
}

export function getRiskScoreColor(score) {
  if (score >= 8) return "bg-rose-500";
  if (score >= 5) return "bg-amber-500";
  if (score >= 3) return "bg-yellow-500";
  return "bg-emerald-500";
}

export function getRiskProgressColor(score) {
  if (score >= 8) return "bg-gradient-to-r from-rose-500 to-rose-400";
  if (score >= 5) return "bg-gradient-to-r from-amber-500 to-amber-400";
  if (score >= 3) return "bg-gradient-to-r from-yellow-500 to-yellow-400";
  return "bg-gradient-to-r from-emerald-500 to-emerald-400";
}
