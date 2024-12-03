import "./Enderecos.css";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import AddIcon from "@mui/icons-material/Add";
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

function Enderecos() {
  const [enderecos, setEnderecos] = useState([]); // Armazena os endereços do banco

  // Função para buscar os endereços da API
  async function buscarEnderecos() {
    try {
      const token = localStorage.getItem("token"); // Recupera o token JWT
      const response = await axios.get("http://localhost:3010/enderecos", {
        headers: {
          Authorization: `Bearer ${token}`, // Adiciona o token no cabeçalho
        },
      });
      setEnderecos(response.data); // Atualiza os dados no estado
    } catch (error) {
      console.error("Erro ao buscar endereços:", error);
    }
  }

  // Faz a requisição quando o componente é montado
  useEffect(() => {
    buscarEnderecos();
  }, []);

  // Estados para controlar o formulário de novo endereço
  const [openForm, setOpenForm] = useState(false);
  const [num, setNum] = useState(""); // Estado para o número
  const [logradouro, setLogradouro] = useState(""); // Estado para o logradouro
  const [cidade, setCidade] = useState(""); // Estado para a cidade
  const [errocidade, setErroCidade] = useState(false);
  const [erronum, setErroNum] = useState(false);
  const [errolog, setErroLog] = useState(false);

  const [openFormAlterar, setOpenFormAlterar] = useState(false);
  const [eid, setEid] = useState(0);

  const handleOpenForm = () => setOpenForm(true);
  const handleCloseForm = () => {
    setOpenForm(false);
    setCidade("");
    setLogradouro("");
    setNum("");
    setErroCidade(false);
    setErroLog(false);
    setErroNum(false);
  };

  const handleOpenFormAlterar = async (eid, num, logradouro, cidade) => {
    setOpenFormAlterar(true);
    console.log(eid);
    setEid(eid);
    setCidade(cidade);
    setNum(num);
    setLogradouro(logradouro);
  };
  const handleCloseFormAlterar = () => {
    setOpenFormAlterar(false);
    setCidade("");
    setLogradouro("");
    setNum("");
    setEid(0);
    setErroCidade(false);
    setErroLog(false);
    setErroNum(false);
  };

  const handleAdicionarEndereco = async () => {
    setErroCidade(false);
    setErroLog(false);
    setErroNum(false);
    if (cidade === "" || logradouro === "" || num === "") {
      if (cidade === "") {
        setErroCidade(true);
      }
      if (logradouro === "") {
        setErroLog(true);
      }
      if (num === "") {
        setErroNum(true);
      }
      alert("Por favor preencha todos os campus");
    } else if (isNaN(Number(num))) {
      setErroNum(true);
      alert("Por favor insira um número");
    } else {
      adicionarEndereco();
    }
  };

  const handleAlterarEndereco = async () => {
    setErroCidade(false);
    setErroLog(false);
    setErroNum(false);
    if (cidade === "" || logradouro === "" || num === "") {
      if (cidade === "") {
        setErroCidade(true);
      }
      if (logradouro === "") {
        setErroLog(true);
      }
      if (num === "") {
        setErroNum(true);
      }
      alert("Por favor preencha todos os campus");
    } else if (isNaN(Number(num))) {
      setErroNum(true);
      alert("Por favor insira um número");
    } else {
      alterarEndereco();
    }
  };

  const adicionarEndereco = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:3010/criarendereco",
        { num: num, logradouro: logradouro, cidade: cidade }, // Dados do novo endereço
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      buscarEnderecos(); // Atualiza a lista de endereços
      handleCloseForm();
    } catch (error) {
      console.error("Erro ao adicionar endereço:", error);
    }
  };

  const alterarEndereco = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:3010/alterarendereco",
        { num: num, logradouro: logradouro, cidade: cidade, eid: eid },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      buscarEnderecos(); // Atualiza a lista de endereços
      handleCloseFormAlterar();
    } catch (error) {
      console.error("Erro ao alterar endereço:", error);
    }
  };

  const excluirEndereco = async (eid) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:3010/excluirendereco`,
        { eid: eid },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      buscarEnderecos();
    } catch (error) {
      console.error("Erro ao excluir endereço:", error);
    }
  };

  return (
    <div id="enderecos">
      <Container id="cont_end">
        <Row className="row_end">
          <p className="txt_end">Endereços</p>
          <Button variant="text" className="item" onClick={handleOpenForm}>
            <AddIcon id="mais" />
          </Button>
        </Row>

        {enderecos.map((endereco) => (
          <Row key={endereco.eid} className="row_endereco">
            <p className="txt_endereco">
              {endereco.cidade}, {endereco.logradouro}, {endereco.num}
            </p>
            <div className="actions">
              <Button
                variant="text"
                color="primary"
                size="small"
                onClick={() =>
                  handleOpenFormAlterar(
                    endereco.eid,
                    endereco.num,
                    endereco.logradouro,
                    endereco.cidade
                  )
                }
              >
                Alterar
              </Button>
              <Button
                variant="text"
                color="secondary"
                size="small"
                onClick={() => excluirEndereco(endereco.eid)}
              >
                Excluir
              </Button>
            </div>
          </Row>
        ))}

        <Dialog open={openForm} onClose={handleCloseForm}>
          <DialogTitle>Adicionar novo endereço</DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              label="Cidade"
              type="text"
              fullWidth
              error={errocidade}
              variant="outlined"
              value={cidade}
              onChange={(event) => {
                setCidade(event.target.value);
              }}
            />
            <TextField
              margin="dense"
              label="Logradouro"
              type="text"
              fullWidth
              error={errolog}
              variant="outlined"
              value={logradouro}
              onChange={(event) => {
                setLogradouro(event.target.value);
              }}
            />{" "}
            <TextField
              autoFocus
              margin="dense"
              label="Número"
              type="text"
              fullWidth
              variant="outlined"
              error={erronum}
              value={num}
              onChange={(event) => {
                setNum(event.target.value);
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button
              variant="text"
              className="item"
              onClick={handleCloseForm}
              sx={{ color: "#068146" }}
            >
              Cancelar
            </Button>
            <Button
              variant="text"
              className="item"
              onClick={handleAdicionarEndereco}
              sx={{ color: "#068146" }}
            >
              Adicionar
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={openFormAlterar} onClose={handleCloseFormAlterar}>
          <DialogTitle>Alterar endereço</DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              label="Cidade"
              type="text"
              fullWidth
              error={errocidade}
              variant="outlined"
              value={cidade}
              onChange={(event) => {
                setCidade(event.target.value);
              }}
            />
            <TextField
              margin="dense"
              label="Logradouro"
              type="text"
              fullWidth
              error={errolog}
              variant="outlined"
              value={logradouro}
              onChange={(event) => {
                setLogradouro(event.target.value);
              }}
            />{" "}
            <TextField
              autoFocus
              margin="dense"
              label="Número"
              type="text"
              fullWidth
              error={erronum}
              variant="outlined"
              value={num}
              onChange={(event) => {
                setNum(event.target.value);
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button
              variant="text"
              className="item"
              onClick={handleCloseFormAlterar}
              sx={{ color: "#068146" }}
            >
              Cancelar
            </Button>
            <Button
              variant="text"
              className="item"
              onClick={handleAlterarEndereco}
              sx={{ color: "#068146" }}
            >
              Alterar
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </div>
  );
}

export default Enderecos;
