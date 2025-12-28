import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

const FeesChart = ({ feesData }) => {
  const data = {
    labels: [
      "Apr", "May", "Jun", "Jul", "Aug", "Sep",
      "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"
    ],
    datasets: [
      {
        label: "Collected Fees (₹)",
        data: feesData?.collected || [
          45000, 52000, 61000, 58000, 64000, 70000,
          68000, 72000, 76000, 74000, 78000, 82000
        ],
        backgroundColor: "#198754"
      },
      {
        label: "Pending Fees (₹)",
        data: feesData?.pending || [
          15000, 12000, 18000, 16000, 14000, 10000,
          12000, 9000, 8000, 7000, 6000, 5000
        ],
        backgroundColor: "#dc3545"
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top"
      },
      tooltip: {
        callbacks: {
          label: (ctx) =>
            `${ctx.dataset.label}: ₹${ctx.raw.toLocaleString()}`
        }
      }
    },
    scales: {
      y: {
        ticks: {
          callback: (value) => `₹${value / 1000}k`
        }
      }
    }
  };

  return (
    <div className=" p-3 ">
      <h6 className="text-center mb-3">Month-wise Fees Report</h6>
      <Bar data={data} options={options} />
    </div>
  );
};

export default FeesChart;
