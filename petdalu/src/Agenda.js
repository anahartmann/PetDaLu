import "./Agenda.css";
import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

function Agenda() {
  return (
    <div>
      <h2 id="titulo">Agenda da Semana</h2>
      <Container id="semana">
        <div>
          <Col className="dia">
            <div className="cabecalho-dia">
              <p> 11/11</p>
              <p> Segunda-feira</p>
            </div>
            <div className="horarios">
              <p className="horario-disponivel">13:30</p>
              <p className="horario-indisponivel">14:30</p>
              <p className="horario-indisponivel">15:30</p>
              <p className="horario-disponivel">16:30</p>
              <p className="horario-disponivel">17:30</p>
            </div>
          </Col>
        </div>
        <div>
          <Col className="dia">
            <div className="cabecalho-dia">
              <p> 11/11</p>
              <p> Segunda-feira</p>
            </div>
            <div className="horarios">
              <p className="horario-disponivel">13:30</p>
              <p className="horario-indisponivel">14:30</p>
              <p className="horario-indisponivel">15:30</p>
              <p className="horario-disponivel">16:30</p>
              <p className="horario-disponivel">17:30</p>
            </div>
          </Col>
        </div>
        <div>
          <Col className="dia">
            <div className="cabecalho-dia">
              <p> 11/11</p>
              <p> Segunda-feira</p>
            </div>
            <div className="horarios">
              <p className="horario-disponivel">13:30</p>
              <p className="horario-indisponivel">14:30</p>
              <p className="horario-indisponivel">15:30</p>
              <p className="horario-disponivel">16:30</p>
              <p className="horario-disponivel">17:30</p>
            </div>
          </Col>
        </div>
        <div>
          <Col className="dia">
            <div className="cabecalho-dia">
              <p> 11/11</p>
              <p> Segunda-feira</p>
            </div>
            <div className="horarios">
              <p className="horario-disponivel">13:30</p>
              <p className="horario-indisponivel">14:30</p>
              <p className="horario-indisponivel">15:30</p>
              <p className="horario-disponivel">16:30</p>
              <p className="horario-disponivel">17:30</p>
            </div>
          </Col>
        </div>
        <div>
          <Col className="dia">
            <div className="cabecalho-dia">
              <p> 11/11</p>
              <p> Segunda-feira</p>
            </div>
            <div className="horarios">
              <p className="horario-disponivel">13:30</p>
              <p className="horario-indisponivel">14:30</p>
              <p className="horario-indisponivel">15:30</p>
              <p className="horario-disponivel">16:30</p>
              <p className="horario-disponivel">17:30</p>
            </div>
          </Col>
        </div>
        <div>
          <Col className="dia">
            <div className="cabecalho-dia">
              <p> 11/11</p>
              <p> Segunda-feira</p>
            </div>
            <div className="horarios">
              <p className="horario-disponivel">13:30</p>
              <p className="horario-indisponivel">14:30</p>
              <p className="horario-indisponivel">15:30</p>
              <p className="horario-disponivel">16:30</p>
              <p className="horario-disponivel">17:30</p>
            </div>
          </Col>
        </div>
        <div>
          <Col className="dia">
            <div className="cabecalho-dia">
              <p> 11/11</p>
              <p> Segunda-feira</p>
            </div>
            <div className="horarios">
              <p className="horario-disponivel">13:30</p>
              <p className="horario-indisponivel">14:30</p>
              <p className="horario-indisponivel">15:30</p>
              <p className="horario-disponivel">16:30</p>
              <p className="horario-disponivel">17:30</p>
            </div>
          </Col>
        </div>
      </Container>
      <Container id="semana">
        <Row>
          <button>Anterior</button>
          <button>Proximo</button>
        </Row>
      </Container>
    </div>
  );
}

export default Agenda;
