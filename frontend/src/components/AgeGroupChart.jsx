import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

function AgeGroupChart({ data }) {
  const chartData = {
    labels: data.map((item) => item.age_group || "Unknown"),
    datasets: [
      {
        label: "Patient Count",
        data: data.map((item) => item.count || 0),
        backgroundColor: "rgba(14, 165, 233, 0.6)",
        borderColor: "rgb(14, 165, 233)",
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

export default AgeGroupChart;
