import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
);

function RiskTrendChart({ patientId }) {
  const chartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Risk Score",
        data: [4, 5, 6, 7, 6, 8],
        borderColor: "rgb(14, 165, 233)",
        backgroundColor: "rgba(14, 165, 233, 0.1)",
        tension: 0.4,
        fill: true,
        borderWidth: 3,
        pointRadius: 4,
        pointBackgroundColor: "rgb(14, 165, 233)",
        pointBorderColor: "#0a0f1a",
        pointBorderWidth: 2,
        pointHoverRadius: 6,
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
          font: { size: 11 },
        },
        grid: {
          display: false,
        },
        border: {
          display: false,
        },
      },
      y: {
        min: 0,
        max: 10,
        ticks: {
          color: "#64748b",
          font: { size: 11 },
          stepSize: 2,
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
    <div className="h-48">
      <Line data={chartData} options={options} />
    </div>
  );
}

export default RiskTrendChart;
