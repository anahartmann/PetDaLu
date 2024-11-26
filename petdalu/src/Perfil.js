import { TextField } from "@mui/material";
import ImagemUsuario from "./ImagemUsuario";
import "./Perfil.css";
import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Button } from "@mui/material";

function Perfil() {
  return (
    <div id="box">
      <Container id="container-perfil">
        <Row>
          <Col>
            <h2 className="txt">Sua conta</h2>
            <div>
              <ImagemUsuario></ImagemUsuario>
              <button>Escolher foto</button>
            </div>
            <div>
              <TextField
                required
                variant="standard"
                label="Nome Completo"
              ></TextField>
            </div>
            <div>
              <TextField required variant="standard" label="Email"></TextField>
            </div>
            <div>
              <TextField
                required
                variant="standard"
                label="Endereço"
              ></TextField>
            </div>
            <div>
              <TextField
                required
                variant="standard"
                label="Telefone"
              ></TextField>
            </div>
            <div>
              <TextField required variant="standard" label="CPF"></TextField>
            </div>
            <Button variant="contained" color="success" id="botao-perfil">
              Alterar
            </Button>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Perfil;
