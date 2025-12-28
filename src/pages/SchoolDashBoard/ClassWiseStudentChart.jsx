import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const ClassWiseStudentChart = ({ classData }) => {

  const data = {
    labels: [
      "Class 1",
      "Class 2",
      "Class 3",
      "Class 4",
      "Class 5",
      "Class 6",
      "Class 7",
      "Class 8",
      "Class 9",
      "Class 10"
    ],
    datasets: [
      {
        data: classData || [60, 72, 80, 75, 90, 85, 78, 88, 70, 65],
        backgroundColor: [
          "#0d6efd",
          "#198754",
          "#20c997",
          "#6f42c1",
          "#ffc107",
        //   "#fd7e14",
        //   "#dc3545",
        //   "#6610f2",
        //   "#0dcaf0",
        //   "#adb5bd"
        ],
        borderWidth: 1
      }
    ]
  };

  const options = {
    plugins: {
      legend: {
        position: "right"
      },
      tooltip: {
        callbacks: {
          label: (ctx) =>
            `${ctx.label}: ${ctx.raw} students`
        }
      }
    },
    cutout: "60%"
  };

  return (
   <div 
//    style={{ width: "220px", height: "220px", margin: "0 auto" }}
   >
  <Doughnut data={data} options={options} />
</div>
  );
};

export default ClassWiseStudentChart;
