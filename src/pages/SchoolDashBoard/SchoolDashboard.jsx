import { Container, Row, Col, Card } from "react-bootstrap";
import StatsCard from "./StatsCard";
import VacancyChart from "./VacancyChart";
import PrincipalChart from "./PrincipalChart";
import FeesChart from "./FeesChart";
import AttendanceMeter from "./AttendanceMeter";
import GenderRatioChart from "./GenderRatioChart";
import ClassWiseStudentChart from "./ClassWiseStudentChart";
import EnquiryDashboard from "./EnquiryDashboard";
import AccountantDashboard from "./AccountantDashboard";
import { getadmissionlist } from "../../networkServices/School/RegistrationApi";
import { useEffect, useState } from "react";
import { GetAllUsers } from "../../networkServices/Admin";

const SchoolDashboard = () => {
  const [studentList,setStudentList]=useState(0)
  const [userList,setUserList]=useState(0)
 const handleSearch = async () => {
        const payload =
        // {
        //     "studentMasterId": null,
        //     "studentId": values.StudentID,
        //     "firstName": values.firstName,
        //     "mobile": values.Contact,
        //     "email": "",
        //     "fromDate": moment(values.fromDate).format("YYYY-MM-DD"),
        //     "toDate": moment(values.toDate).format("YYYY-MM-DD")
        // }

        {
            "sessionId": null,
            "branchId": null,
            //   "classId": "",
            //   "sessionId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            //   "branchId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            "classId": null,
            "fromDate": null,
            "toDate": null,
            "studentId": null,
            "admissionNo": null,
            "rollNumber": null,
            "firstName": null,
            "page": 1,
            "pageSize": 100
        }
        //         {
        //   "sessionId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        //   "branchId": localData?.defaultCentre,
        // //   "classId": "",
        // //   "sessionId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        // //   "branchId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        //   "classId": "cb0115fb-6dfa-4590-8c77-bffcd28e153f",
        //   "fromDate": moment(values.fromDate).format("YYYY-MM-DD"),
        //   "toDate":  moment(values.toDate).format("YYYY-MM-DD"),
        //   "studentId": values.StudentID,
        //   "admissionNo": "",
        //   "rollNumber": "",
        //   "firstName": values.firstName,
        //   "page": 100,
        //   "pageSize": 100
        // }


        try {
            const response = await getadmissionlist(payload);
            if (response?.success) {
                setStudentList(response?.data);
                // notify(response?.message, "success")
            }
            else {
                // notify(response?.message, "error")
            }
        } catch (error) {
            console.log("error", error)
        }
    }
      const getAllUsers = async () => {
    
    
        const payload = {
          "pageNumber": 1,
          "pageSize": 30,
          "search": null,
          "lockedOnly": false
        }
    
        try {
          const res = await GetAllUsers(payload);
    
          // 🔴 demo purpose (remove this block when API ready)
          //   const res = { success: true };
    
          if (res?.success) {
            notify(res?.message, "success");
            setUserList(res?.data?.items || []);
           
          } else {
            notify(res?.message || "Failed", "error");
          }
        } catch (error) {
          notify("Something went wrong", "error");
        }
      };

useEffect(() => {
    handleSearch();
    getAllUsers();
}, [])
  return (
    <Container fluid className="">
     <Row className="g-3 mb-4">
  <StatsCard title="Admission" value={studentList?.length ?? 0} textColor="primary" />
  <StatsCard title="Students" value={studentList?.length ?? 0} textColor="success" />
  <StatsCard title="Teacher" value={userList?.length ?? 0} textColor="warning" />
  <StatsCard title="Staff" value="12" textColor="info" />
  <StatsCard title="Present Student" value="600" textColor="danger" />
  <StatsCard title="Present Teacher" value="28" textColor="secondary" />
</Row>

      {/* <Row className="g-3 mb-4">
        <StatsCard title="Admission" value={studentList?.length??0} />
        <StatsCard title="Students" value={studentList?.length??0} />
        <StatsCard title="Teacher" value={userList?.length??0} highlight />
        <StatsCard title="Staff" value="12" />
        <StatsCard title="Present Student" value="600" />
        <StatsCard title="Present Teacher" value="28" />
      </Row> */}

      {/* Charts Section */}
    <Row className="g-3 mb-4">
        <Col md={4}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title>User/Student</Card.Title>
              <PrincipalChart />
            </Card.Body>
          </Card>
        </Col>

        <Col md={8}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title>Fees</Card.Title>
              {/* <VacancyChart /> */}
              <FeesChart/>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className="g-4 mb-4">
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
              <Card.Title>Student</Card.Title>
            
              <ClassWiseStudentChart/>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className="g-4 mb-4">
        <Col md={12}>
          <Card 
          // className="shadow-sm"
          >
            <Card.Body>
              {/* <Card.Title>Enquiry</Card.Title> */}
              <EnquiryDashboard />
            </Card.Body>
          </Card>
        </Col>
       
      </Row>
      <Row className="g-4 mb-4">
        <Col md={12}>
          <Card 
          // className="shadow-sm"
          >
            <Card.Body>
              {/* <Card.Title>Enquiry</Card.Title> */}
              <AccountantDashboard />
            </Card.Body>
          </Card>
        </Col>
       
      </Row>
    </Container>
  );
};

export default SchoolDashboard;
