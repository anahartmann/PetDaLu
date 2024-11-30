import React from "react";
// import PropTypes from "prop-types";
import axios from "axios";

import { Alert, Box, Button, Snackbar, Stack, TextField } from "@mui/material";
import CriarConta from "./CriarConta";

export default function Login(props) {
  const [username, setUsername] = React.useState("");
  const [passwd, setPasswd] = React.useState("");
  const [criarconta, setcriarconta] = React.useState(false);
  const [login, setlogin] = React.useState(true);
  const [openMessage, setOpenMessage] = React.useState(false);
  const [messageText, setMessageText] = React.useState("");
  const [messageSeverity, setMessageSeverity] = React.useState("success");

  // const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  async function enviaLogin(event) {
    event.preventDefault();
    try {
      console.log(props.user);
      const response = await axios.post("/login", {
        username: username,
        password: passwd,
      });
      if (response.status >= 200 && response.status < 300) {
        // Salva o token JWT na sessão
        localStorage.setItem("token", response.data.token);
        // seta o estado do login caso tudo deu certo
        props.handleLogin(true);
        console.log(props.user);
      } else {
        // falha
        console.error("Falha na autenticação");
      }
    } catch (error) {
      console.log(error);
      setOpenMessage(true);
      setMessageText("Falha ao logar usuário!");
      setMessageSeverity("error");
    }
  }

  function handleCloseMessage(_, reason) {
    if (reason === "clickaway") {
      return;
    }
    setOpenMessage(false);
  }

  function handleCriarConta(id) {
    console.log(id);
    if (id === "criarconta") {
      setcriarconta(true);
      setlogin(false);
    } else {
      setcriarconta(false);
      setlogin(true);
    }
  }

  return (
    <Box style={{ maxWidth: "300px" }}>
      {login ? (
        <Stack spacing={2}>
          <Stack spacing={2}>
            <TextField
              required
              id="username-input"
              label="User: "
              size="small"
              value={username}
              onChange={(event) => {
                setUsername(event.target.value);
              }}
            />
            <TextField
              required
              id="passwd-input"
              label="Password: "
              type="password"
              size="small"
              value={passwd}
              onChange={(event) => {
                setPasswd(event.target.value);
              }}
            />
          </Stack>
          <Stack direction="row" spacing={3}>
            <Button
              variant="contained"
              style={{
                maxWidth: "100px",
                minWidth: "100px",
              }}
              color="primary"
              onClick={enviaLogin}
            >
              Enviar
            </Button>
            <Button
              variant="outlined"
              style={{
                maxWidth: "100px",
                minWidth: "100px",
              }}
              color="error"
              id="criarconta"
              onClick={(event) => {
                handleCriarConta(event.target.id);
              }}
            >
              Criar conta
            </Button>
          </Stack>
          <Snackbar
            open={openMessage}
            autoHideDuration={6000}
            onClose={handleCloseMessage}
          >
            <Alert severity={messageSeverity} onClose={handleCloseMessage}>
              {messageText}
            </Alert>
          </Snackbar>
        </Stack>
      ) : (
        <CriarConta handlecriarconta={handleCriarConta}></CriarConta>
      )}
    </Box>
  );
}

// Login.propTypes = {
// 	setToken: PropTypes.func.isRequired,
// };
