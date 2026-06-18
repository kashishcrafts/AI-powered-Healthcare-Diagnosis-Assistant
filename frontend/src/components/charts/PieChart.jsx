import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0f172a] border border-white/10 rounded-xl px-4 py-3 shadow-xl">
        <p className="text-sm text-[var(--text-muted)] mb-1">{payload[0].name}</p>
        <p className="text-lg font-semibold text-[var(--text-primary)]">
          {payload[0].value}
        </p>
      </div>
    );
  }
  return null;
};

export default function ModernPieChart({ data, colors }) {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={90}
          paddingAngle={4}
          dataKey="value"
          animationDuration={1500}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
      </PieChart>
    </ResponsiveContainer>
  );
}
