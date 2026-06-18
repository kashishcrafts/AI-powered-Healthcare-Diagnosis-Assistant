import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0f172a] border border-white/10 rounded-xl px-4 py-3 shadow-xl">
        <p className="text-sm text-[var(--text-muted)] mb-1">{label}</p>
        <p className="text-lg font-semibold text-[var(--text-primary)]">
          {payload[0].value}
        </p>
      </div>
    );
  }
  return null;
};

export default function ModernBarChart({ data, dataKey, xKey, color = "#0ea5e9" }) {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
        <XAxis
          dataKey={xKey}
          axisLine={false}
          tickLine={false}
          tick={{ fill: "#64748b", fontSize: 12 }}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fill: "#64748b", fontSize: 12 }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar
          dataKey={dataKey}
          fill={color}
          radius={[8, 8, 0, 0]}
          animationDuration={1500}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
