import React from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import './LoginPage.css'; // Make sure to create this CSS file

const LoginPage = () => {
  return (
    <Container fluid className="login-container">
      <Row className="justify-content-center align-items-center">
        <Col md={6} className="login-form-col">
          <Form className="login-form">
            <h1 className="text-center logo">Federated Vessel</h1>
            <Form.Group controlId="formBasicEmail">
              <Form.Label className='custom-label'>Email address</Form.Label>
              <Form.Control type="email" placeholder="Enter email" />
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Form.Label className='custom-label'>Password</Form.Label>
              <Form.Control type="password" placeholder="Password" />
            </Form.Group>

            <Button variant="warning" type="submit" block>
              Login
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPage;
