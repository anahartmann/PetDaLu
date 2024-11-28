import "./Enderecos.css";
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

function Enderecos() {
  const [enderecos, setEnderecos] = useState([
    { id: 1, texto: "Rua Barão do Rio Branco, 66 - Centro" },
    { id: 2, texto: "Av. Fernando Machado, 6784 - Centro " },
    { id: 3, texto: "Rua José, 123 - Centro" },
  ]);

  const [openForm, setOpenForm] = useState(false);
  const [novoEndereco, setNovoEndereco] = useState("");

  const handleOpenForm = () => setOpenForm(true);
  const handleCloseForm = () => {
    setOpenForm(false);
    setNovoEndereco("");
  };

  const adicionarEndereco = () => {
    if (novoEndereco.trim()) {
      setEnderecos([
        ...enderecos,
        { id: enderecos.length + 1, texto: novoEndereco },
      ]);
    }
    handleCloseForm();
  };

  const excluirEndereco = (id) => {
    setEnderecos(enderecos.filter((endereco) => endereco.id !== id));
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
          <Row key={endereco.id} className="row_endereco">
            <p className="txt_endereco">{endereco.texto}</p>
            <div className="actions">
              <Button
                variant="text"
                color="primary"
                size="small"
                onClick={() => alert(`Alterar ${endereco.texto}`)}
              >
                Alterar
              </Button>
              <Button
                variant="text"
                color="secondary"
                size="small"
                onClick={() => excluirEndereco(endereco.id)}
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
              autoFocus
              margin="dense"
              label="Novo endereço"
              type="text"
              fullWidth
              variant="outlined"
              value={novoEndereco}
              onChange={(e) => setNovoEndereco(e.target.value)}
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
              onClick={adicionarEndereco}
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

export default Enderecos;
