import "./AlterarTabelaPrecos.css";
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

function AlterarTabelaPrecos() {
  const [servicos, setServicos] = useState([
    {
      id: 1,
      descrServico: "Banho",
      valor: 30,
    },
    {
      id: 2,
      descrServico: "Tosa Médio Porte",
      valor: 40,
    },
    {
      id: 3,
      descrServico: "Banho + Tosa Médio Porte",
      valor: 60,
    },
  ]);

  const [openForm, setOpenForm] = useState(false);
  const [registroAtual, setRegistroAtual] = useState(null);

  const handleOpenForm = (registro = { descrServico: "", valor: 0 }) => {
    setRegistroAtual({ ...registro }); // Inicializa o formulário com dados ou vazio
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setRegistroAtual(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRegistroAtual((prev) => ({
      ...prev,
      [name]: name === "valor" ? parseFloat(value) || 0 : value, // Garante que 'valor' seja numérico
    }));
  };

  const atualizarPagamento = () => {
    if (registroAtual.id) {
      // Editando um serviço existente
      const servicosAtualizados = servicos.map((servico) =>
        servico.id === registroAtual.id
          ? { ...registroAtual } // Atualiza o serviço com os novos valores
          : servico
      );
      setServicos(servicosAtualizados);
    } else {
      // Adicionando um novo serviço
      const novoServico = {
        ...registroAtual,
        id:
          servicos.length > 0 ? Math.max(...servicos.map((s) => s.id)) + 1 : 1, // Gera um novo ID
      };
      setServicos([...servicos, novoServico]);
    }
    handleCloseForm();
  };

  const excluirServico = (id) => {
    setServicos(servicos.filter((servico) => servico.id !== id));
  };

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
              <th>Valor</th>
              <th colSpan={2}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {servicos.map((servico) => (
              <tr key={servico.id}>
                <td>{servico.descrServico}</td>
                <td>R$ {servico.valor}</td>
                <td>
                  <Button
                    variant="text"
                    sx={{ color: "#068146" }}
                    size="small"
                    onClick={() => handleOpenForm(servico)}
                  >
                    Alterar
                  </Button>
                </td>
                <td>
                  <Button
                    variant="text"
                    sx={{ color: "#068146" }}
                    size="small"
                    onClick={() => excluirServico(servico.id)}
                  >
                    Excluir
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <Dialog open={openForm} onClose={handleCloseForm}>
          <DialogTitle>
            {registroAtual?.id ? "Editar Serviço" : "Novo Serviço"}
          </DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              label="Serviço"
              name="descrServico"
              value={registroAtual ? registroAtual.descrServico : ""}
              onChange={handleChange}
              fullWidth
              variant="outlined"
            />

            <TextField
              margin="dense"
              label="Valor"
              name="valor"
              type="number"
              value={registroAtual ? registroAtual.valor : ""}
              onChange={handleChange}
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
              onClick={atualizarPagamento}
              sx={{ color: "#068146" }}
            >
              {registroAtual?.id ? "Atualizar" : "Adicionar"}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </div>
  );
}

export default AlterarTabelaPrecos;
