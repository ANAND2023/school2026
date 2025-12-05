import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const SystolicDiagnosisChart = ({ tbody }) => {

  const chartData = tbody?.map((item, index) => {
    const [systolic, diastolic] = item?.BP?.split("/").map(Number);

    return {
      ...item,
      // Height: Number(item?.Height),
      // Weight: Number(item?.Weight),
      systolic,
      diastolic,
      pulse: Number(item?.pulse),
      resp: Number(item?.resp),
      temp: Number(item?.Temp),
      painScore: Number(item?.painScore),
      diagnosisCount: item?.diagnosis?.length || 0,
      timestamp: `${item.DATE} ${item?.Time}`,
    };
  });

  const sortedChartData = [...chartData].sort(
    (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
  );
  const labels = sortedChartData.map((d) => d?.timestamp);
  const chartWidth = Math.max(tbody?.length * 60, 520);
  const TempRes = {
    labels,
    datasets: [
      {
        label: "Systolic BP",
        data: sortedChartData?.map((d) => d.systolic),
        borderColor: "orange",
        backgroundColor: "orange",
        tension: 0.4,
        yAxisID: "y",
      },
      {
        label: "diastolic BP",
        data: sortedChartData?.map((d) => d.diastolic),
        borderColor: "purple",
        backgroundColor: "purple",
        tension: 0.4,
        yAxisID: "y",
      },
      {
        label: "Pulse",
        data: sortedChartData?.map((d) => d.pulse),
        borderColor: "green",
        backgroundColor: "green",
        tension: 0.4,
        yAxisID: "y",
      },
      {
        label: "Respiration",
        data: sortedChartData?.map((d) => d.resp),
        borderColor: "blue",
        backgroundColor: "blue",
        tension: 0.4,
        yAxisID: "y",
      },

      {
        label: "Temperature (°C)",
        data: sortedChartData?.map((d) => d.temp),
        borderColor: "red",
        backgroundColor: "red",
        tension: 0.4,
        yAxisID: "y",
      },
      {
        label: "PainScore (/10)",
        data: sortedChartData?.map((d) => d.painScore),
        borderColor: "gray",
        backgroundColor: "gray",
        tension: 0.4,
        yAxisID: "y",
      },
      // {
      //   label: "Height (cm)",
      //   data: chartData.map((item) => item.Height),
      //   borderColor: "blue",
      //   backgroundColor: "blue",
      //   tension: 0.4,
      //   yAxisID: "y",
      // },
      // {
      //   label: "Weight (kg)",
      //   data: chartData.map((item) => item.Weight),
      //   borderColor: "purple",
      //   backgroundColor: "purple",
      //   tension: 0.4,
      //   yAxisID: "y",
      // },
    ],
  };



  // const optionsSystolicBP = {
  //   responsive: true,
  //   plugins: {
  //     legend: {
  //       position: "top",
  //     },
  //     tooltip: {
  //     },
  //   },
  //   scales: {
  //     y: {
  //       type: "linear",
  //       position: "left",
  //       title: {
  //         display: true,
  //         text: "Systolic BP",
  //       },
  //       ticks: {
  //         stepSize: 40,
  //         beginAtZero: true,
  //         callback: function (value) {
  //           return value;
  //         },
  //       },
  //     },
  //   },
  // };

  // const optionsSystolicData = {
  //   labels,
  //   datasets: [
  //     {
  //       label: "Systolic BP",
  //       data: chartData?.sort((a, b) => new Date(a.date) - new Date(b.date)).map((d) => d.systolic),
  //       borderColor: "orange",
  //       backgroundColor: "orange",
  //       tension: 0.4,
  //       yAxisID: "y",
  //     },
  //   ]
  // };
  // console.log("sss", tbody);


  // const optionsBP = {
  //   responsive: false,
  //   plugins: {
  //     legend: {
  //       position: "top",
  //     },
  //     tooltip: {
  //       // callbacks: {
  //       //   afterLabel: function (context) {
  //       //     debugger
  //       //     const index = context.dataIndex;
  //       //     const systolic = chartData[index]?.systolic;
  //       //     const diastolic = chartData[index]?.diastolic;
  //       //     return [
  //       //       `Systolic BP: ${systolic}`,
  //       //       `Diastolic BP: ${diastolic}`,
  //       //     ];
  //       //   },
  //       // },
  //     },
  //   },
  //   scales: {
  //     y: {
  //       type: "linear",
  //       position: "left",
  //       title: {
  //         display: true,
  //         text: "Systolic BP & Diastolic BP",
  //       },
  //     },
  //   },
  // };


  function generateLineChartConfig({
    chartData,
    label,
    fieldName,
    color,
    yAxisTitle = label,
    stepSize = 40,
  }) {
    const sortedData = [...chartData].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    const labels = sortedData.map(d => d.timestamp);

    const data = {
      labels,
      datasets: [
        {
          label,
          data: sortedData.map(d => d[fieldName]),
          borderColor: color,
          backgroundColor: color,
          tension: 0.4,
          yAxisID: "y",
        },
      ],
    };

    const options = {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
        tooltip: {},
      },
      scales: {
        y: {
          type: "linear",
          position: "left",
          title: {
            display: true,
            text: yAxisTitle,
          },
          ticks: {
            stepSize,
            beginAtZero: true,
            callback: value => value,
          },
        },
      },
    };

    return { data, options };
  }

  const systolicConfig = generateLineChartConfig({
    chartData,
    label: "Systolic BP",
    fieldName: "systolic",
    color: "orange",
  });

  const diastolicConfig = generateLineChartConfig({
    chartData,
    label: "Diastolic BP",
    fieldName: "diastolic",
    color: "purple",
  });
  const pulseConfig = generateLineChartConfig({
    chartData,
    label: "pulse",
    fieldName: "pulse",
    color: "green",
  });
  const RespirationConfig = generateLineChartConfig({
    chartData,
    label: "Respiration",
    fieldName: "resp",
    color: "blue",
  });
  const TemperatureConfig = generateLineChartConfig({
    chartData,
    label: "Temperature (°C)",
    fieldName: "temp",
    color: "red",
  });
  const PainScoreConfig = generateLineChartConfig({
    chartData,
    label: "PainScore (/10)",
    fieldName: "painScore",
    color: "grey",
  });
  return (
    <div className="space-y-10  text-center ">
      <div style={{ overflowX: "auto" }}>
        <Line
          data={systolicConfig.data}
          options={systolicConfig.options}
          width={chartWidth}
          height={100}
        />

        <Line
          data={diastolicConfig.data}
          options={diastolicConfig.options}
          width={chartWidth}
          height={100}
        />
        <Line
          data={pulseConfig.data}
          options={pulseConfig.options}
          width={chartWidth}
          height={100}
        />
        <Line
          data={RespirationConfig.data}
          options={RespirationConfig.options}
          width={chartWidth}
          height={100}
        />
        <Line
          data={TemperatureConfig.data}
          options={TemperatureConfig.options}
          width={chartWidth}
          height={100}
        />
        <Line
          data={PainScoreConfig.data}
          options={PainScoreConfig.options}
          width={chartWidth}
          height={100}
        />
      </div>
      {/* <div style={{ overflowX: "auto" }}>

        <Line data={data} options={optionsBP} width={chartWidth} height={300} />
      </div> */}

      <div
      // style={{
      //   width: "100%",
      //   maxWidth: "100%", 
      //   margin: "0 auto", 
      //   padding: "1rem",
      // }}
      >

        {/* <h3 className="mb-2 fs-5 fw-semibold">Pulse & Respiration & Temp</h3> */}
        {/* <Line data={TempRes} options={optionsSystolicBP}  /> */}
      </div>

    </div>
  );
};

export default SystolicDiagnosisChart;
