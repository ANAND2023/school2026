import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

const commonOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: { color: "#cbd5e1" },
    },
  },
  scales: {
    x: {
      ticks: { color: "#94a3b8" },
      grid: { color: "#1e293b" },
    },
    y: {
      ticks: { color: "#94a3b8" },
      grid: { color: "#1e293b" },
    },
  },
};

export default function DashboardCharts() {
  const barData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May"],
    datasets: [
      {
        label: "Blue Data",
        data: [45, 30, 60, 40, 55],
        backgroundColor: "#3b82f6",
      },
      {
        label: "Red Data",
        data: [35, 50, 45, 55, 40],
        backgroundColor: "#ef4444",
      },
    ],
  };

  const lineData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May"],
    datasets: [
      {
        label: "Yellow Line",
        data: [20, 45, 25, 60, 35],
        borderColor: "#fbbf24",
        tension: 0.4,
      },
      {
        label: "Red Line",
        data: [15, 35, 30, 50, 40],
        borderColor: "#ef4444",
        tension: 0.4,
      },
      {
        label: "Blue Line",
        data: [10, 25, 20, 40, 30],
        borderColor: "#3b82f6",
        tension: 0.4,
      },
    ],
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        
        <Bar data={barData} options={commonOptions} />
      </div>

      <div style={styles.card}>
        <Line data={lineData} options={commonOptions} />
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
    background: "#020617",
    padding: "20px",
    height: "100vh",
  },
  card: {
    background: "#020617",
    border: "1px solid #1e293b",
    borderRadius: "12px",
    padding: "15px",
    height: "400px",
  },
};
