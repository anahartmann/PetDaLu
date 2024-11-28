import "./TabelaFinancas.css";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import React, { useState } from "react";
import {
  Button,
  Checkbox,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

function TabelaFinancas() {
  const [clientes, setClientes] = useState([
    {
      id: 1,
      nomeCliente: "Ana",
      nomePet: "Pimenta",
      dataServico: "11/09/2024",
      valor: 150,
      pago: true,
    },
    {
      id: 2,
      nomeCliente: "Maria",
      nomePet: "Iris",
      dataServico: "16/11/2014",
      valor: 100,
      pago: false,
    },
    {
      id: 3,
      nomeCliente: "Alex",
      nomePet: "Café",
      dataServico: "17/11/2024",
      valor: 200,
      pago: false,
    },
  ]);

  const [openForm, setOpenForm] = useState(false);
  const [registroAtual, setRegistroAtual] = useState(null);

  const handleOpenForm = (registro) => {
    setRegistroAtual(registro);
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setRegistroAtual(null);
  };

  const atualizarPagamento = () => {
    const clientesAtualizados = clientes.map((cliente) =>
      cliente.id === registroAtual.id
        ? { ...cliente, pago: registroAtual.pago }
        : cliente
    );
    setClientes(clientesAtualizados);
    handleCloseForm();
  };

  const handleCheckChange = (e) => {
    setRegistroAtual({ ...registroAtual, pago: e.target.checked });
  };

  return (
    <div id="tabela-clientes">
      <Container id="cont_tabela">
        <Row className="row_tabela">
          <p className="txt_tabela">Clientes e Pagamentos</p>
        </Row>
        <table className="clientes-tabela">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Pet</th>
              <th>Data do Serviço</th>
              <th>Valor</th>
              <th>Pago</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map((cliente) => (
              <tr key={cliente.id}>
                <td>{cliente.nomeCliente}</td>
                <td>{cliente.nomePet}</td>
                <td>{cliente.dataServico}</td>
                <td>R$ {cliente.valor}</td>
                <td>
                  <Checkbox
                    checked={cliente.pago}
                    onChange={() => handleOpenForm(cliente)} //aq abre o formularioo do check
                    color="default"
                    sx={{
                      color: "#068146",
                      "&.Mui-checked": {
                        color: "#068146",
                      },
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <Dialog open={openForm} onClose={handleCloseForm}>
          <DialogTitle>Alterar Pagamento</DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              label="Cliente"
              value={registroAtual ? registroAtual.nomeCliente : ""}
              fullWidth
              variant="outlined"
              disabled
            />
            <TextField
              margin="dense"
              label="Pet"
              value={registroAtual ? registroAtual.nomePet : ""}
              fullWidth
              variant="outlined"
              disabled
            />
            <TextField
              margin="dense"
              label="Data do Serviço"
              value={registroAtual ? registroAtual.dataServico : ""}
              fullWidth
              variant="outlined"
              disabled
            />
            <TextField
              margin="dense"
              label="Valor"
              value={registroAtual ? `R$ ${registroAtual.valor}` : ""}
              fullWidth
              variant="outlined"
              disabled
            />
            <div className="checkbox-container">
              <Checkbox
                checked={registroAtual ? registroAtual.pago : false}
                onChange={handleCheckChange}
                sx={{ color: "#068146" }}
              />
              <label>Pago</label>
            </div>
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
              onClick={atualizarPagamento}
              sx={{ color: "#068146" }}
            >
              Atualizar
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </div>
  );
}

export default TabelaFinancas;
