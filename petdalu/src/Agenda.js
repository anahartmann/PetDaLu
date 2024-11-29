import "./Agenda.css";
import React from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import { Container, Row, Col, Button } from "react-bootstrap";

function Agenda() {
  const [exibeAgendamento, setExibeAgendamento] = React.useState(false);
  const [exibeAgenda, setExibeAgenda] = React.useState(true);

  function controlaClique(id) {
    if (id === "voltar") {
      setExibeAgenda(true);
      setExibeAgendamento(false);
    } else {
      setExibeAgenda(false);
      setExibeAgendamento(true);
    }
  }

  return (
    <div>
      {exibeAgenda ? (
        <div>
          <h2 className="titulo">Agenda da Semana</h2>
          <Container id="semana">
            <div>
              <Col className="dia">
                <div className="cabecalho-dia">
                  <p> 11/11</p>
                  <p> Segunda-feira</p>
                </div>
                <div className="horarios">
                  <p
                    className="horario-disponivel"
                    id="11/11-13:30"
                    onClick={(event) => {
                      controlaClique(event.target.id);
                    }}
                  >
                    13:30
                  </p>
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
      ) : (
        <div></div>
      )}
      {exibeAgendamento ? (
        <div>
          <h2 className="titulo">11/11-13:30</h2>
          <Container id="tabela">
            <Col>
              <Row className="formulario">
                <FormControl>
                  <FormLabel id="bdomicilio">
                    Deseja que o pet seja buscado a domicílio?
                  </FormLabel>
                  <RadioGroup
                    row
                    aria-labelledby="bdomicilio"
                    defaultValue="nao"
                    name="radio-buttons-bdomicilio"
                  >
                    <FormControlLabel
                      value="sim"
                      control={<Radio />}
                      label="Sim"
                    />
                    <FormControlLabel
                      value="nao"
                      control={<Radio />}
                      label="Não"
                    />
                  </RadioGroup>
                </FormControl>
              </Row>{" "}
              <Row className="formulario">
                <FormControl>
                  <FormLabel id="edomicilio">
                    Deseja que o pet seja estregue a domicílio?
                  </FormLabel>
                  <RadioGroup
                    row
                    aria-labelledby="edomicilio"
                    defaultValue="nao"
                    name="radio-buttons-edomicilio"
                  >
                    <FormControlLabel
                      value="sim"
                      control={<Radio />}
                      label="Sim"
                    />
                    <FormControlLabel
                      value="nao"
                      control={<Radio />}
                      label="Não"
                    />
                  </RadioGroup>
                </FormControl>
              </Row>
              <Row className="formulario">
                <FormControl>
                  <FormLabel id="servico">Qual o tipo de serviço?</FormLabel>
                  <RadioGroup
                    row
                    aria-labelledby="servico"
                    defaultValue="banho"
                    name="radio-buttons-servico"
                  >
                    <FormControlLabel
                      value="banho"
                      control={<Radio />}
                      label="Banho"
                    />
                    <FormControlLabel
                      value="tosa"
                      control={<Radio />}
                      label="Tosa"
                    />
                    <FormControlLabel
                      value="tosa-banho"
                      control={<Radio />}
                      label="Banho + Tosa"
                    />
                  </RadioGroup>
                </FormControl>
              </Row>{" "}
              <Row className="formulario">
                <FormControl>
                  <FormLabel id="pagamento">
                    Qual o método de pagamento?{" "}
                  </FormLabel>
                  <RadioGroup
                    row
                    aria-labelledby="pagamento"
                    defaultValue="dinheiro"
                    name="radio-buttons-pagamento"
                  >
                    <FormControlLabel
                      value="dinheiro"
                      control={<Radio />}
                      label="Dinheiro"
                    />
                    <FormControlLabel
                      value="pix"
                      control={<Radio />}
                      label="Pix"
                    />
                  </RadioGroup>
                </FormControl>
              </Row>
            </Col>
            <Row>
              <Col className="d-flex flex-column">
                <div className="preco">
                  <p>Banho R$ 30,00</p>
                  <p>Entrega R$ 10,00</p>
                  <p>Valor total R$ 40,00</p>
                </div>
                <Button className="mt-auto">Agendar</Button>
              </Col>
            </Row>
          </Container>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
}

export default Agenda;
