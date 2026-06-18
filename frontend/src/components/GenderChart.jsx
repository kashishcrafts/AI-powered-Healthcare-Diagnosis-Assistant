import {
  Pie
} from "react-chartjs-2";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

function GenderChart({ data }) {

  const chartData = {
    labels: data.map(
      item => item.gender
    ),

    datasets: [
      {
        data: data.map(
          item => item.count
        ),
      },
    ],
  };

  return (
    <Pie data={chartData} />
  );
}

export default GenderChart;