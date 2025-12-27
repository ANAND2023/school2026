import { Col, Card } from "react-bootstrap";

const StatsCard = ({ title, value, highlight }) => {
  return (
    <Col md={2}>
      <Card className={`shadow-sm text-center ${highlight ? "border-danger" : ""}`}>
        <Card.Body>
          <h6 className="text-muted">{title}</h6>
          <h4 className={highlight ? "text-danger" : ""}>{value}</h4>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default StatsCard;
