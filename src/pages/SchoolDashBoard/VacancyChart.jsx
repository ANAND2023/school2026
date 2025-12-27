import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const VacancyChart = () => {
  const data = {
    labels: ["21-22", "22-23", "23-24", "24-25", "25-26"],
    datasets: [
      {
        label: "Elementary",
        data: [5, 8, 12, 15, 18],
        backgroundColor: "#0d6efd"
      },
      {
        label: "Middle",
        data: [3, 6, 9, 11, 14],
        backgroundColor: "#198754"
      },
      {
        label: "High",
        data: [2, 4, 6, 9, 12],
        backgroundColor: "#ffc107"
      }
    ]
  };

  return <Bar data={data} />;
};

export default VacancyChart;
