import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ComposedChart,
  ScatterChart,
  Scatter,
  ZAxis,
  ResponsiveContainer,
} from "recharts";
import "./index.css";
import { useEffect, useState } from "react";
import GaugeWithNeedle from "./MeterGaugeChart";
import { getDashboard, getDashboardDataTYPEID } from "../../networkServices/dashboardAPI";
import { useLocalStorage } from "../../utils/hooks/useLocalStorage";
import { formatIndianCurrency } from "../../utils/ustil2";
import { useWindowSize } from "../../utils/hooks/useWindowSize";
import { GrothChart, GrowthGraphSVGICON, LossChart, LossGraphSVGICON, NutralGraph } from "../../components/SvgIcons";
import MyMap from "./MyMap";

export default function RevenueDashboard() {
  const [value, setValue] = useState({ AppointmentTrend: [], revenueTrend: [] });
  const userData = useLocalStorage();
  const [listData, setListData] = useState({ totalBusiness: [] });

  const [stats, setStats] = useState([]);

  const getPercentage = (totalBusinessCTAmt, totalBusinessPTAmt) => {
    const percentageChange = ((totalBusinessCTAmt - totalBusinessPTAmt) / totalBusinessPTAmt) * 100;
    const fixedChange = percentageChange.toFixed(2);
    return totalBusinessPTAmt ? fixedChange : 0;
  };

  const getDatalist = () => {
    const payloadData = {
      fromDate: "2025-06-15",
      tAbid: 1,
      phrledgerno: userData?.deptLedgerNo,
      toDate: "2025-07-18",
    };
    const RevenueTrendpayload = {
      fromDate: "2025-06-17",
      tAbid: 1,
      toDate: "2025-07-18",
    }
    try {
      Promise.all([
        getDashboard({ ...payloadData, type: "51" }),
        getDashboard({ ...payloadData, type: "52" }),
        getDashboard({ ...payloadData, type: "53" }),
        getDashboard({ ...payloadData, type: "54" }),
        getDashboard({ ...payloadData, type: "3" }),
        getDashboard({ ...payloadData, type: "2" }),
        getDashboard({ ...payloadData, type: "6" }),
        getDashboard({ ...payloadData, type: "8" }),
        getDashboardDataTYPEID({ ...RevenueTrendpayload, type: 8 }),
        getDashboardDataTYPEID({ ...RevenueTrendpayload, type: 13 }),
        getDashboardDataTYPEID({ ...RevenueTrendpayload, type: 15 }),
      ]).then(
        ([totalBusiness, totalDiscount, totalCollection, totalOutStanding, AppointmentTrend, BedOccupancy, ReportTrend, ClearanceTrend, revenueTrendReportData, discountTrendReportData, OutstandingTrendReportData]) => {

          // const cardData = []
          // if (totalBusiness?.success) {
          //   const CTAmt = totalBusiness?.data?.reduce((acc, current) => {
          //     return acc + current?.CTAmt;
          //   }, 0);
          //   const PTAmt = totalBusiness?.data?.reduce((acc, current) => {
          //     return acc + current?.PTAmt;
          //   }, 0);
          //   const Percentage = getPercentage(CTAmt, PTAmt);
          //   cardData.push({
          //     id: 1,
          //     title: "Total Business",
          //     value: CTAmt,
          //     PTAmt: PTAmt,
          //     percentage: Percentage,
          //     isGroth: Percentage > 0 ? true : false,
          //     color: "text-warning",
          //     // icon: "bi-briefcase-fill",
          //   })
          //   setListData((val) => ({
          //     ...val,
          //     totalBusiness: totalBusiness?.data,
          //   }));
          // }
          // if (totalDiscount?.success) {
          //   const CTAmt = totalDiscount?.data?.reduce((acc, current) => {
          //     return acc + current?.CTAmt;
          //   }, 0);
          //   const PTAmt = totalDiscount?.data?.reduce((acc, current) => {
          //     return acc + current?.PTAmt;
          //   }, 0);
          //   const Percentage = getPercentage(CTAmt, PTAmt);
          //   cardData.push({
          //     id: 2,
          //     title: "Total Discount",
          //     value: CTAmt,
          //     PTAmt: PTAmt,
          //     percentage: Percentage,
          //     isGroth: Percentage > 0 ? true : false,
          //     color: "text-warning",
          //     icon: "bi-briefcase-fill",
          //   })

          //   setListData((val) => ({
          //     ...val,
          //     totalDiscount: totalDiscount?.data,
          //   }));
          // }
          // if (totalCollection?.success) {
          //   const CTAmt = totalCollection?.data?.reduce((acc, current) => {
          //     return acc + current?.CTAmt;
          //   }, 0);
          //   const PTAmt = totalCollection?.data?.reduce((acc, current) => {
          //     return acc + current?.PTAmt;
          //   }, 0);
          //   const Percentage = getPercentage(CTAmt, PTAmt);
          //   cardData.push({
          //     id: 3,
          //     title: "Total Collection",
          //     value: CTAmt,
          //     PTAmt: PTAmt,
          //     percentage: Percentage,
          //     isGroth: Percentage > 0 ? true : false,
          //     color: "text-warning",
          //     icon: "bi-briefcase-fill",
          //   },)

          //   setListData((val) => ({
          //     ...val,
          //     totalCollection: totalCollection?.data,
          //   }));
          // }
          // if (totalOutStanding?.success) {
          //   const CTAmt = totalOutStanding?.data?.reduce((acc, current) => {
          //     return acc + current?.CTAmt;
          //   }, 0);
          //   const PTAmt = totalOutStanding?.data?.reduce((acc, current) => {
          //     return acc + current?.PTAmt;
          //   }, 0);
          //   const Percentage = getPercentage(CTAmt, PTAmt);
          //   cardData.push({
          //     id: 4,
          //     title: "Total OutStanding",
          //     value: CTAmt,
          //     PTAmt: PTAmt,
          //     percentage: Percentage,
          //     isGroth: Percentage > 0 ? true : false,
          //     color: "text-warning",
          //     icon: "bi-briefcase-fill",
          //   })

          //   setListData((val) => ({
          //     ...val,
          //     totalOutStanding: totalOutStanding?.data,
          //   }));
          // }
          // setStats(cardData)


          const cardData = [];
          const metrics = [
            {
              id: 1,
              title: "Total Business",
              data: totalBusiness,
              key: "totalBusiness",
              icon: null, // or "bi-briefcase-fill"
            },
            {
              id: 2,
              title: "Total Discount",
              data: totalDiscount,
              key: "totalDiscount",
              icon: "bi-briefcase-fill",
            },
            {
              id: 3,
              title: "Total Collection",
              data: totalCollection,
              key: "totalCollection",
              icon: "bi-briefcase-fill",
            },
            {
              id: 4,
              title: "Total OutStanding",
              data: totalOutStanding,
              key: "totalOutStanding",
              icon: "bi-briefcase-fill",
            },
          ];
          metrics.forEach(({ id, title, data, key, icon }) => {
            if (data?.success) {
              const CTAmt = data.data.reduce((sum, item) => sum + (item?.CTAmt || 0), 0);
              const PTAmt = data.data.reduce((sum, item) => sum + (item?.PTAmt || 0), 0);
              const percentage = getPercentage(CTAmt, PTAmt);

              cardData.push({
                id,
                title,
                value: CTAmt,
                PTAmt,
                percentage,
                isGroth: percentage > 0,
                color: "text-warning",
                icon,
              });

              setListData((val) => ({
                ...val,
                [key]: data.data,
              }));
            }
          });
          setStats(cardData);


          if (AppointmentTrend?.success) {
            setValue((val) => ({ ...val, AppointmentTrend: AppointmentTrend?.data }))
          }
          if (BedOccupancy?.success) {
            setValue((val) => ({ ...val, BedOccupancy: BedOccupancy?.data }))
          }
          if (ReportTrend?.success) {
            setValue((val) => ({ ...val, ReportTrend: ReportTrend?.data?.filter((val) => val?.CardType === 3) }))
          }
          if (ClearanceTrend?.success) {
            setValue((val) => ({ ...val, ClearanceTrend: ClearanceTrend?.data?.filter((val) => val?.CardType === 2) }))
          }

          // let revenueTrend = []
          // if (revenueTrendReportData?.success) {
          //   const groupedData = revenueTrendReportData?.data.reduce((acc, item) => {
          //     const groupName = item.Group;
          //     if (!acc[groupName]) {
          //       acc[groupName] = 0;
          //     }
          //     acc[groupName] += item["Current Value"];
          //     return acc;
          //   }, {})
          //   const dataset = Object.keys(groupedData)?.map((key) => ({ group: key, revenue: groupedData[key], }))
          //   revenueTrend = [...dataset]
          // }

          // if (discountTrendReportData?.success) {
          //   const groupedData = discountTrendReportData?.data.reduce((acc, item) => {
          //     const groupName = item.Group;
          //     if (!acc[groupName]) {
          //       acc[groupName] = 0;
          //     }
          //     acc[groupName] += item["Current Value"];
          //     return acc;
          //   }, {})
          //   const updatedData = [...revenueTrend]
          //   Object.keys(groupedData)?.map((key) => {
          //     const index = updatedData?.findIndex((val) => val?.group === key)
          //     if (index !== -1) {
          //       updatedData[index] = { ...updatedData[index], discount: groupedData[key] }
          //     } else {
          //       updatedData[index] = { ...updatedData[index], discount: 0 }
          //     }
          //   })
          //   revenueTrend = [...updatedData]
          //   // setValue((val) => ({ ...val, revenueTrend: updatedData }))
          // }

          // if (OutstandingTrendReportData?.success) {
          //   const groupedData = OutstandingTrendReportData?.data.reduce((acc, item) => {
          //     const groupName = item.Group;
          //     if (!acc[groupName]) {
          //       acc[groupName] = 0;
          //     }
          //     acc[groupName] += item["Current Value"];
          //     return acc;
          //   }, {})
          //   const updatedData = [...revenueTrend]

          //   Object.keys(groupedData)?.map((key) => {
          //     const index = updatedData?.findIndex((val) => val?.group === key)
          //     if (index !== -1) {
          //       updatedData[index] = { ...updatedData[index], Outstanding: groupedData[key] }
          //     } else {
          //       updatedData[index] = { ...updatedData[index], Outstanding: 0 }
          //     }
          //   })
          //   revenueTrend = [...updatedData]
          // }

          // const updateedData = revenueTrend.map((val) => {
          //   if (!val?.discount) {
          //     val.discount = 0
          //   }
          //   if (!val?.Outstanding) {
          //     val.Outstanding = 0
          //   }
          //   return val
          // })
          // setValue((val) => ({ ...val, revenueTrend: updateedData }))



          let revenueTrendMap = new Map();

          // Step 1: Process Revenue Data
          if (revenueTrendReportData?.success) {
            revenueTrendReportData.data.forEach((item) => {
              const group = item.Group;
              const value = item["Current Value"];
              if (!revenueTrendMap.has(group)) {
                revenueTrendMap.set(group, { group, revenue: 0, discount: 0, Outstanding: 0 });
              }
              revenueTrendMap.get(group).revenue += value;
            });
          }

          // Step 2: Process Discount Data
          if (discountTrendReportData?.success) {
            discountTrendReportData.data.forEach((item) => {
              const group = item.Group;
              const value = item["Current Value"];
              if (!revenueTrendMap.has(group)) {
                revenueTrendMap.set(group, { group, revenue: 0, discount: 0, Outstanding: 0 });
              }
              revenueTrendMap.get(group).discount += value;
            });
          }

          // Step 3: Process Outstanding Data
          if (OutstandingTrendReportData?.success) {
            OutstandingTrendReportData.data.forEach((item) => {
              const group = item.Group;
              const value = item["Current Value"];
              if (!revenueTrendMap.has(group)) {
                revenueTrendMap.set(group, { group, revenue: 0, discount: 0, Outstanding: 0 });
              }
              revenueTrendMap.get(group).Outstanding += value;
            });
          }

          // Step 4: Convert Map to Array
          const updatedData = Array.from(revenueTrendMap.values());

          // Final Set
          setValue((val) => ({ ...val, revenueTrend: updatedData }));

        }
      );
    } catch (error) { }
  };

  const data = [
    { name: "Jan", uv: 4000, pv: 2400, amt: 2400 },
    { name: "Feb", uv: 3000, pv: 1398, amt: 2210 },
    { name: "Mar", uv: 2000, pv: 9800, amt: 2290 },
    { name: "Apr", uv: 2780, pv: 3908, amt: 2000 },
    { name: "May", uv: 1890, pv: 4800, amt: 2181 },
    { name: "Jun", uv: 2390, pv: 3800, amt: 2500 },
    { name: "Jul", uv: 3490, pv: 4300, amt: 2100 },
  ];

  useEffect(() => {
    getDatalist();
  }, []);

  const revenueData = [
    { month: "Jan", current: 50000, previous: 40000 },
    { month: "Feb", current: 60000, previous: 45000 },
    { month: "Mar", current: 55000, previous: 47000 },
    { month: "Apr", current: 70000, previous: 52000 },
  ];

  const patientDoctorData = [
    { doctor: "Dr. A", patients: 40, revenue: 25000 },
    { doctor: "Dr. B", patients: 30, revenue: 18000 },
    { doctor: "Dr. C", patients: 50, revenue: 32000 },
  ];

  const pieData = [
    { name: "OPD", value: 400 },
    { name: "IPD", value: 300 },
    { name: "Emergency", value: 300 },
    { name: "Lab", value: 200 },
  ];


  const areaData = [
    { date: "Mon", current: 1000, previous: 800 },
    { date: "Tue", current: 1200, previous: 1000 },
    { date: "Wed", current: 1400, previous: 1300 },
    { date: "Thu", current: 1700, previous: 1400 },
    { date: "Fri", current: 1600, previous: 1550 },
  ];
  const radarData = [
    { subject: "Surgery", A: 120, B: 110 },
    { subject: "Consultation", A: 98, B: 130 },
    { subject: "Diagnostics", A: 86, B: 130 },
    { subject: "Emergency", A: 99, B: 100 },
    { subject: "Pharmacy", A: 150, B: 200 },
  ];

  const ageWiseData = [
    { ageGroup: "0-18", count: 120 },
    { ageGroup: "19-35", count: 200 },
    { ageGroup: "36-50", count: 150 },
    { ageGroup: "51+", count: 100 },
  ];

  const doctorPerformanceData = [
    { name: "Dr. A", efficiency: 90, satisfaction: 80 },
    { name: "Dr. B", efficiency: 70, satisfaction: 95 },
    { name: "Dr. C", efficiency: 85, satisfaction: 88 },
  ];

  const scatterData = [
    { x: 1, y: 4000 },
    { x: 2, y: 4800 },
    { x: 3, y: 5100 },
    { x: 4, y: 6200 },
  ];

  const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#8dd1e1"];

  const customScatterData = [
    { x: 10, y: 2000 },
    { x: 20, y: 3200 },
    { x: 30, y: 2500 },
    { x: 40, y: 4000 },
    { x: 50, y: 3500 },
  ];

  return (
    <div className="p-6 grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 ">
      <div className="">
        <div
          className="row mb-2"
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "1rem",
            flexWrap: "wrap",
            // margin: "13px",
          }}
        >

          {stats.map((stat, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: "#f5f5f5",
                flex: "1 1 250px",
                minWidth: "250px",
                maxWidth: "300px",
              }}
            >
              <ProductivityWidget stat={stat} />
            </div>
          ))}
        </div>
      </div>

      <div className="row mx-1 ">
        <div className="col-lg-4 col-md-4 col-sm-6 col-12 bg-white p-1 rounded-2xl shadow-md">
          <div className="revenue-graph-box">
            <h2 className="text-xl font-bold mb-2 revenue_heading">
              Appointment Trend
            </h2>
            <div className="bg-white shadow rounded p-2 d-flex revenue-graph-box" style={{ flexWrap: "wrap" }}>
              {value?.AppointmentTrend?.filter((val) => val?.CardType === 2)?.map((val, idx) => (
                <GaugeWithNeedle value={val?.CurrentTrend?.split(" ")[0]} label={val?.TypeName} />
              ))}
            </div>
          </div>
        </div>
        <div className="col-lg-2 col-md-4 col-sm-6 col-12 bg-white p-1 rounded-2xl shadow-md ">
          <div className="revenue-graph-box">
            <h2 className="text-xl font-bold mb-2 revenue_heading">
              Bed Occupancy
            </h2>
            <div className="bg-white shadow rounded p-2 d-flex revenue-graph-box" style={{ flexWrap: "wrap" }}>
              {value?.BedOccupancy?.filter((val) => val?.TypeID === 36 || val?.TypeID === 37)?.map((val, idx) => (
                <GaugeWithNeedle value={val?.CurrentTrend?.split(" ")[0]} label={val?.TypeName} />
              ))}
            </div>
          </div>
        </div>

        <div className="col-lg-6 col-md-4 col-sm-6 col-12 bg-white p-1 rounded-2xl shadow-md ">
          <div className="revenue-graph-box">
            <h2 className="text-xl font-bold mb-2 revenue_heading">
              Clearance Trend
            </h2>
            <div className="bg-white shadow rounded p-2 d-flex revenue-graph-box" style={{ flexWrap: "wrap" }}>
              {value?.ClearanceTrend?.map((val, idx) => (
                <GaugeWithNeedle value={val?.CurrentTrend?.split(" ")[0]} label={val?.TypeName} />
              ))}
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6 col-12 bg-white p-1 rounded-2xl shadow-md">
          <div className="revenue-graph-box">
            <h2 className="text-xl font-bold mb-2 revenue_heading">
              Departmental Revenue Share
            </h2>
            <ResponsiveContainer width="95%" height={250}>
              <PieChart width={350} height={250}>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={colors[index % colors.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="col-lg-9  col-12 bg-white p-1 rounded-2xl shadow-md ">
          <div className="revenue-graph-box">
            <h2 className="text-xl font-bold mb-2 revenue_heading">
              Revenue Trend
            </h2>
            <ResponsiveContainer width="99%" height={250}>
              <AreaChart
                // width={670}
                // width={getChartWidth(windowSize?.width)}
                // height={250}
                data={value?.revenueTrend}
              >
                <defs>
                  <linearGradient id="RevenueTrendColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FFBB28" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#FFBB28" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="Discount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="red" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="red" stopOpacity={0} />
                  </linearGradient>

                  <linearGradient id="OutstandingColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00C49F" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#00C49F" stopOpacity={0} />
                  </linearGradient>

                </defs>
                <XAxis dataKey="group" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#FFBB28"
                  fillOpacity={1}
                  fill="url(#RevenueTrendColor)"
                  name=" Revenue Trend"
                />
                <Area
                  type="monotone"
                  dataKey="discount"
                  stroke="red"
                  fillOpacity={1}
                  fill="url(#Discount)"
                  name="Discount"
                />
                <Area
                  type="monotone"
                  dataKey="Outstanding"
                  stroke="#00C49F"
                  fillOpacity={1}
                  fill="url(#OutstandingColor)"
                  name="Outstanding Trend"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="col-lg-8 col-md-6 col-12 bg-white p-1 rounded-2xl shadow-md">
          <div className="revenue-graph-box">
            <h2 className="text-xl font-bold mb-2 revenue_heading">
              Patient Age Group
            </h2>
            <ResponsiveContainer width="95%" height={250}>
              <BarChart
                data={data}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
                barSize={20}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                {/* Each Bar with stackId="a" makes it stacked */}
                <Bar
                  dataKey="uv"
                  stackId="a"
                  fill="#8884d8"
                  radius={[3, 3, 0, 0]}
                />
                <Bar
                  dataKey="pv"
                  stackId="a"
                  fill="#82ca9d"
                  radius={[3, 3, 0, 0]}
                />
                <Bar
                  dataKey="amt"
                  stackId="a"
                  fill="#ffc658"
                  radius={[3, 3, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>


        <div className="col-lg-4 col-md-8 col-12 bg-white p-1 rounded-2xl shadow-md ">
          <div className="revenue-graph-box">
            <h2 className="text-xl font-bold mb-2 revenue_heading">
              Custom Scatter Revenue Chart
            </h2>
            <ResponsiveContainer width="95%" height={250}>
              <ScatterChart
                width={350}
                height={250}
                margin={{ top: 20, right: 20, bottom: 10, left: 10 }}
              >
                <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                <XAxis type="number" dataKey="x" name="Time" unit="min" />
                <YAxis type="number" dataKey="y" name="Revenue" unit="₹" />
                <ZAxis range={[100]} />
                <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                <Scatter
                  name="Revenue Scatter"
                  data={customScatterData}
                  fill="#8884d8"
                  shape="circle"
                />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="col-lg-4 col-md-6 col-12 bg-white p-1 rounded-2xl shadow-md">
          <div className="revenue-graph-box">
            <h2 className="text-xl font-bold mb-2 revenue_heading">
              Patient Age Group
            </h2>
            <ResponsiveContainer width="95%" height={250}>
              <BarChart
                width={800}
                height={250}
                data={ageWiseData}
                barSize={20}
              >
                <XAxis dataKey="ageGroup" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8dd1e1" radius={[7, 7, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="col-lg-8 col-md-6 col-12 bg-white p-1 rounded-2xl shadow-md">
          <div className="revenue-graph-box">
            <h2 className="text-xl font-bold mb-2 revenue_heading">
              Revenue Comparison
            </h2>
            <ResponsiveContainer width="95%" height={250}>
              <BarChart
                width={800}
                height={250}
                data={revenueData}
                barSize={10}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="previous"
                  fill="#8884d8"
                  name="Previous Year"
                  radius={[10, 10, 0, 0]} // top-left, top-right, bottom-right, bottom-left
                />
                <Bar
                  dataKey="current"
                  fill="#82ca9d"
                  name="Current Year"
                  radius={[10, 10, 0, 0]} // rounded at top only
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>



        <div className="col-lg-8 col-md-6 col-12 bg-white p-1 rounded-2xl shadow-md">
          <div className="revenue-graph-box">
            <h2 className="text-xl font-bold mb-2 revenue_heading">
              Doctor Wise Revenue
            </h2>
            <ResponsiveContainer width="95%" height={250}>
              <LineChart width={800} height={250} data={patientDoctorData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="doctor" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#ff8042" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="col-lg-4 col-md-6 col-12 bg-white p-1 rounded-2xl shadow-md">
          <div className="revenue-graph-box">
            <h2 className="text-xl font-bold mb-2 revenue_heading">
              Patient Count per Doctor
            </h2>
            <ResponsiveContainer width="95%" height={250}>
              <BarChart
                width={350}
                height={250}
                data={patientDoctorData}
                barSize={20}
              >
                <XAxis dataKey="doctor" />
                <YAxis />
                <Tooltip />
                <Bar
                  dataKey="patients"
                  fill="#ffc658"
                  radius={[10, 10, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>



        <div className="col-lg-8 col-md-6 col-12 bg-white p-1 rounded-2xl shadow-md">
          <div className="revenue-graph-box">
            <h2 className="text-xl font-bold mb-2 revenue_heading">
              Doctor Efficiency & Satisfaction
            </h2>
            <ResponsiveContainer width="95%" height={250}>
              <ComposedChart
                width={800}
                height={250}
                data={doctorPerformanceData}
              >
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="efficiency" barSize={20} fill="#8884d8" />
                <Line type="monotone" dataKey="satisfaction" stroke="#82ca9d" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>



        <div className="col-lg-4 col-md-6 col-12 bg-white p-1 rounded-2xl shadow-md">
          <div className="revenue-graph-box">
            <h2 className="text-xl font-bold mb-2 revenue_heading">
              Performance Metrics
            </h2>
            <ResponsiveContainer width="95%" height={250}>
              <RadarChart
                cx="50%"
                cy="50%"
                outerRadius={90}
                width={350}
                height={250}
                data={radarData}
              >
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis />
                <Radar
                  name="Dept A"
                  dataKey="A"
                  stroke="#82ca9d"
                  fill="#82ca9d"
                  fillOpacity={0.6}
                />
                <Radar
                  name="Dept B"
                  dataKey="B"
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={0.6}
                />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="col-lg-4 col-md-6 col-12 bg-white p-1 rounded-2xl shadow-md">
          <div className="revenue-graph-box">
            <h2 className="text-xl font-bold mb-2 revenue_heading">
              Scatter Revenue Points
            </h2>
            <ResponsiveContainer width="95%" height={250}>
              <ScatterChart width={350} height={250}>
                <CartesianGrid />
                <XAxis type="number" dataKey="x" name="Time" />
                <YAxis type="number" dataKey="y" name="Revenue" />
                <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                <Scatter
                  name="Revenue Points"
                  data={scatterData}
                  fill="#ff8042"
                />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="col-lg-8 col-md-6 col-12 bg-white p-1 rounded-2xl shadow-md col-span-full">
          <div className="revenue-graph-box">
            <h2 className="text-xl font-bold mb-2 revenue_heading">
              Cumulative Revenue Growth
            </h2>
            <ResponsiveContainer width="95%" height={250}>
              <LineChart width={800} height={250} data={revenueData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="previous" stroke="#8884d8" />
                <Line type="monotone" dataKey="current" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="col-lg-4 col-md-6 col-12 bg-white p-1 rounded-2xl shadow-md">
          <div className="revenue-graph-box">
            <h2 className="text-xl font-bold mb-2 revenue_heading">
              Patient Age Group
            </h2>
            <ResponsiveContainer width="95%" height={250}>
              <BarChart
                data={data}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
                barSize={20}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                {/* Each Bar with stackId="a" makes it stacked */}
                <Bar
                  dataKey="uv"
                  stackId="a"
                  fill="#8884d8"
                  radius={[3, 3, 0, 0]}
                />
                <Bar
                  dataKey="pv"
                  stackId="a"
                  fill="#82ca9d"
                  radius={[3, 3, 0, 0]}
                />
                <Bar
                  dataKey="amt"
                  stackId="a"
                  fill="#ffc658"
                  radius={[3, 3, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="col-lg-8 col-md-6 col-12 bg-white p-1 rounded-2xl shadow-md">
          <MyMap />
        </div>

        <div className="col-lg-4 col-md-4 col-12 bg-white p-1 rounded-2xl shadow-md ">
          <div className="revenue-graph-box">
            <h2 className="text-xl font-bold mb-2 revenue_heading">
              Report Trend
            </h2>
            <div className="bg-white shadow rounded p-2 d-flex revenue-graph-box" style={{ flexWrap: "wrap" }}>

              {value?.ReportTrend?.map((val, idx) => (
                <GaugeWithNeedle value={val?.CurrentTrend?.split(" ")[0]} label={val?.TypeName} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductivityWidget({ stat }) {
  return (
    <div className="productivity-widget-container">
      <div
        className={stat?.percentage === 0 ? "productivity-widget-nutral" : stat?.isGroth ? "productivity-widget" : "productivity-widget-loss"}
        style={{ height: "128px" }}
      >
        <div className="widget-header">
          <h2 className="widget-title">
            {stat?.title} <span className="widget-title-secondary"></span>
          </h2>
        </div>

        <div className="widget-content">
          <div className="metrics-section">
            <div className="main-metric">
              <span className="main-metric-value">
                ₹ {formatIndianCurrency(stat?.value)}
              </span>
            </div>

            <div className="percentage-change">
              <div className="percentage-icon">
                {stat?.percentage === 0 ?
                  <div className="percentage-icon" style={{ background: "#9c9595" }}>
                    --
                  </div>
                  :
                  stat?.isGroth ? <GrowthGraphSVGICON /> : <div className="percentage-icon-red"><LossGraphSVGICON /> </div>}
              </div>
              <span
                className="percentage-value"
                style={{ color: stat?.percentage === 0 ? "black" : stat?.isGroth ? "green" : "red" }}
              >
                {formatIndianCurrency(stat?.PTAmt)}
              </span>
              <span className="percentage-label">last Month</span>
            </div>
          </div>
          <div className="chart-container">
            <div className="chart-wrapper">
              <div
                className="chart-percentage"
                style={{ color: stat?.percentage === 0 ? "black" : stat?.isGroth ? "green" : "red" }}
              >
                {stat?.percentage}%
              </div>

              {stat?.percentage === 0 ? <NutralGraph /> : stat?.isGroth ? <GrothChart /> : <LossChart />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
