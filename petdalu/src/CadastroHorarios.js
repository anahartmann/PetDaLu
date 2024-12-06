import "./CadastroHorarios.css";
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

function CadastroHorarios() {
  const [diasDaSemana, setDiasDaSemana] = useState([]);
  const [horariosPorDia, setHorariosPorDia] = useState([]);

  async function buscarhorarios() {
    try {
      const token = localStorage.getItem("token"); // Recupera o token JWT
      const response = await axios.get("http://localhost:3010/horarios", {
        headers: {
          Authorization: `Bearer ${token}`, // Adiciona o token no cabeçalho
        },
      });
      setHorariosPorDia(response.data); // Atualiza os dados no estado
    } catch (error) {
      console.error("Erro ao buscar horarios:", error);
    }
  }

  // Faz a requisição quando o componente é montado
  useEffect(() => {
    buscarhorarios();
    buscardatas();
  }, []);

  // Estados para controlar o formulário de novo endereço
  const [openFormHorario, setOpenFormHorario] = useState(false);
  const [hora, setHora] = useState("");
  const [horaant, setHoraAnt] = useState("");
  const [dia, setDia] = useState("");
  const [diaAnt, setDiaAnt] = useState("");
  const [descr, setDescr] = useState("");
  const [errohora, seterroHora] = useState("");
  const [errodia, seterroDia] = useState("");
  const [errodescr, seterroDescr] = useState("");

  const [openFormAlterarHorario, setOpenFormAlterarHorario] = useState(false);

  const handleOpenFormHorario = () => setOpenFormHorario(true);
  const handleCloseFormHorario = () => {
    setOpenFormHorario(false);
    setHora("");
    seterroHora(false);
  };

  const handleOpenFormAlterarHorario = async (hora) => {
    setOpenFormAlterarHorario(true);
    setHora(hora);
    setHoraAnt(hora);
  };
  const handleCloseFormAlterarHorario = () => {
    setOpenFormAlterarHorario(false);
    setHora("");
    setHoraAnt("");
    seterroHora(false);
  };

  const handleAdicionarHorario = async () => {
    seterroHora(false);
    if (hora === "") {
      seterroHora(true);
      alert("Por favor preencha todos os campos");
    } else {
      adicionarHorario();
    }
  };

  const handleAlterarHorario = async () => {
    seterroHora(false);

    if (hora === "") {
      seterroHora(true);
      alert("Por favor preencha todos os campos");
    } else {
      alterarHorario();
    }
  };

  const adicionarHorario = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:3010/criarhorarios",
        { horario: hora }, // Dados do novo endereço
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      buscarhorarios(); // Atualiza a lista de horarios
      handleCloseFormHorario();
    } catch (error) {
      console.error("Erro ao adicionar horario:", error);
    }
  };

  const alterarHorario = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:3010/alterarhorarios",
        { horario: hora, horarioant: horaant },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      buscarhorarios(); // Atualiza a lista de horarios
      handleCloseFormAlterarHorario();
    } catch (error) {
      console.error("Erro ao alterar horario:", error);
    }
  };

  const excluirhorario = async (hora) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:3010/excluirhorarios`,
        { horario: hora },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      buscarhorarios();
    } catch (error) {
      console.error("Erro ao excluir horario:", error);
    }
  };

  // Data -----------------------------------------------------------------------------

  async function buscardatas() {
    try {
      const token = localStorage.getItem("token"); // Recupera o token JWT
      const response = await axios.get("http://localhost:3010/datas", {
        headers: {
          Authorization: `Bearer ${token}`, // Adiciona o token no cabeçalho
        },
      });
      setDiasDaSemana(response.data); // Atualiza os dados no estado
    } catch (error) {
      console.error("Erro ao buscar datas:", error);
    }
  }

  // Estados para controlar o formulário de novo endereço
  const [openFormData, setOpenFormData] = useState(false);

  const [openFormAlterarData, setOpenFormAlterarData] = useState(false);

  const handleOpenFormData = () => setOpenFormData(true);
  const handleCloseFormData = () => {
    setOpenFormData(false);
    setDescr("");
    setDia("");

    seterroDescr(false);
    seterroDia(false);
  };

  const handleOpenFormAlterarData = async (descr, dia) => {
    setOpenFormAlterarData(true);
    setDescr(descr);
    setDia(dia);
    setDiaAnt(dia);
  };
  const handleCloseFormAlterarData = () => {
    setOpenFormAlterarData(false);
    setDescr("");
    setDia("");
    setDiaAnt("");
    seterroDescr(false);
    seterroDia(false);
  };

  const handleAdicionarData = async () => {
    seterroDia(false);
    seterroDescr(false);
    if (dia === "" || descr === "") {
      if (dia === "") {
        seterroDia(true);
      }
      if (descr === "") {
        seterroDescr(true);
      }

      alert("Por favor preencha todos os campos");
    } else {
      adicionarData();
    }
  };

  const handleAlterarData = async () => {
    seterroDia(false);
    seterroDescr(false);
    if (dia === "" || descr === "") {
      if (dia === "") {
        seterroDia(true);
      }
      if (descr === "") {
        seterroDescr(true);
      }

      alert("Por favor preencha todos os campos");
    } else {
      alterarData();
    }
  };

  const adicionarData = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:3010/criardatas",
        { data: dia, descr: descr }, // Dados do novo endereço
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      buscardatas(); // Atualiza a lista de datas
      handleCloseFormData();
    } catch (error) {
      console.error("Erro ao adicionar Data:", error);
    }
  };

  const alterarData = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:3010/alterardatas",
        { data: dia, descr: descr, dataant: diaAnt },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      buscardatas(); // Atualiza a lista de datas
      handleCloseFormAlterarData();
    } catch (error) {
      console.error("Erro ao alterar Data:", error);
    }
  };

  const excluirData = async (dia) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:3010/excluirdatas`,
        { data: dia },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      buscardatas();
    } catch (error) {
      console.error("Erro ao excluir data:", error);
    }
  };

  const formatarDataBrasileira = (data) => {
    if (!data) return "";
    const partes = data.split("-");
    const p3 = partes[2].split("T");
    return `${p3[0]}/${partes[1]}/${partes[0]}`;
  };

  return (
    <div id="cadHorarios">
      {/* dias */}
      <Container id="cont_end">
        <Row className="row_end">
          <p className="txt_end">Dias</p>
          <Button variant="text" className="item" onClick={handleOpenFormData}>
            <AddIcon id="mais" />
          </Button>
        </Row>

        {diasDaSemana.map((dia) => (
          <Row key={dia.data} className="row_dia">
            <p className="txt_dia">
              {formatarDataBrasileira(dia.data)} - {dia.descr}
            </p>
            <div className="actions">
              <Button
                variant="text"
                color="primary"
                size="small"
                onClick={() =>
                  handleOpenFormAlterarData(
                    dia.descr,
                    formatarDataBrasileira(dia.data)
                  )
                }
              >
                Alterar
              </Button>
              <Button
                variant="text"
                color="secondary"
                size="small"
                onClick={() => excluirData(dia.data)}
              >
                Excluir
              </Button>
            </div>
          </Row>
        ))}

        <Dialog open={openFormData} onClose={handleCloseFormData}>
          <DialogTitle>Adicionar novo dia</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Data (DD/MM)"
              type="text"
              fullWidth
              error={errodia}
              variant="outlined"
              value={dia}
              onChange={(e) => setDia(e.target.value)}
            />
            <TextField
              margin="dense"
              label="Dia da Semana"
              type="text"
              fullWidth
              error={errodescr}
              variant="outlined"
              value={descr}
              onChange={(e) => setDescr(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button
              variant="text"
              className="item"
              onClick={handleCloseFormData}
              sx={{ color: "#068146" }}
            >
              Cancelar
            </Button>
            <Button
              variant="text"
              className="item"
              onClick={handleAdicionarData}
              sx={{ color: "#068146" }}
            >
              Adicionar
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={openFormAlterarData} onClose={handleCloseFormAlterarData}>
          <DialogTitle>Alterar dia</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Data (DD/MM)"
              type="text"
              fullWidth
              error={errodia}
              variant="outlined"
              value={dia}
              onChange={(e) => setDia(e.target.value)}
            />
            <TextField
              margin="dense"
              label="Dia da Semana"
              type="text"
              fullWidth
              error={errodescr}
              variant="outlined"
              value={descr}
              onChange={(e) => setDescr(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button
              variant="text"
              className="item"
              onClick={handleCloseFormAlterarData}
              sx={{ color: "#068146" }}
            >
              Cancelar
            </Button>
            <Button
              variant="text"
              className="item"
              onClick={handleAlterarData}
              sx={{ color: "#068146" }}
            >
              Alterar
            </Button>
          </DialogActions>
        </Dialog>
      </Container>

      {/* horarios */}
      <Container id="cont_horarios">
        <Row className="row_end">
          <p className="txt_end">Horários</p>
          <Button
            variant="text"
            className="item"
            onClick={handleOpenFormHorario}
          >
            <AddIcon id="mais" />
          </Button>
        </Row>

        {horariosPorDia.map((horario) => (
          <Row key={horario.hora} className="row_horario">
            <p className="txt_horario">{horario.hora}</p>
            <div className="actions">
              <Button
                variant="text"
                className="item"
                color="primary"
                size="small"
                onClick={() => handleOpenFormAlterarHorario(horario.hora)}
              >
                Alterar
              </Button>
              <Button
                variant="text"
                className="item"
                color="secondary"
                size="small"
                onClick={() => excluirhorario(horario.hora)}
              >
                Excluir
              </Button>
            </div>
          </Row>
        ))}

        <Dialog open={openFormHorario} onClose={handleCloseFormHorario}>
          <DialogTitle>Adicionar novo horário</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Horário (HH:MM)"
              type="text"
              error={errohora}
              fullWidth
              variant="outlined"
              value={hora}
              onChange={(e) => setHora(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button
              variant="text"
              className="item"
              onClick={handleCloseFormAlterarHorario}
              sx={{ color: "#068146" }}
            >
              Cancelar
            </Button>
            <Button
              variant="text"
              className="item"
              onClick={handleAdicionarHorario}
              sx={{ color: "#068146" }}
            >
              Adicionar
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={openFormAlterarHorario}
          onClose={handleCloseFormAlterarHorario}
        >
          <DialogTitle>Alterar horário</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Horário (HH:MM)"
              type="text"
              error={errohora}
              fullWidth
              variant="outlined"
              value={hora}
              onChange={(e) => setHora(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button
              variant="text"
              className="item"
              onClick={handleCloseFormAlterarHorario}
              sx={{ color: "#068146" }}
            >
              Cancelar
            </Button>
            <Button
              variant="text"
              className="item"
              onClick={handleAlterarHorario}
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

export default CadastroHorarios;
