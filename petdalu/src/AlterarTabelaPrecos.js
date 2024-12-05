import "./AlterarTabelaPrecos.css";
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
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { FormControl, Select, MenuItem, InputLabel } from "@mui/material";

function AlterarTabelaPrecos({ userRole }) {
  const [servicos, setServicos] = useState([]);

  async function buscarServicos() {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:3010/servico", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setServicos(response.data);
    } catch (error) {
      console.error("Erro ao buscar serviços:", error);
    }
  }

  useEffect(() => {
    buscarServicos();
  }, []);

  const [openForm, setOpenForm] = useState(false);
  const [preco, setPreco] = useState("");
  const [sdescr, setSdescr] = useState("");
  const [porte, setPorte] = useState("");
  const [erropreco, setErroPreco] = useState(false);
  const [errosdescr, setErroSdescr] = useState(false);
  const [errosporte, setErroPorte] = useState(false);
  const [sid, setSid] = useState("");
  const [openFormAlterar, setOpenFormAlterar] = useState(false);

  const handleOpenForm = () => setOpenForm(true);

  const handleCloseForm = () => {
    setOpenForm(false);
    setPreco("");
    setSdescr("");
    setSid("");
    setPorte("");
    setErroPorte(false);
    setErroPreco(false);
    setErroSdescr(false);
  };

  const handleOpenFormAlterar = async (sid, preco, sdescr, porte) => {
    setOpenFormAlterar(true);
    setPreco(preco);
    setSdescr(sdescr);
    setSid(sid);
    setPorte(porte);
  };
  const handleCloseFormAlterar = () => {
    setOpenFormAlterar(false);
    setPreco("");
    setSdescr("");
    setSid("");
    setPorte("");
    setErroPorte(false);
    setErroPreco(false);
    setErroSdescr(false);
  };

  const adicionarServico = async () => {
    try {
      const token = localStorage.getItem("token");
      if (sdescr === "Entrega/Retirada") {
        await axios.post(
          "http://localhost:3010/criarservico",
          { preco: preco, sdescr: sdescr, porte: "-" },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        await axios.post(
          "http://localhost:3010/criarservico",
          { preco: preco, sdescr: sdescr, porte: porte },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }
      buscarServicos(); // Atualiza a lista de endereços
      handleCloseForm();
    } catch (error) {
      console.error("Erro ao adicionar serviço:", error);
    }
  };

  const alterarServico = async () => {
    try {
      const token = localStorage.getItem("token");
      if (sdescr === "Entrega/Retirada") {
        await axios.post(
          "http://localhost:3010/alterarservico",
          { preco: preco, sdescr: sdescr, sid: sid, porte: "-" },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        await axios.post(
          "http://localhost:3010/alterarservico",
          { preco: preco, sdescr: sdescr, sid: sid, porte: porte },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }
      buscarServicos(); // Atualiza a lista de endereços
      handleCloseFormAlterar();
    } catch (error) {
      console.error("Erro ao alterar serviço:", error);
    }
  };

  const excluirServico = async (sid) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:3010/excluirservico`,
        { sid: sid },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      buscarServicos(); // Atualiza a lista de endereços
    } catch (error) {
      console.error("Erro ao excluir serviço:", error);
    }
  };

  function handleadicionarServico() {
    setErroPreco(false);
    setErroSdescr(false);
    setErroPorte(false);
    if (
      sdescr === "" ||
      preco === "" ||
      (sdescr !== "Entrega/Retirada" && porte === "")
    ) {
      alert("Por favor preencha todos os campos");
      if (sdescr === "") {
        setErroSdescr(true);
      }
      if (preco === "") {
        setErroPreco(true);
      }

      if (sdescr !== "Entrega/Retirada" && porte === "") {
        setErroPorte(true);
      }
    } else if (isNaN(Number(preco))) {
      setErroPreco(true);
      alert("Por favor insira um número");
    } else {
      adicionarServico();
    }
  }

  function handlealterarServico() {
    setErroPreco(false);
    setErroSdescr(false);
    setErroPorte(false);
    if (
      sdescr === "" ||
      preco === "" ||
      (sdescr !== "Entrega/Retirada" && porte === "")
    ) {
      alert("Por favor preencha todos os campos");
      if (sdescr === "") {
        setErroSdescr(true);
      }
      if (preco === "") {
        setErroPreco(true);
      }

      if (sdescr !== "Entrega/Retirada" && porte === "") {
        setErroPorte(true);
      }
    } else if (isNaN(Number(preco))) {
      setErroPreco(true);
      alert("Por favor insira um número");
    } else {
      alterarServico();
    }
  }

  const tipodeservico = ["Banho", "Tosa", "Banho + Tosa", "Entrega/Retirada"];
  const tipoPorte = ["Grande", "Médio", "Pequeno"];

  return (
    <div id="tabela-clientes">
      <Container id="cont_tabela">
        <Row className="row_tabela">
          <p className="txt_tabela">Serviços e Preços</p>
          <Button
            variant="text"
            className="item"
            onClick={() => handleOpenForm()}
          >
            <AddIcon id="mais" />
          </Button>
        </Row>
        <table className="clientes-tabela">
          <thead>
            <tr>
              <th>Serviço</th>
              <th>Porte</th>
              <th>Valor</th>
              {userRole ? <th colSpan={2}>Ações</th> : <div></div>}
            </tr>
          </thead>
          <tbody>
            {servicos.map((servico) => (
              <tr key={servico.sid}>
                <td>{servico.sdescr}</td>
                <td>{servico.porte}</td>
                <td>R$ {servico.preco}</td>
                {userRole ? (
                  <div>
                    <td>
                      <Button
                        variant="text"
                        sx={{ color: "#068146" }}
                        size="small"
                        onClick={() =>
                          handleOpenFormAlterar(
                            servico.sid,
                            servico.preco,
                            servico.sdescr,
                            servico.porte
                          )
                        }
                      >
                        <EditIcon></EditIcon>
                      </Button>
                    </td>
                    <td>
                      <Button
                        variant="text"
                        sx={{ color: "#068146" }}
                        size="small"
                        onClick={() => excluirServico(servico.sid)}
                      >
                        <DeleteIcon></DeleteIcon>
                      </Button>
                    </td>
                  </div>
                ) : (
                  <div></div>
                )}
              </tr>
            ))}
          </tbody>
        </table>

        <Dialog open={openForm} onClose={handleCloseForm}>
          <DialogTitle>Adicionar novo serviço</DialogTitle>
          <DialogContent>
            <FormControl fullWidth>
              <InputLabel id="servico-label">
                Selecione tipo de serviço
              </InputLabel>
              <Select
                labelId="servico-label"
                value={sdescr}
                error={errosdescr}
                onChange={(e) => setSdescr(e.target.value)}
              >
                {tipodeservico.map((tipo, index) => (
                  <MenuItem key={index} value={tipo}>
                    {tipo}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {sdescr !== "Entrega/Retirada" && sdescr !== "" ? (
              <FormControl fullWidth>
                <InputLabel id="porte-label">
                  Selecione o porte do pet
                </InputLabel>
                <Select
                  labelId="porte-label"
                  value={porte}
                  error={errosporte}
                  onChange={(e) => setPorte(e.target.value)}
                >
                  {tipoPorte.map((tipo, index) => (
                    <MenuItem key={index} value={tipo}>
                      {tipo}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : (
              <div></div>
            )}
            <TextField
              margin="dense"
              label="Valor"
              name="valor"
              value={preco}
              error={erropreco}
              onChange={(event) => {
                setPreco(event.target.value);
              }}
              fullWidth
              variant="outlined"
            />
          </DialogContent>
          <DialogActions>
            <Button
              variant="text"
              onClick={handleCloseForm}
              sx={{ color: "#068146" }}
            >
              Cancelar
            </Button>
            <Button
              variant="text"
              onClick={handleadicionarServico}
              sx={{ color: "#068146" }}
            >
              Adicionar
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={openFormAlterar} onClose={handleCloseFormAlterar}>
          <DialogTitle>Alterar serviço</DialogTitle>
          <DialogContent>
            <FormControl fullWidth>
              <InputLabel id="servico-label">
                Selecione tipo de serviço
              </InputLabel>
              <Select
                labelId="servico-label"
                value={sdescr}
                error={errosdescr}
                onChange={(e) => setSdescr(e.target.value)}
              >
                {tipodeservico.map((tipo, index) => (
                  <MenuItem key={index} value={tipo}>
                    {tipo}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {sdescr !== "Entrega/Retirada" && sdescr !== "" ? (
              <FormControl fullWidth>
                <InputLabel id="porte-label">
                  Selecione o porte do pet
                </InputLabel>
                <Select
                  labelId="porte-label"
                  value={porte}
                  error={errosporte}
                  onChange={(e) => setPorte(e.target.value)}
                >
                  {tipoPorte.map((tipo, index) => (
                    <MenuItem key={index} value={tipo}>
                      {tipo}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : (
              <div></div>
            )}

            <TextField
              margin="dense"
              label="Valor"
              name="valor"
              error={erropreco}
              value={preco}
              onChange={(event) => {
                setPreco(event.target.value);
              }}
              fullWidth
              variant="outlined"
            />
          </DialogContent>
          <DialogActions>
            <Button
              variant="text"
              onClick={handleCloseFormAlterar}
              sx={{ color: "#068146" }}
            >
              Cancelar
            </Button>
            <Button
              variant="text"
              onClick={handlealterarServico}
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

export default AlterarTabelaPrecos;
