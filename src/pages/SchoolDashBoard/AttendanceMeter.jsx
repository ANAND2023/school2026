import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip
} from "chart.js";

ChartJS.register(ArcElement, Tooltip);

const AttendanceMeter = ({ present = 78 }) => {
  const data = {
    labels: ["Present", "Absent"],
    datasets: [
      {
        data: [present, 100 - present],
        backgroundColor: ["#198754", "#e9ecef"],
        borderWidth: 0
      }
    ]
  };

  const options = {
    rotation: -90,
    circumference: 180, // half circle (meter look)
    cutout: "75%",
    plugins: {
      tooltip: { enabled: false }
    }
  };

  return (
    <div
    //  className="card p-3 text-center shadow-sm"
     >
      {/* <h6 className="mb-2">Student Attendance</h6> */}

      <div style={{ position: "relative", height: "180px" }}>
        <Doughnut data={data} options={options} />

        {/* Center Percentage */}
        <div
          style={{
            position: "absolute",
            bottom: "25px",
            width: "100%",
            textAlign: "center",
            fontSize: "22px",
            fontWeight: "bold"
          }}
        >
          {present}%
        </div>
      </div>
    </div>
  );
};

export default AttendanceMeter;
