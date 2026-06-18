import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

function GenderChart({ data }) {
  const genderColors = {
    "Male": { bg: "rgba(14, 165, 233, 0.7)", border: "rgb(14, 165, 233)" },
    "Female": { bg: "rgba(236, 72, 153, 0.7)", border: "rgb(236, 72, 153)" },
    "Other": { bg: "rgba(139, 92, 246, 0.7)", border: "rgb(139, 92, 246)" }
  };

  const getColors = (gender) => {
    return genderColors[gender] || genderColors["Other"];
  };

  const chartData = {
    labels: data.map((item) => item.gender || "Unknown"),
    datasets: [
      {
        data: data.map((item) => item.count || 0),
        backgroundColor: data.map((item) => getColors(item.gender).bg),
        borderColor: data.map((item) => getColors(item.gender).border),
        borderWidth: 2,
        hoverOffset: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
        labels: {
          color: "#94a3b8",
          font: { size: 11 },
          padding: 12,
          usePointStyle: true,
          pointStyle: "circle",
        },
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
  };

  return (
    <div className="h-64">
      <Pie data={chartData} options={options} />
    </div>
  );
}

export default GenderChart;
