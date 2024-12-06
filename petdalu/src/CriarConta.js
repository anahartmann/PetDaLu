import "./CriarConta.css";
import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import axios from "axios";
import { Button, TextField } from "@mui/material";

function CriarConta({ handlecriarconta }) {
  const [username, setUsername] = React.useState(""); // email
  const [passwd, setPasswd] = React.useState(""); // senha
  const [pnome, setPnome] = React.useState(""); // primeiro nome
  const [cpf, setCpf] = React.useState(""); // CPF
  const [telefone, setTelefone] = React.useState("");
  const [erroUsername, setErroUsername] = React.useState(false); // erro no email
  const [erroPasswd, setErroPasswd] = React.useState(false); // erro na senha
  const [erroPnome, setErroPnome] = React.useState(false); // erro no primeiro nome
  const [erroCpf, setErroCpf] = React.useState(false); // erro no CPF
  const [erroTelefone, setErroTelefone] = React.useState(false); // erro no telefone

  async function criaUsuario() {
    try {
      const response = await axios.post("/novoUsuario", {
        username: username,
        passwd: passwd,
        pnome: pnome,
        cpf: cpf,
        telefone: telefone,
        administrador: "n",
      });
      if (response.status >= 200 && response.status < 300) {
        handlecriarconta("certo");
      } else {
        console.error("Falha na autenticação");
      }
    } catch (error) {
      alert("Email ou CPF já cadastrados");
      setErroCpf(true);
      setErroUsername(true);
    }
  }

  function isValidEmail(email) {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  }

  function isValidCPF(cpf) {
    cpf = cpf.replace(/[^\d]+/g, "");

    if (cpf.length !== 11) {
      return false;
    }

    if (/^(\d)\1{10}$/.test(cpf)) {
      return false;
    }

    return true;
  }

  function isValidTelefone(telefone) {
    telefone = telefone.replace(/[^\d]+/g, "");
    const regex = /^(\d{2})\d{9}$/;

    return regex.test(telefone);
  }

  function handlecriarUsuario() {
    setErroCpf(false);
    setErroUsername(false);
    setErroPasswd(false);
    setErroTelefone(false);
    setErroPnome(false);
    if (
      username === "" ||
      passwd === "" ||
      pnome === "" ||
      telefone === "" ||
      cpf === ""
    ) {
      if (username === "") {
        setErroUsername(true);
      }
      if (passwd === "") {
        setErroPasswd(true);
      }
      if (pnome === "") {
        setErroPnome(true);
      }
      if (telefone === "") {
        setErroTelefone(true);
      }
      if (cpf === "") {
        setErroCpf(true);
      }
      alert("Por favor preencha todos os dados");
    } else if (!isValidEmail(username)) {
      setErroUsername(true);
      alert("Insira um email válido");
    } else if (!isValidCPF(cpf)) {
      setErroCpf(true);
      alert("Insira um cpf válido");
    } else if (!isValidTelefone(telefone)) {
      setErroTelefone(true);
      alert("Insira um telefone válido");
    } else {
      criaUsuario();
    }
  }

  return (
    <div id="box">
      <Container id="container-criar-conta">
        <Row>
          <Col>
            <h2 className="txt">Crie sua conta</h2>
            <div>
              <TextField
                required
                variant="standard"
                label="Nome Completo"
                error={erroPnome}
                value={pnome}
                onChange={(event) => {
                  setPnome(event.target.value);
                }}
              ></TextField>
            </div>
            <div>
              <TextField
                required
                variant="standard"
                label="Senha"
                error={erroPasswd}
                value={passwd}
                onChange={(event) => {
                  setPasswd(event.target.value);
                }}
              ></TextField>
            </div>
            <div>
              <TextField
                required
                variant="standard"
                label="Email"
                error={erroUsername}
                value={username}
                onChange={(event) => {
                  setUsername(event.target.value);
                }}
              ></TextField>
            </div>

            <div>
              <TextField
                required
                variant="standard"
                label="Telefone"
                error={erroTelefone}
                value={telefone}
                onChange={(event) => {
                  setTelefone(event.target.value);
                }}
              ></TextField>
            </div>
            <div>
              <TextField
                required
                variant="standard"
                label="CPF"
                error={erroCpf}
                value={cpf}
                onChange={(event) => {
                  setCpf(event.target.value);
                }}
              ></TextField>
            </div>
            <Button
              variant="contained"
              color="success"
              id="botao-criar-conta"
              onClick={handlecriarUsuario}
            >
              Criar conta
            </Button>
            <Button
              variant="contained"
              color="success"
              id="botao-criar-conta"
              onClick={(event) => {
                handlecriarconta(event.target.id);
              }}
            >
              Voltar
            </Button>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default CriarConta;
