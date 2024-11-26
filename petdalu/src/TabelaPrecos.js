import "./TabelaPrecos.css";
import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

function TabelaPrecos() {
  return (
    <div>
      <h2 id="titulo">Tabela Preços</h2>
      <Container id="tabela">
        <Col>
          <p>Banho R$30,00</p>
          <p>Tosa Grande Porte R$60,00</p>
          <p>Tosa Pequeno Porte R$40,00</p>
          <p>Tosa Médio Porte R$40,00</p>
          <p>Banho + Tosa Grande Porte R$60,00</p>
          <p>Banho + Tosa Pequeno Porte R$40,00</p>
          <p>Banho + Tosa Médio Porte R$40,00</p>
          <p>Entrega/Retirada R$10,00</p>
        </Col>
      </Container>
    </div>
  );
}

export default TabelaPrecos;
