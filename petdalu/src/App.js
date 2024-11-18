import React from "react";
import Cabecalho from "./Cabecalho";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "./App.css";
import Login from "./Login";

function App() {
  return (
    <div>
      <Container>
        <Row xs={1}>
          <Col>
            <Cabecalho></Cabecalho>
          </Col>
        </Row>
        <Row>
          <Login></Login>
        </Row>
      </Container>
    </div>
  );
}

export default App;
