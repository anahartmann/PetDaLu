import { TextField, Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "./Perfil.css";

function Perfil({ logout }) {
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const [erroPnome, setErroPnome] = React.useState(false);
  const [erroTelefone, setErroTelefone] = React.useState(false);

  async function buscarPerfil() {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:3010/perfil", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const { pnome, telefone, cpf, email } = response.data;
      setNome(pnome);
      setTelefone(telefone);
      setCpf(cpf);
      setEmail(email);
    } catch (error) {
      console.error("Erro ao buscar perfil:", error);
    }
  }

  useEffect(() => {
    buscarPerfil();
  }, []);

  const alterarPerfil = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:3010/alterarperfil",
        { pnome: nome, telefone: telefone },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Dados alterados com sucesso!");
      buscarPerfil();
    } catch (error) {
      console.error("Erro ao alterar perfil:", error);
      alert("Erro ao alterar os dados. Tente novamente.");
    }
  };

  function isValidTelefone(telefone) {
    telefone = telefone.replace(/[^\d]+/g, "");
    const regex = /^(\d{2})\d{9}$/;

    return regex.test(telefone);
  }

  function handlealterarUsuario() {
    setErroTelefone(false);
    setErroPnome(false);
    if (telefone === "" || nome === "") {
      if (telefone === "") {
        setErroTelefone(true);
      }
      if (nome === "") {
        setErroPnome(true);
      }
      alert("Por favor preencha todos os dados");
    } else if (!isValidTelefone(telefone)) {
      setErroTelefone(true);
      alert("Insira um telefone válido");
    } else {
      alterarPerfil();
    }
  }

  return (
    <div id="box">
      <Container id="container-perfil">
        <Row>
          <Col>
            <h2 className="txt">Sua conta</h2>

            <div className="form-group">
              <TextField
                required
                variant="standard"
                label="Nome Completo"
                error={erroPnome}
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
                label="Telefone"
                error={erroTelefone}
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
              variant="text"
              color="success"
              fullWidth
              className="btn-alterar"
              onClick={handlealterarUsuario}
            >
              Alterar
            </Button>
            <Button
              variant="text"
              color="success"
              fullWidth
              className="btn-sair"
              onClick={logout}
            >
              Sair
            </Button>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Perfil;
