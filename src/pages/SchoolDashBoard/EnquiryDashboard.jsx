import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
import { GetAllEnquiries, GetEnquiriesByRange } from "../../networkServices/School/RegistrationApi";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

const EnquiryDashboard = () => {
 const [tableData, setTableData] = useState([]);
 console.log("tableData",tableData)
   const handleSearch = async () => {
  
          try {
              const response = await GetAllEnquiries();
              if (response?.success) {
                  setTableData(response?.data);
                  notify(response?.message, "success")
              }
              else {
                  setTableData([])
                  notify(response?.message, "error")
              }
          } catch (error) {
              console.log("error", error)
          }
      }
   const today = new Date().toISOString().split("T")[0];

    const todayEnq = tableData?.filter(
        (ele) => ele.enquiryDate?.startsWith(today)
    );
  const summaryData = [
    { title: "Total Enquiries", value: tableData?.length??0 },
    { title: "Today Enquiries", value: todayEnq?.length ??0 },
    { title: "Converted", value: 45 },
    { title: "Pending", value: 75 },
  ];

  const barData = {
    labels: ["Apr", "May", "Jun", "Jul", "Aug", "Sep"],
    datasets: [
      {
        label: "Enquiries",
        data: [20, 35, 25, 40, 30, 50],
        backgroundColor: "#0d6efd",
      },
    ],
  };

  const doughnutData = {
    labels: ["Total Enquiries", "Today Enquiries", "Rejected"],
    datasets: [
      {
        data: [tableData?.length??0, todayEnq?.length ??0, 15],
        backgroundColor: ["#198754", "#ffc107", "#dc3545"],
      },
    ],
  };

  useEffect(()=>{
    handleSearch()
  },[])

  return (
    <div
    //  className="container mt-4"
     >
      {/* <h4 className="mb-3">📊 Enquiry Dashboard</h4> */}

      {/* Summary Cards */}
      <div className="row mb-4">
        {summaryData.map((item, index) => (
          <div className="col-md-3" key={index}>
            <div
             className="card shadow-sm text-center"
             >
              <div className="card-body">
                <h6 className="text-muted">{item.title}</h6>
                <h3>{item.value}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="row">
        <div className="col-md-8">
          <div 
        //   className="card shadow-sm"
          >
            <div className="card-body">
              <h6>Month-wise Enquiries</h6>
              <Bar data={barData} />
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h6>Status-wise Enquiries</h6>
              <Doughnut data={doughnutData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnquiryDashboard;
