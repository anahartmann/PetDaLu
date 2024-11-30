import { TextField } from "@mui/material";
import ImagemUsuario from "./ImagemUsuario";
import "./CriarConta.css";
import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Button } from "@mui/material";
import axios from "axios";

function CriarConta({ handlecriarconta }) {
  const [username, setUsername] = React.useState(""); // email
  const [passwd, setPasswd] = React.useState(""); // senha
  const [pnome, setPnome] = React.useState(""); // primeiro nome
  const [cpf, setCpf] = React.useState(""); // CPF
  const [telefone, setTelefone] = React.useState(""); // telefone
  const [administrador, setAdministrador] = React.useState(false);
  const [openMessage, setOpenMessage] = React.useState(false);
  const [messageText, setMessageText] = React.useState("");
  const [messageSeverity, setMessageSeverity] = React.useState("success");

  async function criaUsuario(event) {
    event.preventDefault();
    try {
      //console.log(props.user);
      const response = await axios.post("/novoUsuario", {
        username: username,
        passwd: passwd,
        pnome: pnome,
        cpf: cpf,
        telefone: telefone,
        administrador: administrador,
      });
      if (response.status >= 200 && response.status < 300) {
        // Salva o token JWT na sessão
        localStorage.setItem("token", response.data.token);
        handlecriarconta("certo");
        setOpenMessage(true);
        setMessageText("Usuario criado");
        //setMessageSeverity("error");
        // seta o estado do login caso tudo deu certo
        // props.handleLogin(true);
        //console.log(props.user);
      } else {
        // falha
        console.error("Falha na autenticação");
      }
    } catch (error) {
      console.log(error);
      setOpenMessage(true);
      setMessageText("Falha ao criar usuário!");
      setMessageSeverity("error");
    }
  }

  return (
    <div id="box">
      <Container id="container-criar-conta">
        <Row>
          <Col>
            <h2 className="txt">Crie sua conta</h2>
            {/* <div>
              <ImagemUsuario></ImagemUsuario>
              <button>Escolher foto</button>
            </div> */}
            <div>
              <TextField
                required
                variant="standard"
                label="Nome Completo"
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
              onClick={criaUsuario}
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
