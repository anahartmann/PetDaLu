import { TextField, Button } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import ImagemUsuario from "./ImagemUsuario";
import "./Perfil.css";
import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

function Perfil() {
  const [nome, setNome] = useState("");
  const [endereco, setEndereco] = useState("");
  const [telefone, setTelefone] = useState("");
  const cpf = "123.456.789-00";
  const email = "anahartmann@gmail.com";

  const handleAlterar = () => {
    alert("Dados alterados com sucesso!");
  };

  return (
    <div id="box">
      <Container id="container-perfil">
        <Row>
          <Col>
            <h2 className="txt">Sua conta</h2>
            <div className="imagem-container">
              <ImagemUsuario />
              <Button
                variant="text"
                size="small"
                className="btn-icone-foto"
                aria-label="Mudar foto"
                sx={{ color: "#068146" }}
              >
                <EditIcon fontSize="small" />
              </Button>
            </div>

            <div className="form-group">
              <TextField
                required
                variant="standard"
                label="Nome Completo"
                fullWidth
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
            </div>
            <div className="form-group">
              <TextField
                variant="standard"
                label="E-mail"
                fullWidth
                value={email}
                InputProps={{ readOnly: true }}
              />
            </div>
            <div className="form-group">
              <TextField
                required
                variant="standard"
                label="Endereço"
                fullWidth
                value={endereco}
                onChange={(e) => setEndereco(e.target.value)}
              />
            </div>
            <div className="form-group">
              <TextField
                required
                variant="standard"
                label="Telefone"
                fullWidth
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
              />
            </div>
            <div className="form-group">
              <TextField
                variant="standard"
                label="CPF"
                fullWidth
                value={cpf}
                InputProps={{ readOnly: true }}
              />
            </div>

            <Button
              variant="contained"
              color="success"
              fullWidth
              className="btn-alterar"
              onClick={handleAlterar}
            >
              Alterar
            </Button>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Perfil;
