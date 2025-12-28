import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

const AccountantDashboard = () => {

  const summary = [
    { title: "Total Income", value: "₹ 4,50,000" },
    { title: "Total Expense", value: "₹ 2,80,000" },
    { title: "Net Balance", value: "₹ 1,70,000" },
    { title: "Today Collection", value: "₹ 32,500" },
  ];

  const barData = {
    labels: ["Apr", "May", "Jun", "Jul", "Aug", "Sep"],
    datasets: [
      {
        label: "Income",
        data: [80000, 75000, 90000, 85000, 70000, 95000],
        backgroundColor: "#198754",
      },
      {
        label: "Expense",
        data: [45000, 50000, 48000, 52000, 47000, 58000],
        backgroundColor: "#dc3545",
      },
    ],
  };

  const doughnutData = {
    labels: ["Salary", "Electricity", "Maintenance", "Transport", "Other"],
    datasets: [
      {
        data: [120000, 30000, 25000, 40000, 20000],
        backgroundColor: [
          "#0d6efd",
          "#ffc107",
          "#20c997",
          "#6610f2",
          "#6c757d"
        ],
      },
    ],
  };

  return (
    <div className="container mt-4">
      <h4 className="mb-3">💰 Accountant Dashboard</h4>

      {/* Summary Cards */}
      <div className="row mb-4">
        {summary.map((item, i) => (
          <div className="col-md-3" key={i}>
            <div className="card shadow-sm text-center">
              <div className="card-body">
                <small className="text-muted">{item.title}</small>
                <h4 className="mt-2">{item.value}</h4>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="row">
        <div className="col-md-8">
          <div className="card shadow-sm">
            <div className="card-body">
              <h6>Month-wise Income vs Expense</h6>
              <Bar data={barData} />
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h6>Expense Category-wise</h6>
              <Doughnut data={doughnutData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountantDashboard;
