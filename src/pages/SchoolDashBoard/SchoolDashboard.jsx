import { Container, Row, Col, Card } from "react-bootstrap";
import StatsCard from "./StatsCard";
import VacancyChart from "./VacancyChart";
import PrincipalChart from "./PrincipalChart";
import FeesChart from "./FeesChart";
import AttendanceMeter from "./AttendanceMeter";
import GenderRatioChart from "./GenderRatioChart";
import ClassWiseStudentChart from "./ClassWiseStudentChart";

const SchoolDashboard = () => {
  return (
    <Container fluid className="">
      {/* <h4 className="mb-4">School ERP Dashboard</h4> */}

      {/* Top Stats */}
      <Row className="g-3 mb-4">
        <StatsCard title="Students" value="75,643" />
        <StatsCard title="Leaders" value="425" />
        <StatsCard title="Vacancies" value="43" highlight />
        <StatsCard title="Mentors" value="12" />
        <StatsCard title="APP Cohort" value="34" />
        <StatsCard title="ALP Cohort" value="128" />
      </Row>

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
      <Row className="g-4">
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
    </Container>
  );
};

export default SchoolDashboard;
