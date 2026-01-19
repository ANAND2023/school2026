import { Col, Card } from "react-bootstrap";

const StatsCard = ({ title, value, textColor = "dark" }) => {
  return (
    <div className="col">
      <div className="card shadow-sm h-100">
        <div className="card-body">
          <h6 className={`mb-1 text-${textColor}`}>{title}</h6>
          <h3 className={`fw-bold text-${textColor}`}>{value}</h3>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;

// const StatsCard = ({ title, value, highlight }) => {
//   return (
//     <Col md={2}>
//       <Card className={`shadow-sm text-center ${highlight ? "border-danger" : ""}`}>
//         <Card.Body>
//           <h6 className="text-muted">{title}</h6>
//           <h4 className={highlight ? "text-danger" : ""}>{value}</h4>
//         </Card.Body>
//       </Card>
//     </Col>
//   );
// };

// export default StatsCard;
