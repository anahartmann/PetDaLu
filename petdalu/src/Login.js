import React from "react";
import axios from "axios";
import { Box, Button, Stack, TextField } from "@mui/material";
import CriarConta from "./CriarConta";
import "./Login.css";
// import PropTypes from "prop-types";

// const [isLoggedIn, setIsLoggedIn] = React.useState(false);

export default function Login(props) {
  const [username, setUsername] = React.useState("");
  const [passwd, setPasswd] = React.useState("");
  const [login, setlogin] = React.useState(true);
  const [erroUsername, setErroUsername] = React.useState(false);
  const [erroPasswd, setErroPasswd] = React.useState(false);

  async function enviaLogin() {
    try {
      const response = await axios.post("/login", {
        username: username,
        password: passwd,
      });
      if (response.status >= 200 && response.status < 300) {
        localStorage.setItem("token", response.data.token);
        props.handleLogin();
      } else {
        console.error("Falha na autenticação");
      }
    } catch (error) {
      setErroPasswd(true);
      setErroUsername(true);
      alert("Email ou senha incorretos");
    }
  }

  function handleCriarConta(id) {
    if (id === "criarconta") {
      setlogin(false);
    } else {
      setlogin(true);
    }
  }

  function handleLogin() {
    setErroUsername(false);
    setErroPasswd(false);
    if (username === "" || passwd === "") {
      if (username === "") {
        setErroUsername(true);
      }
      if (passwd === "") {
        setErroPasswd(true);
      }
      alert("Por favor preencha todos os dados");
    } else {
      enviaLogin();
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
                error={erroUsername}
                value={username}
                onChange={(event) => setUsername(event.target.value)}
              />
              <TextField
                required
                id="passwd-input"
                label="Senha"
                type="password"
                size="small"
                error={erroPasswd}
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
                onClick={handleLogin}
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
          </Stack>
        ) : (
          <CriarConta handlecriarconta={handleCriarConta} />
        )}
      </Box>
    </div>
  );
}
