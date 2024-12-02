import React from "react";
import axios from "axios";
import { Alert, Box, Button, Snackbar, Stack, TextField } from "@mui/material";
import CriarConta from "./CriarConta";
import "./Login.css";
// import PropTypes from "prop-types";

// const [isLoggedIn, setIsLoggedIn] = React.useState(false);

export default function Login(props) {
  const [username, setUsername] = React.useState("");
  const [passwd, setPasswd] = React.useState("");
  const [criarconta, setcriarconta] = React.useState(false);
  const [login, setlogin] = React.useState(true);
  const [openMessage, setOpenMessage] = React.useState(false);
  const [messageText, setMessageText] = React.useState("");
  const [messageSeverity, setMessageSeverity] = React.useState("success");

  async function enviaLogin(event) {
    event.preventDefault();
    try {
      const response = await axios.post("/login", {
        username: username,
        password: passwd,
      });
      if (response.status >= 200 && response.status < 300) {
        // Salva o token JWT na sessão
        localStorage.setItem("token", response.data.token);
        // seta o estado do login caso tudo deu certo
        props.handleLogin(true);
      } else {
        // falha
        console.error("Falha na autenticação");
      }
    } catch (error) {
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
    if (id === "criarconta") {
      setcriarconta(true);
      setlogin(false);
    } else {
      setcriarconta(false);
      setlogin(true);
    }
  }

  return (
    <div id="box-login">
      <Box id="container-login">
        {login ? (
          <Stack spacing={3}>
            <h2 className="txt-login">Login</h2>
            <Stack spacing={2}>
              <TextField
                required
                id="username-input"
                label="Usuário"
                size="small"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
              />
              <TextField
                required
                id="passwd-input"
                label="Senha"
                type="password"
                size="small"
                value={passwd}
                onChange={(event) => setPasswd(event.target.value)}
              />
            </Stack>
            <Stack direction="row" spacing={2} justifyContent="center">
              <Button
                variant="text"
                sx={{
                  color: "#068146",
                  "&:hover": {
                    backgroundColor: "rgba(6, 129, 70, 0.1)",
                  },
                }}
                onClick={enviaLogin}
              >
                Enviar
              </Button>
              <Button
                variant="text"
                sx={{
                  color: "#068146",
                  "&:hover": {
                    backgroundColor: "rgba(6, 129, 70, 0.1)",
                  },
                }}
                id="criarconta"
                onClick={(event) => handleCriarConta(event.target.id)}
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
          <CriarConta handlecriarconta={handleCriarConta} />
        )}
      </Box>
    </div>
  );
}

// Login.propTypes = {
// 	setToken: PropTypes.func.isRequired,
// };
