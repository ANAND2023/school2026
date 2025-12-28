import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement
} from "chart.js";

ChartJS.register(ArcElement);

const GenderRatioChart = ({ boys = 320, girls = 280 }) => {
  const total = boys + girls;
  const boysPercent = Math.round((boys / total) * 100);

  const data = {
    datasets: [
      {
        data: [boysPercent, 100 - boysPercent],
        backgroundColor: ["#0d6efd", "#e60889ff"],
        borderWidth: 0
      }
    ]
  };

  const options = {
    rotation: -90,
    circumference: 180,
    cutout: "75%",
    plugins: { tooltip: { enabled: false } }
  };

  return (
    <div
    //  className="card p-3 text-center shadow-sm"
     >
      {/* <h6 className="mb-2">Boys vs Girls</h6> */}

      <div style={{ position: "relative", height: "160px" }}>
        <Doughnut data={data} options={options} />

        <div
          style={{
            position: "absolute",
            bottom: "25px",
            width: "100%",
            fontWeight: "bold",
            fontSize: "18px"
          }}
        >
          Boys {boysPercent}%
        </div>
      </div>

      <small className="text-muted">
        Girls {100 - boysPercent}%
      </small>
    </div>
  );
};

export default GenderRatioChart;
