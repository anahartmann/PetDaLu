import "./Login.css";
import React from "react";
import TextField from "@mui/material/TextField";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Button } from "@mui/material";

function Login() {
  return (
    <div id="box-login">
      <div>
        <Container id="container-login">
          <Row>
            <p className="txt-login">Faça seu login</p>
          </Row>
          <Row className="itens-login">
            <TextField required label="Usuário"></TextField>
          </Row>
          <Row className="itens-login">
            <TextField required label="Senha"></TextField>
          </Row>
          <Row className="itens-login">
            <Button variant="contained" color="success">
              Login
            </Button>
          </Row>
        </Container>
      </div>
    </div>
  );
}

export default Login;
