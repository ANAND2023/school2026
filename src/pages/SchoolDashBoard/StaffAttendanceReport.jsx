import { Card, Container, Table, Badge, Row, Col, InputGroup, Form } from "react-bootstrap";
import { useEffect, useMemo, useState } from "react";
import moment from "moment";
import { Users, CheckCircle, XCircle, Clock, Search, Filter } from "lucide-react";

// Assuming these are your service imports
import { GetAttendance } from "../../networkServices/School/Attendance";
import { GetAllUsers } from "../../networkServices/Admin";
import { useLocalStorage } from "../../utils/hooks/useLocalStorage";

const StaffAttendanceReport = () => {
  const localData = useLocalStorage("userData", "get");
  const [attendanceData, setAttendanceData] = useState([]);
  const [userList, setUserList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchData = async () => {
    const attendanceRes = await GetAttendance({
      orgId: localData?.OrganizationId,
      branchId: localData?.defaultCentre,
      teacherId: null,
      month: moment().format("MM"),
      year: moment().format("YYYY"),
    });

    if (attendanceRes?.success) setAttendanceData(attendanceRes.data || []);

    const usersRes = await GetAllUsers({ pageNumber: 1, pageSize: 100 });
    if (usersRes?.success) setUserList(usersRes.data?.items || []);
  };

  const tableData = useMemo(() => {
    const today = moment().format("YYYY-MM-DD");
    let data = userList.map(user => {
      const record = attendanceData.find(
        att => att.teacherId === user.id && moment(att.attendanceDate).format("YYYY-MM-DD") === today
      );
      return {
        name: user.fullName || user.userName,
        email: user.email,
        status: !!record,
        loginTime: record?.loginDateTime ? moment(record.loginDateTime).format("hh:mm A") : "-",
      };
    });

    if (searchTerm) {
      data = data.filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    return data;
  }, [userList, attendanceData, searchTerm]);

  const stats = {
    total: tableData.length,
    present: tableData.filter(u => u.status).length,
    absent: tableData.filter(u => !u.status).length,
  };

  useEffect(() => { fetchData(); }, []);

  return (
    <Container fluid className="px-4 py-4" style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
      
      {/* --- HEADER --- */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <div>
          <h4 className="fw-bold text-dark mb-0">Staff Attendance Report</h4>
          <p className="text-muted small mb-0">Showing records for {moment().format("DD MMM, YYYY")}</p>
        </div>
        {/* <div className="d-flex gap-2">
          <InputGroup className="shadow-sm" style={{ maxWidth: "300px" }}>
            <InputGroup.Text className="bg-white border-end-0 text-muted">
              <Search size={16} />
            </InputGroup.Text>
            <Form.Control
              placeholder="Search staff name..."
              className="border-start-0 ps-0 form-control-sm"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </div> */}
      </div>

      {/* --- STATS CARDS --- */}
      <Row className="mb-4 g-3">
        {[
          { title: "Total Staff", val: stats.total, icon: <Users />, color: "#4e73df" },
          { title: "Present", val: stats.present, icon: <CheckCircle />, color: "#1cc88a" },
          { title: "Absent", val: stats.absent, icon: <XCircle />, color: "#e74a3b" }
        ].map((item, idx) => (
          <Col md={4} key={idx}>
            <Card className="border-0 shadow-sm overflow-hidden h-100" style={{ borderLeft: `5px solid ${item.color}` }}>
              <Card.Body className="p-4 d-flex justify-content-between align-items-center">
                <div>
                  <div className="text-uppercase text-muted fw-bold x-small mb-1" style={{ fontSize: '0.75rem' }}>{item.title}</div>
                  <h3 className="fw-bold mb-0">{item.val}</h3>
                </div>
                <div style={{ opacity: 0.2, color: item.color }}>{item.icon}</div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* --- SCROLLABLE TABLE CARD --- */}
      <Card className="border-0 shadow-sm overflow-hidden">
        <Card.Header className="bg-white py-3 border-bottom border-light d-flex justify-content-between align-items-center">
          <span className="fw-bold text-secondary mb-0">Attendance Listing</span>
          <Badge bg="info" className="bg-opacity-10 text-info fw-normal">Live Updates</Badge>
        </Card.Header>
        
        {/* Fixed Header & Scrollable Body Logic */}
        <div style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
          <Table responsive hover className="mb-0 align-middle">
            <thead style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor: '#fff' }}>
              <tr className="bg-light border-bottom">
                <th className="ps-4 py-3 text-secondary small fw-bold">STAFF MEMBER</th>
                <th className="py-3 text-secondary small fw-bold">STATUS</th>
                <th className="py-3 text-secondary small fw-bold text-center">LOGIN TIME</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, i) => (
                <tr key={i} className="border-bottom border-light">
                  <td className="ps-4 py-3">
                    <div className="d-flex align-items-center">
                      <div className="rounded-circle d-flex align-items-center justify-content-center me-3 fw-bold text-white shadow-sm" 
                           style={{ width: '38px', height: '38px', background: 'linear-gradient(45deg, #4e73df, #224abe)', fontSize: '0.9rem' }}>
                        {row.name.charAt(0)}
                      </div>
                      <div>
                        <div className="fw-semibold text-dark mb-0" style={{ fontSize: '0.95rem' }}>{row.name}</div>
                        <div className="text-muted small">{row.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <Badge className={`px-2 py-1 fw-medium ${row.status ? 'bg-success-subtle text-success border border-success' : 'bg-danger-subtle text-danger border border-danger'}`} pill>
                      {row.status ? "● Present" : "○ Absent"}
                    </Badge>
                  </td>
                  <td className="text-center">
                    <span className="text-muted small d-inline-flex align-items-center">
                      <Clock size={14} className="me-1 opacity-50" />
                      {row.loginTime}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
        
        {tableData.length === 0 && (
          <div className="text-center py-5">
            <p className="text-muted mb-0">No staff records matching your search.</p>
          </div>
        )}
      </Card>

      <style>{`
        .x-small { font-size: 0.7rem; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #f1f1f1; }
        ::-webkit-scrollbar-thumb { background: #ccc; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #bbb; }
        .bg-success-subtle { background-color: rgba(25, 135, 84, 0.1) !important; }
        .bg-danger-subtle { background-color: rgba(220, 53, 69, 0.1) !important; }
      `}</style>
    </Container>
  );
};

export default StaffAttendanceReport;

// import { Card, Container, Table, Badge, Row, Col, InputGroup, Form } from "react-bootstrap";
// import { useEffect, useMemo, useState } from "react";
// import moment from "moment";
// import { Users, CheckCircle, XCircle, Clock, Search } from "lucide-react"; // Modern Icons

// import { GetAttendance } from "../../networkServices/School/Attendance";
// import { GetAllUsers } from "../../networkServices/Admin";
// import { useLocalStorage } from "../../utils/hooks/useLocalStorage";

// const StaffAttendanceReport = () => {
//   const localData = useLocalStorage("userData", "get");
//   const [attendanceData, setAttendanceData] = useState([]);
//   const [userList, setUserList] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");

//   const fetchData = async () => {
//     const attendanceRes = await GetAttendance({
//       orgId: localData?.OrganizationId,
//       branchId: localData?.defaultCentre,
//       teacherId: null,
//       month: moment().format("MM"),
//       year: moment().format("YYYY"),
//     });

//     if (attendanceRes?.success) {
//       setAttendanceData(attendanceRes.data || []);
//     }

//     const usersRes = await GetAllUsers({
//       pageNumber: 1,
//       pageSize: 100,
//     });

//     if (usersRes?.success) {
//       setUserList(usersRes.data?.items || []);
//     }
//   };

//   const tableData = useMemo(() => {
//     const today = moment().format("YYYY-MM-DD");
//     let data = userList.map(user => {
//       const record = attendanceData.find(
//         att =>
//           att.teacherId === user.id &&
//           moment(att.attendanceDate).format("YYYY-MM-DD") === today
//       );

//       return {
//         name: user.fullName || user.userName,
//         email: user.email,
//         status: !!record,
//         loginTime: record?.loginDateTime
//           ? moment(record.loginDateTime).format("hh:mm A")
//           : "-",
//       };
//     });

//     if (searchTerm) {
//       data = data.filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase()));
//     }
//     return data;
//   }, [userList, attendanceData, searchTerm]);

//   // Statistics Calculation
//   const stats = {
//     total: tableData.length,
//     present: tableData.filter(u => u.status).length,
//     absent: tableData.filter(u => !u.status).length,
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   return (
//     <Container fluid className="py-4 bg-light min-vh-100">
//       <Row className="mb-4">
//         <Col md={4}>
//           <Card className="border-0 shadow-sm">
//             <Card.Body className="d-flex align-items-center">
//               <div className="bg-primary bg-opacity-10 p-3 rounded-3 me-3 text-primary">
//                 <Users size={24} />
//               </div>
//               <div>
//                 <small className="text-muted d-block">Total Staff</small>
//                 <h4 className="fw-bold mb-0">{stats.total}</h4>
//               </div>
//             </Card.Body>
//           </Card>
//         </Col>
//         <Col md={4}>
//           <Card className="border-0 shadow-sm">
//             <Card.Body className="d-flex align-items-center">
//               <div className="bg-success bg-opacity-10 p-3 rounded-3 me-3 text-success">
//                 <CheckCircle size={24} />
//               </div>
//               <div>
//                 <small className="text-muted d-block">Present</small>
//                 <h4 className="fw-bold mb-0">{stats.present}</h4>
//               </div>
//             </Card.Body>
//           </Card>
//         </Col>
//         <Col md={4}>
//           <Card className="border-0 shadow-sm">
//             <Card.Body className="d-flex align-items-center">
//               <div className="bg-danger bg-opacity-10 p-3 rounded-3 me-3 text-danger">
//                 <XCircle size={24} />
//               </div>
//               <div>
//                 <small className="text-muted d-block">Absent</small>
//                 <h4 className="fw-bold mb-0">{stats.absent}</h4>
//               </div>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>

//       {/* --- Main Table --- */}
//       <Card className="border-0 shadow-sm">
//         <Card.Body className="p-0">
//           <Table responsive hover className="mb-0">
//             <thead className="bg-light text-secondary small text-uppercase fw-semibold">
//               <tr>
//                 <th className="border-0 px-4 py-3">Staff Member</th>
//                 <th className="border-0 py-3">Status</th>
//                 <th className="border-0 py-3 text-center">Login Time</th>
//               </tr>
//             </thead>
//             <tbody className="border-top-0">
//               {tableData.length > 0 ? (
//                 tableData.map((row, i) => (
//                   <tr key={i} className="align-middle">
//                     <td className="px-4 py-3">
//                       <div className="d-flex align-items-center">
//                         <div className="bg-light rounded-circle p-2 me-3 text-center text-primary fw-bold" style={{width: '40px', height: '40px'}}>
//                           {row.name.charAt(0)}
//                         </div>
//                         <div>
//                           <div className="fw-bold text-dark">{row.name}</div>
//                           <div className="small text-muted">{row.email}</div>
//                         </div>
//                       </div>
//                     </td>
//                     <td>
//                       <Badge 
//                         pill 
//                         bg={row.status ? "success" : "danger"} 
//                         className="px-3 py-2 fw-medium"
//                         style={{ fontSize: '0.75rem', opacity: 0.85 }}
//                       >
//                         {row.status ? "● Present" : "○ Absent"}
//                       </Badge>
//                     </td>
//                     <td className="text-center">
//                       <div className="d-flex align-items-center justify-content-center text-muted small">
//                         <Clock size={14} className="me-1" />
//                         {row.loginTime}
//                       </div>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="3" className="text-center py-5 text-muted">
//                     No records found.
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </Table>
//         </Card.Body>
//       </Card>
//     </Container>
//   );
// };

// export default StaffAttendanceReport;

// import { Card, Container, Table, Badge, Row, Col } from "react-bootstrap";
// import { useEffect, useMemo, useState } from "react";
// import moment from "moment";

// import { GetAttendance } from "../../networkServices/School/Attendance";
// import { GetAllUsers } from "../../networkServices/Admin";
// import { useLocalStorage } from "../../utils/hooks/useLocalStorage";

// const StaffAttendanceReport = () => {
//   const localData = useLocalStorage("userData", "get");

//   const [attendanceData, setAttendanceData] = useState([]);
//   const [userList, setUserList] = useState([]);

//   const fetchData = async () => {
//     const attendanceRes = await GetAttendance({
//       orgId: localData?.OrganizationId,
//       branchId: localData?.defaultCentre,
//       teacherId: null,
//       month: moment().format("MM"),
//       year: moment().format("YYYY"),
//     });

//     if (attendanceRes?.success) {
//       setAttendanceData(attendanceRes.data || []);
//     }

//     const usersRes = await GetAllUsers({
//       pageNumber: 1,
//       pageSize: 100,
//     });

//     if (usersRes?.success) {
//       setUserList(usersRes.data?.items || []);
//     }
//   };

//   const tableData = useMemo(() => {
//     const today = moment().format("YYYY-MM-DD");

//     return userList.map(user => {
//       const record = attendanceData.find(
//         att =>
//           att.teacherId === user.id &&
//           moment(att.attendanceDate).format("YYYY-MM-DD") === today
//       );

//       return {
//         name: user.fullName || user.userName,
//         email: user.email,
//         status: !!record,
//         loginTime: record?.loginDateTime
//           ? moment(record.loginDateTime).format("hh:mm A")
//           : "-",
//       };
//     });
//   }, [userList, attendanceData]);

//   useEffect(() => {
//     fetchData();
//   }, []);

//   return (
//     <Container fluid>
//       <Card className="shadow-sm">
//         <Card.Header className="bg-white">
//           <h5 className="mb-0">Staff Attendance Detailed Report</h5>
//         </Card.Header>

//         <Card.Body>
//           <Table bordered hover responsive>
//             <thead className="bg-light">
//               <tr>
//                 <th>Staff Name</th>
//                 <th>Email</th>
//                 <th>Status</th>
//                 <th>Login Time</th>
//               </tr>
//             </thead>
//             <tbody>
//               {tableData.map((row, i) => (
//                 <tr key={i}>
//                   <td>{row.name}</td>
//                   <td>{row.email}</td>
//                   <td>
//                     <Badge bg={row.status ? "success" : "danger"}>
//                       {row.status ? "Present" : "Absent"}
//                     </Badge>
//                   </td>
//                   <td>{row.loginTime}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </Table>
//         </Card.Body>
//       </Card>
//     </Container>
//   );
// };

// export default StaffAttendanceReport;
