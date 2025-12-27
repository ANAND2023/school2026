import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const PrincipalChart = () => {
//   const data = {
//     labels: ["Student", "Admission", "", "CO", "SE"],
//     datasets: [
//       {
//         data: [84, 32, 28, 0, 3],
//         backgroundColor: [
//           "#0d6efd",
//           "#198754",
//           "#ffc107",
//           "#dc3545",
//           "#6f42c1"
//         ]
//       }
//     ]
//   };
const data = {
  labels: [
    "Total Students",
    "New Admissions",
    "Teachers",
    "Staff",
    // "Pending Fees"
  ],
  datasets: [
    {
         data: [840, 322, 28, 10],
    //   data: [
    //     dashboard?.students,
    //     dashboard?.admissions,
    //     dashboard?.teachers,
    //     dashboard?.staff,
    //     dashboard?.pendingFees
    //   ],
      backgroundColor: [
        "#0d6efd",
        "#198754",
        "#20c997",
        "#6f42c1",
        // "#dc3545"
      ],
      borderWidth: 1
    }
  ]
};

  return <Doughnut data={data} />;
};

export default PrincipalChart;
