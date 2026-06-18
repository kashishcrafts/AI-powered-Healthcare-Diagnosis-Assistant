import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Pie } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

function DiseaseChart({ data }) {
  const chartData = {
    labels: data.map((item) => item.disease),
    datasets: [
      {
        data: data.map((item) => item.count),
        backgroundColor: [
          "#3b82f6",
          "#22c55e",
          "#f59e0b",
          "#ef4444",
          "#8b5cf6",
        ],
      },
    ],
  };

  return (
    <Pie
      data={chartData}
      options={{
        plugins: {
          legend: {
            labels: {
              color: "white",
            },
          },
        },
      }}
    />
  );
}

export default DiseaseChart;