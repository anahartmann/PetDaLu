import "./CadastroHorarios.css";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import AddIcon from "@mui/icons-material/Add";
import React, { useState } from "react";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

function CadastroHorarios() {
  const [diasDaSemana, setDiasDaSemana] = useState([
    { data: "11/11", dia: "Segunda-feira" },
    { data: "12/11", dia: "Terça-feira" },
  ]);
  const [horariosPorDia, setHorariosPorDia] = useState([
    "13:30",
    "14:30",
    "15:30",
    "16:30",
    "17:30",
  ]);

  const [openDiaForm, setOpenDiaForm] = useState(false);
  const [openHorarioForm, setOpenHorarioForm] = useState(false);
  const [novoDia, setNovoDia] = useState("");
  const [novaData, setNovaData] = useState("");
  const [novoHorario, setNovoHorario] = useState("");
  const [horarioSelecionado, setHorarioSelecionado] = useState(null);

  const handleOpenDiaForm = () => setOpenDiaForm(true);
  const handleCloseDiaForm = () => {
    setOpenDiaForm(false);
    setNovoDia("");
    setNovaData("");
  };

  const adicionarDia = () => {
    if (novoDia.trim() && novaData.trim()) {
      setDiasDaSemana([...diasDaSemana, { data: novaData, dia: novoDia }]);
    }
    handleCloseDiaForm();
  };

  const excluirDia = (data) => {
    setDiasDaSemana(diasDaSemana.filter((dia) => dia.data !== data));
  };

  const handleOpenHorarioForm = (horario = null) => {
    setHorarioSelecionado(horario);
    setNovoHorario(horario || "");
    setOpenHorarioForm(true);
  };

  const handleCloseHorarioForm = () => {
    setOpenHorarioForm(false);
    setNovoHorario("");
    setHorarioSelecionado(null);
  };

  const adicionarOuEditarHorario = () => {
    if (novoHorario.trim()) {
      if (horarioSelecionado !== null) {
        // editar horario
        setHorariosPorDia(
          horariosPorDia.map((h) =>
            h === horarioSelecionado ? novoHorario : h
          )
        );
      } else {
        // adicionar novo horario
        setHorariosPorDia([...horariosPorDia, novoHorario]);
      }
    }
    handleCloseHorarioForm();
  };

  const excluirHorario = (horario) => {
    setHorariosPorDia(horariosPorDia.filter((h) => h !== horario));
  };

  return (
    <div id="cadHorarios">
      {/* dias */}
      <Container id="cont_end">
        <Row className="row_end">
          <p className="txt_end">Dias</p>
          <Button variant="text" className="item" onClick={handleOpenDiaForm}>
            <AddIcon id="mais" />
          </Button>
        </Row>

        {diasDaSemana.map((dia, index) => (
          <Row key={index} className="row_dia">
            <p className="txt_dia">
              {dia.data} - {dia.dia}
            </p>
            <div className="actions">
              <Button
                variant="text"
                color="primary"
                size="small"
                onClick={() => alert(`Alterar ${dia.dia}`)}
              >
                Alterar
              </Button>
              <Button
                variant="text"
                color="secondary"
                size="small"
                onClick={() => excluirDia(dia.data)}
              >
                Excluir
              </Button>
            </div>
          </Row>
        ))}

        <Dialog open={openDiaForm} onClose={handleCloseDiaForm}>
          <DialogTitle>Adicionar novo dia</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Data (DD/MM)"
              type="text"
              fullWidth
              variant="outlined"
              value={novaData}
              onChange={(e) => setNovaData(e.target.value)}
            />
            <TextField
              margin="dense"
              label="Dia da Semana"
              type="text"
              fullWidth
              variant="outlined"
              value={novoDia}
              onChange={(e) => setNovoDia(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button
              variant="text"
              className="item"
              onClick={handleCloseDiaForm}
              sx={{ color: "#068146" }}
            >
              Cancelar
            </Button>
            <Button
              variant="text"
              className="item"
              onClick={adicionarDia}
              sx={{ color: "#068146" }}
            >
              Adicionar
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
            onClick={() => handleOpenHorarioForm()}
          >
            <AddIcon id="mais" />
          </Button>
        </Row>

        {horariosPorDia.map((horario, index) => (
          <Row key={index} className="row_horario">
            <p className="txt_horario">{horario}</p>
            <div className="actions">
              <Button
                variant="text"
                className="item"
                color="primary"
                size="small"
                onClick={() => handleOpenHorarioForm(horario)}
              >
                Alterar
              </Button>
              <Button
                variant="text"
                className="item"
                color="secondary"
                size="small"
                onClick={() => excluirHorario(horario)}
              >
                Excluir
              </Button>
            </div>
          </Row>
        ))}

        <Dialog open={openHorarioForm} onClose={handleCloseHorarioForm}>
          <DialogTitle>
            {horarioSelecionado ? "Alterar horário" : "Adicionar novo horário"}
          </DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Horário (HH:MM)"
              type="text"
              fullWidth
              variant="outlined"
              value={novoHorario}
              onChange={(e) => setNovoHorario(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button
              variant="text"
              className="item"
              onClick={handleCloseHorarioForm}
              sx={{ color: "#068146" }}
            >
              Cancelar
            </Button>
            <Button
              variant="text"
              className="item"
              onClick={adicionarOuEditarHorario}
              sx={{ color: "#068146" }}
            >
              {horarioSelecionado ? "Alterar" : "Adicionar"}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </div>
  );
}

export default CadastroHorarios;
