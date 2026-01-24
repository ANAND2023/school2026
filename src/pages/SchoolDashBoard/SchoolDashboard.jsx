// import { Container, Row, Col, Card, Table, Badge, Spinner } from "react-bootstrap";
// import StatsCard from "./StatsCard";
// import VacancyChart from "./VacancyChart";
// import PrincipalChart from "./PrincipalChart";
// import FeesChart from "./FeesChart";
// import AttendanceMeter from "./AttendanceMeter";
// import GenderRatioChart from "./GenderRatioChart";
// import ClassWiseStudentChart from "./ClassWiseStudentChart";
// import EnquiryDashboard from "./EnquiryDashboard";
// import AccountantDashboard from "./AccountantDashboard";
// import { getadmissionlist } from "../../networkServices/School/RegistrationApi";
// import { useEffect, useState, useMemo } from "react";
// import { GetAllUsers } from "../../networkServices/Admin";
// import { useLocalStorage } from "../../utils/hooks/useLocalStorage";
// import { GetAttendance } from "../../networkServices/School/Attendance";
// import moment from "moment";

// const SchoolDashboard = () => {
//   const localData = useLocalStorage("userData", "get");
//   const [studentList, setStudentList] = useState([]);
//   const [userAttendanceData, setUserAttendanceData] = useState([]);
//   const [userList, setUserList] = useState([]);
//   const [loading, setLoading] = useState(false);

//   // 1. Fetch Students
//   const handleSearch = async () => {
//     const payload = {
//       sessionId: null,
//       branchId: localData?.defaultCentre,
//       classId: null,
//       page: 1,
//       pageSize: 100,
//     };
//     try {
//       const response = await getadmissionlist(payload);
//       if (response?.success) setStudentList(response?.data || []);
//     } catch (error) {
//       console.error("Student Fetch Error:", error);
//     }
//   };

//   // 2. Fetch Attendance (Current Month/Year)
//   const fetchAttendance = async (month, year) => {
//     try {
//       const payload = {
//         orgId: localData?.OrganizationId,
//         branchId: localData?.defaultCentre,
//         teacherId: null,
//         month: month,
//         year: year,
//       };
//       const res = await GetAttendance(payload);
//       if (res?.success) {
//         setUserAttendanceData(res?.data || []);
//       }
//     } catch (error) {
//       console.error("Attendance Fetch Error:", error);
//     }
//   };

//   // 3. Fetch All Staff/Users
//   const getAllUsers = async () => {
//     setLoading(true);
//     const payload = {
//       pageNumber: 1,
//       pageSize: 50,
//       search: null,
//       lockedOnly: false,
//     };
//     try {
//       const res = await GetAllUsers(payload);
//       if (res?.success) {
//         setUserList(res?.data?.items || []);
//       }
//     } catch (error) {
//       notify("Failed to load staff list", "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Logic: Combine User List with Today's Attendance
//   const staffAttendanceSummary = useMemo(() => {
//     const today = moment().format("YYYY-MM-DD");
//     return userList.map((user) => {
//       // Finding if this user has an attendance record for today
//       const attendanceRecord = userAttendanceData.find(
//         (att) => 
//           att.teacherId === user.id && 
//           moment(att.attendanceDate).format("YYYY-MM-DD") === today
//       );

//       return {
//         id: user.id,
//         name: user.fullName || user.userName,
//         email: user.email,
//         isPresent: !!attendanceRecord,
//         loginTime: attendanceRecord?.loginDateTime 
//           ? moment(attendanceRecord.loginDateTime).format("hh:mm A") 
//           : "—",
//       };
//     });
//   }, [userList, userAttendanceData]);

//   const presentCount = staffAttendanceSummary.filter(s => s.isPresent).length;

//   useEffect(() => {
//     handleSearch();
//     getAllUsers();
//     fetchAttendance(moment().format("MM"), moment().format("YYYY"));
//   }, [localData?.defaultCentre]);

//   return (
//     <Container fluid className="py-3 bg-light">
//       {/* Metrics Section */}
//       <Row className="g-3 mb-4">
//         <StatsCard title="Total Admission" value={studentList?.length} textColor="primary" />
//         <StatsCard title="Total Staff" value={userList?.length} textColor="warning" />
//         <StatsCard title="Staff Present" value={presentCount} textColor="success" />
//         <StatsCard title="Staff Absent" value={userList.length - presentCount} textColor="danger" />
//         <StatsCard title="Enquiries" value="45" textColor="info" />
//         <StatsCard title="Fees Collected" value="₹ 2.5L" textColor="secondary" />
//       </Row>

//       <Row className="g-4">
//         {/* Main Dashboard Content (Left) */}
//         <Col lg={8} xl={9}>
//           <Row className="g-4 mb-4">
//             <Col md={5}>
//               <Card className="shadow-sm border-0 h-100">
//                 <Card.Body>
//                   <Card.Title className="fw-bold mb-3">User Distribution</Card.Title>
//                   <PrincipalChart />
//                 </Card.Body>
//               </Card>
//             </Col>
//             <Col md={7}>
//               <Card className="shadow-sm border-0 h-100">
//                 <Card.Body>
//                   <Card.Title className="fw-bold mb-3">Revenue Overview</Card.Title>
//                   <FeesChart />
//                 </Card.Body>
//               </Card>
//             </Col>
//           </Row>

//           <Row className="mb-4">
//             <Col md={12}>
//               <EnquiryDashboard />
//             </Col>
//           </Row>

//           <Row>
//             <Col md={12}>
//               <AccountantDashboard />
//             </Col>
//           </Row>
//         </Col>

//         {/* Live Attendance Sidebar (Right) */}
//         <Col lg={4} xl={3}>
//           <Card className="shadow-sm border-0 sticky-top" style={{ top: "20px", maxHeight: "90vh" }}>
//             <Card.Header className="bg-white border-0 py-3 d-flex justify-content-between align-items-center">
//               <div>
//                 <h6 className="mb-0 fw-bold">Staff Login Status</h6>
//                 <small className="text-muted">{moment().format("MMMM Do, YYYY")}</small>
//               </div>
//               <Badge bg="primary" pill>{presentCount} Online</Badge>
//             </Card.Header>
//             <Card.Body className="p-0 overflow-auto" style={{ maxHeight: "calc(90vh - 100px)" }}>
//               {loading ? (
//                 <div className="text-center p-4"><Spinner animation="border" size="sm" /></div>
//               ) : (
//                 <Table hover responsive className="mb-0 border-top">
//                   <thead className="bg-light">
//                     <tr>
//                       <th className="small fw-bold px-3">Staff Name</th>
//                       <th className="small fw-bold text-center">Status</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {staffAttendanceSummary.map((staff) => (
//                       <tr key={staff.id} className="align-middle">
//                         <td className="px-3">
//                           <div className="fw-semibold small">{staff.name}</div>
//                           <div className="text-muted" style={{ fontSize: "10px" }}>
//                             {staff.isPresent ? `In: ${staff.loginTime}` : staff.email}
//                           </div>
//                         </td>
//                         <td className="text-center">
//                           <Badge 
//                             bg={staff.isPresent ? "success" : "light"} 
//                             text={staff.isPresent ? "white" : "dark"}
//                             className="border"
//                             style={{ width: "65px" }}
//                           >
//                             {staff.isPresent ? "Present" : "Absent"}
//                           </Badge>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </Table>
//               )}
//             </Card.Body>
//             <Card.Footer className="bg-white border-0 text-center py-2">
//               <small className="text-primary" style={{ cursor: "pointer" }}>View Detailed Report</small>
//             </Card.Footer>
//           </Card>
//         </Col>
//       </Row>
//     </Container>
//   );
// };

// export default SchoolDashboard;
import { Container, Row, Col, Card, Badge, Table, Spinner } from "react-bootstrap";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";

import StatsCard from "./StatsCard";
import PrincipalChart from "./PrincipalChart";
import FeesChart from "./FeesChart";
import AttendanceMeter from "./AttendanceMeter";
import GenderRatioChart from "./GenderRatioChart";
import ClassWiseStudentChart from "./ClassWiseStudentChart";
import EnquiryDashboard from "./EnquiryDashboard";
import AccountantDashboard from "./AccountantDashboard";

import { getadmissionlist } from "../../networkServices/School/RegistrationApi";
import { GetAllUsers } from "../../networkServices/Admin";
import { GetAttendance } from "../../networkServices/School/Attendance";
import { useLocalStorage } from "../../utils/hooks/useLocalStorage";
import StaffAttendanceReport from "./StaffAttendanceReport";

const SchoolDashboard = () => {
  const navigate = useNavigate();
  const localData = useLocalStorage("userData", "get");

  const [studentList, setStudentList] = useState([]);
  const [userList, setUserList] = useState([]);
  const [userAttendanceData, setUserAttendanceData] = useState([]);
  const [loading, setLoading] = useState(false);

  // ================= STUDENTS =================
  const handleSearch = async () => {
    const payload = {
      branchId: localData?.defaultCentre,
      classId: null,
      page: 1,
      pageSize: 100,
    };

    try {
      const res = await getadmissionlist(payload);
      if (res?.success) {
        setStudentList(res?.data || []);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // ================= USERS =================
  const getAllUsers = async () => {
    try {
      const payload = {
        pageNumber: 1,
        pageSize: 100,
        search: null,
        lockedOnly: false,
      };

      const res = await GetAllUsers(payload);
      if (res?.success) {
        setUserList(res?.data?.items || []);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // ================= ATTENDANCE =================
  const fetchAttendance = async (month, year) => {
    setLoading(true);
    try {
      const payload = {
        orgId: localData?.OrganizationId,
        branchId: localData?.defaultCentre,
        teacherId: null,
        month,
        year,
      };

      const res = await GetAttendance(payload);
      if (res?.success) {
        setUserAttendanceData(res?.data || []);
      } else {
        setUserAttendanceData([]);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // ================= ATTENDANCE SUMMARY =================
  const staffAttendanceSummary = useMemo(() => {
    const today = moment().format("YYYY-MM-DD");

    return userList.map((user) => {
      const attendanceRecord = userAttendanceData.find(
        (att) =>
          att.teacherId === user.id &&
          moment(att.attendanceDate).format("YYYY-MM-DD") === today
      );

      return {
        id: user.id,
        name: user.fullName || user.userName,
        email: user.email,
        isPresent: !!attendanceRecord,
        loginTime: attendanceRecord?.loginDateTime
          ? moment(attendanceRecord.loginDateTime).format("hh:mm A")
          : "—",
      };
    });
  }, [userList, userAttendanceData]);

  const presentCount = staffAttendanceSummary.filter(
    (s) => s.isPresent
  ).length;

  // ================= EFFECTS =================
  useEffect(() => {
    handleSearch();
    getAllUsers();
    fetchAttendance(moment().format("MM"), moment().format("YYYY"));
  }, [localData?.defaultCentre]);

  // ================= UI =================
  return (
    <Container fluid>
      {/* STATS */}
      {/* <Row className="g-3 mb-4">
        <StatsCard title="Admissions" value={studentList.length} />
        <StatsCard title="Students" value={studentList.length} />
        <StatsCard title="Teachers" value={userList.length} />
        <StatsCard title="Present Teachers" value={presentCount} />
      </Row> */}
      <Row className="g-3 mb-4">
        <StatsCard title="Admission" value={studentList?.length ?? 0} textColor="primary" />
        <StatsCard title="Students" value={studentList?.length ?? 0} textColor="success" />
        <StatsCard title="Teacher" value={userList?.length ?? 0} textColor="warning" />
        <StatsCard title="Staff" value="12" textColor="info" />
        <StatsCard title="Present Student" value="600" textColor="danger" />
        <StatsCard title="Present Teacher" value="28" textColor="secondary" />
      </Row>
      {/* CHARTS */}
      <Row className="g-3 mb-4">
        <Col md={4}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title>User / Student</Card.Title>
              <PrincipalChart />
            </Card.Body>
          </Card>
        </Col>

        <Col md={8}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title>Fees</Card.Title>
              <FeesChart />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-3 mb-4">
        <Col md={4}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title>Attendance</Card.Title>
              <AttendanceMeter />
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title>Gender Ratio</Card.Title>
              <GenderRatioChart />
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title>Students</Card.Title>
              <ClassWiseStudentChart />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* ENQUIRY */}
      <Row className="mb-4">
        <Col md={12}>
          <Card>
            <Card.Body>
              <EnquiryDashboard />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* ACCOUNTANT */}
      <Row className="mb-4">
        <Col md={12}>
          <Card>
            <Card.Body>
              <AccountantDashboard />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* STAFF LOGIN STATUS */}
      {/* <Row>
        <Col lg={4} xl={3}>
          <Card className="shadow-sm border-0 sticky-top" style={{ top: 20 }}>
            <Card.Header className="bg-white border-0 d-flex justify-content-between">
              <div>
                <h6 className="fw-bold mb-0">Staff Login Status</h6>
                <small className="text-muted">
                  {moment().format("MMMM Do, YYYY")}
                </small>
              </div>
              <Badge bg="success">{presentCount} Online</Badge>
            </Card.Header>

            <Card.Body className="p-0">
              {loading ? (
                <div className="text-center p-4">
                  <Spinner size="sm" />
                </div>
              ) : (
                <Table hover responsive className="mb-0">
                  <tbody>
                    {staffAttendanceSummary.map((staff) => (
                      <tr key={staff.id}>
                        <td>
                          <div className="fw-semibold">{staff.name}</div>
                          <small className="text-muted">
                            {staff.isPresent
                              ? `In: ${staff.loginTime}`
                              : staff.email}
                          </small>
                        </td>
                        <td className="text-center">
                          <Badge
                            bg={staff.isPresent ? "success" : "secondary"}
                          >
                            {staff.isPresent ? "Present" : "Absent"}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>

            <Card.Footer className="bg-white text-center">
              <small
                className="text-primary"
                style={{ cursor: "pointer" }}
                onClick={() => navigate("/staff-attendance-report")}
              >
                View Detailed Report
              </small>
            </Card.Footer>
          </Card>
        </Col>
      </Row> */}
      <StaffAttendanceReport/>
    </Container>
  );
};

export default SchoolDashboard;


// import { Container, Row, Col, Card, Badge,Table } from "react-bootstrap";
// import StatsCard from "./StatsCard";
// import VacancyChart from "./VacancyChart";
// import PrincipalChart from "./PrincipalChart";
// import FeesChart from "./FeesChart";
// import AttendanceMeter from "./AttendanceMeter";
// import GenderRatioChart from "./GenderRatioChart";
// import ClassWiseStudentChart from "./ClassWiseStudentChart";
// import EnquiryDashboard from "./EnquiryDashboard";
// import AccountantDashboard from "./AccountantDashboard";
// import { getadmissionlist } from "../../networkServices/School/RegistrationApi";
// import { useEffect, useMemo, useState } from "react";
// import { GetAllUsers } from "../../networkServices/Admin";
// import { useLocalStorage } from "../../utils/hooks/useLocalStorage";
// import { GetAttendance } from "../../networkServices/School/Attendance";
// import moment from "moment";

// const SchoolDashboard = () => {
//   const localData = useLocalStorage("userData", "get");
//   const [studentList, setStudentList] = useState(0)
//   const [userAttendanceData, setUserAttendanceData] = useState([])
//   console.log("userAttendanceData", userAttendanceData)
//   const [userList, setUserList] = useState([])
//   const [loading, setLoading] = useState(false);
//   const handleSearch = async () => {
//     const payload =

//     {
//       "sessionId": null,
//       "branchId": localData?.defaultCentre,
//       //   "classId": "",
//       //   "sessionId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
//       //   "branchId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
//       "classId": null,
//       "fromDate": null,
//       "toDate": null,
//       "studentId": null,
//       "admissionNo": null,
//       "rollNumber": null,
//       "firstName": null,
//       "page": 1,
//       "pageSize": 100
//     }
    

//     try {
//       const response = await getadmissionlist(payload);
//       if (response?.success) {
//         setStudentList(response?.data);

//       }
//       else {
  
//       }
//     } catch (error) {
//       console.log("error", error)
//     }
//   }


//   const fetchAttendance = async (month, year) => {
//     ;
//     try {
//       const payload = {
//         orgId: userData?.OrganizationId,
//         branchId: userData?.defaultCentre,
//         teacherId: null,
//         month: month,
//         year: year,
//       };
//       const res = await GetAttendance(payload);
//       if (res?.success) {
//         setUserAttendanceData(res?.data);
//       } else {
//         setUserAttendanceData([]);
//       }
//     } catch (error) { }
//   };


//   const getAllUsers = async () => {
//     const payload = {
//       "pageNumber": 1,
//       "pageSize": 30,
//       "search": null,
//       "lockedOnly": false
//     }

//     try {
//       const res = await GetAllUsers(payload);

//       // 🔴 demo purpose (remove this block when API ready)
//       //   const res = { success: true };

//       if (res?.success) {
//         notify(res?.message, "success");
//         setUserList(res?.data?.items || []);

//       } else {
//         notify(res?.message || "Failed", "error");
//       }
//     } catch (error) {
//       notify("Something went wrong", "error");
//     }
//   };
//   const staffAttendanceSummary = useMemo(() => {
//     const today = moment().format("YYYY-MM-DD");
//     return userList.map((user) => {
//       // Finding if this user has an attendance record for today
//       const attendanceRecord = userAttendanceData.find(
//         (att) => 
//           att.teacherId === user.id && 
//           moment(att.attendanceDate).format("YYYY-MM-DD") === today
//       );

//       return {
//         id: user.id,
//         name: user.fullName || user.userName,
//         email: user.email,
//         isPresent: !!attendanceRecord,
//         loginTime: attendanceRecord?.loginDateTime 
//           ? moment(attendanceRecord.loginDateTime).format("hh:mm A") 
//           : "—",
//       };
//     });
//   }, [userList, userAttendanceData]);

//   const presentCount = staffAttendanceSummary.filter(s => s.isPresent).length;

//   useEffect(() => {
//     handleSearch();
//     getAllUsers();
//     fetchAttendance(moment().format("MM"), moment().format("YYYY"));
//   }, [localData?.defaultCentre]);


//   useEffect(() => {
//     // handleSearch();
//     getAllUsers();
//   }, [])
//   return (
//     <Container fluid className="">
//       <Row className="g-3 mb-4">
//         <StatsCard title="Admission" value={studentList?.length ?? 0} textColor="primary" />
//         <StatsCard title="Students" value={studentList?.length ?? 0} textColor="success" />
//         <StatsCard title="Teacher" value={userList?.length ?? 0} textColor="warning" />
//         <StatsCard title="Staff" value="12" textColor="info" />
//         <StatsCard title="Present Student" value="600" textColor="danger" />
//         <StatsCard title="Present Teacher" value="28" textColor="secondary" />
//       </Row>

     
//       <Row className="g-3 mb-4">
//         <Col md={4}>
//           <Card className="shadow-sm">
//             <Card.Body>
//               <Card.Title>User/Student</Card.Title>
//               <PrincipalChart />
//             </Card.Body>
//           </Card>
//         </Col>

//         <Col md={8}>
//           <Card className="shadow-sm">
//             <Card.Body>
//               <Card.Title>Fees</Card.Title>
//               {/* <VacancyChart /> */}
//               <FeesChart />
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>
//       <Row className="g-4 mb-4">
//         <Col md={4}>
//           <Card className="shadow-sm">
//             <Card.Body>
//               <Card.Title>Attendance</Card.Title>
//               <AttendanceMeter />
//             </Card.Body>
//           </Card>
//         </Col>
//         <Col md={4}>
//           <Card className="shadow-sm">
//             <Card.Body>
//               <Card.Title>Gender Ratio</Card.Title>
//               <GenderRatioChart />
//             </Card.Body>
//           </Card>
//         </Col>

//         <Col md={4}>
//           <Card className="shadow-sm">
//             <Card.Body>
//               <Card.Title>Student</Card.Title>

//               <ClassWiseStudentChart />
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>
//       <Row className="g-4 mb-4">
//         <Col md={12}>
//           <Card
//           // className="shadow-sm"
//           >
//             <Card.Body>
//               {/* <Card.Title>Enquiry</Card.Title> */}
//               <EnquiryDashboard />
//             </Card.Body>
//           </Card>
//         </Col>

//       </Row>
//       <Row className="g-4 mb-4">
//         <Col md={12}>
//           <Card
//           // className="shadow-sm"
//           >
//             <Card.Body>
//               {/* <Card.Title>Enquiry</Card.Title> */}
//               <AccountantDashboard />
//             </Card.Body>
//           </Card>
//         </Col>

//       </Row>
//  <Col lg={4} xl={3}>
//           <Card className="shadow-sm border-0 sticky-top" style={{ top: "20px", maxHeight: "90vh" }}>
//             <Card.Header className="bg-white border-0 py-3 d-flex justify-content-between align-items-center">
//               <div>
//                 <h6 className="mb-0 fw-bold">Staff Login Status</h6>
//                 <small className="text-muted">{moment().format("MMMM Do, YYYY")}</small>
//               </div>
//               <Badge bg="primary" pill>{presentCount} Online</Badge>
//             </Card.Header>
//             <Card.Body className="p-0 overflow-auto" style={{ maxHeight: "calc(90vh - 100px)" }}>
//               {loading ? (
//                 <div className="text-center p-4"><Spinner animation="border" size="sm" /></div>
//               ) : (
//                 <Table hover responsive className="mb-0 border-top">
//                   <thead className="bg-light">
//                     <tr>
//                       <th className="small fw-bold px-3">Staff Name</th>
//                       <th className="small fw-bold text-center">Status</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {staffAttendanceSummary.map((staff) => (
//                       <tr key={staff.id} className="align-middle">
//                         <td className="px-3">
//                           <div className="fw-semibold small">{staff.name}</div>
//                           <div className="text-muted" style={{ fontSize: "10px" }}>
//                             {staff.isPresent ? `In: ${staff.loginTime}` : staff.email}
//                           </div>
//                         </td>
//                         <td className="text-center">
//                           <Badge 
//                             bg={staff.isPresent ? "success" : "light"} 
//                             text={staff.isPresent ? "white" : "dark"}
//                             className="border"
//                             style={{ width: "65px" }}
//                           >
//                             {staff.isPresent ? "Present" : "Absent"}
//                           </Badge>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </Table>
//               )}
//             </Card.Body>
//             <Card.Footer className="bg-white border-0 text-center py-2">
//               <small className="text-primary" style={{ cursor: "pointer" }}>View Detailed Report</small>
//             </Card.Footer>
//           </Card>
//         </Col>
//     </Container>
//   );
// };

// export default SchoolDashboard;
