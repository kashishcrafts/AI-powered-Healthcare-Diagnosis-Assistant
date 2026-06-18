import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function RiskChart({ data }) {
  const riskColors = {
    "Critical Risk": { bg: "rgba(244, 63, 94, 0.6)", border: "rgb(244, 63, 94)" },
    "High Risk": { bg: "rgba(251, 146, 60, 0.6)", border: "rgb(251, 146, 60)" },
    "Medium Risk": { bg: "rgba(234, 179, 8, 0.6)", border: "rgb(234, 179, 8)" },
    "Low Risk": { bg: "rgba(34, 197, 94, 0.6)", border: "rgb(34, 197, 94)" }
  };

  const getColors = (riskLevel) => {
    return riskColors[riskLevel] || riskColors["Low Risk"];
  };

  const chartData = {
    labels: data.map((item) => item.risk_level || "Unknown"),
    datasets: [
      {
        label: "Patient Count",
        data: data.map((item) => item.count || 0),
        backgroundColor: data.map((item) => getColors(item.risk_level).bg),
        borderColor: data.map((item) => getColors(item.risk_level).border),
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(15, 23, 42, 0.95)",
        titleColor: "#f8fafc",
        bodyColor: "#94a3b8",
        borderColor: "rgba(255, 255, 255, 0.1)",
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#64748b",
          font: { size: 11, weight: "500" },
        },
        grid: {
          display: false,
        },
        border: {
          display: false,
        },
      },
      y: {
        ticks: {
          color: "#64748b",
          font: { size: 11 },
        },
        grid: {
          color: "rgba(255, 255, 255, 0.04)",
        },
        border: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="h-64">
      <Bar data={chartData} options={options} />
    </div>
  );
}

export default RiskChart;
