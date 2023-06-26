import '../styles/RouteListStyles.css';




import React from 'react';
import { Card, Badge, Container, Row, Col } from 'react-bootstrap';


const RouteList = (props) => {
  const { routes } = props;

  return (
    <div className="mt-5">
      <Container>
        <h4 className="text-center">Routes</h4>
        {routes && routes.length > 0 && routes.map((route, index) => (
          <Card key={index} className="mb-3 route-card">
            <Card.Body>
              <Card.Title>
                <Row className="align-items-center">
                  <Col><h6>{route.description}</h6></Col>
                  <Col className="text-end">
                    {index === 0 && (
                      <span pill variant="success" id="ecological-badge">
                        Best Ecological Option
                      </span>
                    )}
                  </Col>
                </Row>
              </Card.Title>
              <Card.Text>Distance: {route.distance}</Card.Text>
              <Card.Text>Estimated Time: {route.duration}</Card.Text>
              <Card.Text>Carbon Footprint Saved: {route.carbonFootprint}</Card.Text>
            </Card.Body>
          </Card>
        ))}
      </Container>
    </div>
  );
}

export default RouteList;








