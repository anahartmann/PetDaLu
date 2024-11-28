import "./Anotacoes.css";
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
  Checkbox,
} from "@mui/material";

function Anotacoes() {
  const [Anotacoes, setAnotacoes] = useState([
    { id: 1, texto: "Comprar Shampoo", status: "a_ser_realizado" },
    { id: 2, texto: "Amolar lâminas", status: "a_ser_realizado" },
    { id: 3, texto: "Comprar lacinhos", status: "a_ser_realizado" },
  ]);

  const [openForm, setOpenForm] = useState(false);
  const [novoAnotacao, setNovoAnotacao] = useState("");

  const handleOpenForm = () => setOpenForm(true);
  const handleCloseForm = () => {
    setOpenForm(false);
    setNovoAnotacao("");
  };

  const adicionarAnotacao = () => {
    if (novoAnotacao.trim()) {
      setAnotacoes([
        ...Anotacoes,
        {
          id: Anotacoes.length + 1,
          texto: novoAnotacao,
          status: "a_ser_realizado",
        },
      ]);
    }
    handleCloseForm();
  };

  const excluirAnotacao = (id) => {
    setAnotacoes(Anotacoes.filter((Anotacao) => Anotacao.id !== id));
  };

  const atualizarStatus = (id) => {
    setAnotacoes(
      Anotacoes.map((Anotacao) =>
        Anotacao.id === id
          ? {
              ...Anotacao,
              status: Anotacao.status === "feito" ? "a_ser_realizado" : "feito",
            }
          : Anotacao
      )
    );
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
          <Row key={Anotacao.id} className="row_Anotacao">
            <p className="txt_Anotacao">{Anotacao.texto}</p>
            <div className="actions">
              <Button
                variant="text"
                sx={{ color: "#068146" }}
                size="small"
                onClick={() => alert(`Alterar ${Anotacao.texto}`)}
              >
                Alterar
              </Button>
              <Button
                variant="text"
                sx={{ color: "#068146" }}
                size="small"
                onClick={() => excluirAnotacao(Anotacao.id)}
              >
                Excluir
              </Button>
              <Checkbox
                checked={Anotacao.status === "feito"}
                onChange={() => atualizarStatus(Anotacao.id)}
                color="default"
                sx={{
                  color: "#068146",
                  "&.Mui-checked": {
                    color: "#068146",
                  },
                }}
              />
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
              variant="outlined"
              value={novoAnotacao}
              onChange={(e) => setNovoAnotacao(e.target.value)}
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
              onClick={adicionarAnotacao}
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

export default Anotacoes;
