import "./Anotacoes.css";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import AddIcon from "@mui/icons-material/Add";
import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Checkbox,
} from "@mui/material";
import axios from "axios";

function Anotacoes() {
  const [Anotacoes, setAnotacoes] = useState([]);

  // Função para buscar os endereços da API
  async function buscarAnotacoes() {
    try {
      const token = localStorage.getItem("token"); // Recupera o token JWT
      const response = await axios.get("http://localhost:3010/anotacoes", {
        headers: {
          Authorization: `Bearer ${token}`, // Adiciona o token no cabeçalho
        },
      });
      setAnotacoes(response.data); // Atualiza os dados no estado
    } catch (error) {
      console.error("Erro ao buscar endereços:", error);
    }
  }

  // Faz a requisição quando o componente é montado
  useEffect(() => {
    buscarAnotacoes();
  }, []);

  // Estados para controlar o formulário de novo endereço
  const [openForm, setOpenForm] = useState(false);
  const [andescr, setAndescr] = useState(""); // Estado para o número
  const [feito, setFeito] = useState(""); // Estado para o logradouro
  const [anid, setAnid] = useState(""); // Estado para a cidade
  const [erroandescr, setErroAndescr] = useState(false);

  const [openFormAlterar, setOpenFormAlterar] = useState(false);

  const handleOpenForm = () => setOpenForm(true);
  const handleCloseForm = () => {
    setOpenForm(false);
    setAndescr("");
    setFeito("");
    setAnid("");
    setErroAndescr(false);
  };

  const handleOpenFormAlterar = async (anid, andescr, feito) => {
    setOpenFormAlterar(true);

    setAnid(anid);
    setAndescr(andescr);
    setFeito(feito);
  };
  const handleCloseFormAlterar = () => {
    setOpenFormAlterar(false);
    setAndescr("");
    setFeito("");
    setAnid("");
    setErroAndescr(false);
  };

  const handleAdicionarAnotacao = async () => {
    setErroAndescr(false);
    if (andescr === "") {
      setErroAndescr(true);
      alert("Por favor preencha todos os campos");
    } else {
      adicionarAnotacao();
    }
  };

  const handleCheck = async (feito) => {
    console.log(feito);
    if (feito === "s") {
      setFeito("n");
    } else {
      setFeito("s");
    }
  };

  const handleAlterarAnotacao = async () => {
    setErroAndescr(false);
    if (andescr === "") {
      setErroAndescr(true);
      alert("Por favor preencha todos os campos");
    } else {
      alterarAnotacao();
    }
  };

  const adicionarAnotacao = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:3010/criaranotacoes",
        { andescr: andescr, feito: "n" }, // Dados do novo endereço
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      buscarAnotacoes(); // Atualiza a lista de endereços
      handleCloseForm();
    } catch (error) {
      console.error("Erro ao adicionar anotação:", error);
    }
  };

  const alterarAnotacao = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:3010/alteraranotacoes",
        { andescr: andescr, feito: feito, anid: anid },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      buscarAnotacoes(); // Atualiza a lista de endereços
      handleCloseFormAlterar();
    } catch (error) {
      console.error("Erro ao alterar anotação:", error);
    }
  };

  const excluirAnotacao = async (anid) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:3010/excluiranotacoes`,
        { anid: anid },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      buscarAnotacoes();
    } catch (error) {
      console.error("Erro ao excluir anotações:", error);
    }
  };

  return (
    <div id="Anotacoes">
      <Container id="cont_ano">
        <Row className="row_ano">
          <p className="txt_ano">Anotações</p>
          <Button variant="text" className="item" onClick={handleOpenForm}>
            <AddIcon id="mais" />
          </Button>
        </Row>

        {Anotacoes.map((Anotacao) => (
          <Row key={Anotacao.anid} className="row_Anotacao">
            <Checkbox
              checked={Anotacao.feito === "s"}
              onClick={() =>
                handleOpenFormAlterar(
                  Anotacao.anid,
                  Anotacao.andescr,
                  Anotacao.feito
                )
              }
              color="default"
              sx={{
                color: "#068146",
                "&.Mui-checked": {
                  color: "#068146",
                },
              }}
            />
            <p className="txt_Anotacao">{Anotacao.andescr}</p>
            <div className="actions">
              <Button
                variant="text"
                sx={{ color: "#068146" }}
                size="small"
                onClick={() =>
                  handleOpenFormAlterar(
                    Anotacao.anid,
                    Anotacao.andescr,
                    Anotacao.feito
                  )
                }
              >
                Alterar
              </Button>
              <Button
                variant="text"
                sx={{ color: "#068146" }}
                size="small"
                onClick={() => excluirAnotacao(Anotacao.anid)}
              >
                Excluir
              </Button>
            </div>
          </Row>
        ))}

        <Dialog open={openForm} onClose={handleCloseForm}>
          <DialogTitle>Adicionar nova anotação</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Nova anotação"
              type="text"
              fullWidth
              error={erroandescr}
              variant="outlined"
              value={andescr}
              onChange={(event) => {
                setAndescr(event.target.value);
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
              onClick={handleAdicionarAnotacao}
              sx={{ color: "#068146" }}
            >
              Adicionar
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={openFormAlterar} onClose={handleCloseFormAlterar}>
          <DialogTitle>Alterar anotação</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Alterar anotação"
              type="text"
              fullWidth
              error={erroandescr}
              variant="outlined"
              value={andescr}
              onChange={(event) => {
                setAndescr(event.target.value);
              }}
            />
            <div className="checkbox-container">
              <Checkbox
                checked={feito === "s"}
                onClick={() => handleCheck(feito)}
                color="default"
                sx={{
                  color: "#068146",
                  "&.Mui-checked": {
                    color: "#068146",
                  },
                }}
              ></Checkbox>

              <label>Feito</label>
            </div>
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
              onClick={handleAlterarAnotacao}
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

export default Anotacoes;
