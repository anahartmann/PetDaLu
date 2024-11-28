import "./Animais.css";
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
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel,
} from "@mui/material";

function Animais() {
  const [Animais, setAnimais] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [novoAnimal, setNovoAnimal] = useState({
    nome: "",
    especie: "",
    porte: "",
    comportamento: "",
    sexo: "",
    permissaoTosa: false,
    tutor: "",
  });

  const tutores = ["Ana", "Alex", "Maria", "Sophia"];

  const handleOpenForm = () => setOpenForm(true);
  const handleCloseForm = () => {
    setOpenForm(false);
    setNovoAnimal({
      nome: "",
      especie: "",
      porte: "",
      comportamento: "",
      sexo: "",
      permissaoTosa: false,
      tutor: "",
    });
  };

  const adicionarAnimal = () => {
    if (novoAnimal.nome.trim()) {
      setAnimais([...Animais, { id: Animais.length + 1, ...novoAnimal }]);
    }
    handleCloseForm();
  };

  const excluirAnimal = (id) => {
    setAnimais(Animais.filter((Animal) => Animal.id !== id));
  };

  return (
    <div id="Animais">
      <Container id="cont_ani">
        <Row className="row_ani">
          <p className="txt_ani">Animais</p>
          <Button variant="text" className="item" onClick={handleOpenForm}>
            <AddIcon id="mais" />
          </Button>
        </Row>

        {Animais.map((Animal) => (
          <Row key={Animal.id} className="row_Animal">
            <p className="txt_Animal">
              {Animal.nome} ({Animal.especie}) - {Animal.tutor}
            </p>
            <div className="actions">
              <Button
                variant="text"
                color="primary"
                size="small"
                onClick={() => alert(`Alterar ${Animal.nome}`)}
              >
                Alterar
              </Button>
              <Button
                variant="text"
                color="secondary"
                size="small"
                onClick={() => excluirAnimal(Animal.id)}
              >
                Excluir
              </Button>
            </div>
          </Row>
        ))}

        <Dialog open={openForm} onClose={handleCloseForm}>
          <DialogTitle>Adicionar novo pet</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Nome"
              type="text"
              fullWidth
              variant="outlined"
              value={novoAnimal.nome}
              onChange={(e) =>
                setNovoAnimal({ ...novoAnimal, nome: e.target.value })
              }
            />

            <TextField
              margin="dense"
              label="Espécie"
              type="text"
              fullWidth
              variant="outlined"
              value={novoAnimal.especie}
              onChange={(e) =>
                setNovoAnimal({ ...novoAnimal, especie: e.target.value })
              }
            />

            <FormControl fullWidth margin="dense">
              <InputLabel>Porte</InputLabel>
              <Select
                value={novoAnimal.porte}
                onChange={(e) =>
                  setNovoAnimal({ ...novoAnimal, porte: e.target.value })
                }
              >
                <MenuItem value="Pequeno">Pequeno</MenuItem>
                <MenuItem value="Médio">Médio</MenuItem>
                <MenuItem value="Grande">Grande</MenuItem>
              </Select>
            </FormControl>

            <TextField
              margin="dense"
              label="Comportamento"
              type="text"
              fullWidth
              variant="outlined"
              value={novoAnimal.comportamento}
              onChange={(e) =>
                setNovoAnimal({ ...novoAnimal, comportamento: e.target.value })
              }
            />

            <FormControl fullWidth margin="dense">
              <InputLabel>Sexo</InputLabel>
              <Select
                value={novoAnimal.sexo}
                onChange={(e) =>
                  setNovoAnimal({ ...novoAnimal, sexo: e.target.value })
                }
              >
                <MenuItem value="Macho">Macho</MenuItem>
                <MenuItem value="Fêmea">Fêmea</MenuItem>
              </Select>
            </FormControl>

            <FormControlLabel
              control={
                <Checkbox
                  checked={novoAnimal.permissaoTosa}
                  onChange={(e) =>
                    setNovoAnimal({
                      ...novoAnimal,
                      permissaoTosa: e.target.checked,
                    })
                  }
                  color="primary"
                />
              }
              label="Permissão para tosa"
            />

            <FormControl fullWidth margin="dense">
              <InputLabel>Tutor</InputLabel>
              <Select
                value={novoAnimal.tutor}
                onChange={(e) =>
                  setNovoAnimal({ ...novoAnimal, tutor: e.target.value })
                }
              >
                {tutores.map((tutor, index) => (
                  <MenuItem key={index} value={tutor}>
                    {tutor}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
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
              onClick={adicionarAnimal}
              sx={{ color: "#068146" }}
            >
              Adicionar
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </div>
  );
}

export default Animais;
