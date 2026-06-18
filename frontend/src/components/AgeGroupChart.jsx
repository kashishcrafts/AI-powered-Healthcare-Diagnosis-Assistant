import {
  Bar
} from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

function AgeGroupChart({ data }) {

  const chartData = {
    labels: data.map(
      item => item.age_group
    ),

    datasets: [
      {
        label: "Patients",

        data: data.map(
          item => item.count
        ),
      },
    ],
  };

  return (
    <Bar data={chartData} />
  );
}

export default AgeGroupChart;