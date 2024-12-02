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

//formatar a data no formato brasileiro (so pra mostrar na tabela)
const formatarDataBrasileira = (data) => {
  if (!data) return "";
  const partes = data.split("-");
  return `${partes[2]}/${partes[1]}/${partes[0]}`;
};

function TabelaFinancas() {
  const [clientes, setClientes] = useState([
    {
      id: 1,
      nomeCliente: "Ana",
      nomePet: "Pimenta",
      dataServico: "2024-11-11",
      valor: 150,
      pago: true,
    },
    {
      id: 2,
      nomeCliente: "Maria",
      nomePet: "Iris",
      dataServico: "2024-11-16",
      valor: 100,
      pago: false,
    },
    {
      id: 3,
      nomeCliente: "Alex",
      nomePet: "Café",
      dataServico: "2024-11-17",
      valor: 200,
      pago: false,
    },
  ]);

  const [openForm, setOpenForm] = useState(false);
  const [registroAtual, setRegistroAtual] = useState(null);

  const [filtroPeriodo, setFiltroPeriodo] = useState({ inicio: "", fim: "" });
  const [filtroPagamento, setFiltroPagamento] = useState("todos");

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

  //filtrar os clientes
  const filtrarClientes = () => {
    return clientes.filter((cliente) => {
      //filtrar por pagamento
      if (filtroPagamento === "pendente" && cliente.pago) return false;
      if (filtroPagamento === "pago" && !cliente.pago) return false;

      //filtrar por periodo
      if (
        filtroPeriodo.inicio &&
        new Date(cliente.dataServico) < new Date(filtroPeriodo.inicio)
      ) {
        return false;
      }
      if (
        filtroPeriodo.fim &&
        new Date(cliente.dataServico) > new Date(filtroPeriodo.fim)
      ) {
        return false;
      }

      return true;
    });
  };

  const clientesFiltrados = filtrarClientes();

  return (
    <div id="tabela-clientes">
      <Container id="cont_tabela">
        <Row className="row_tabela">
          <p className="txt_tabela">Clientes e Pagamentos</p>
        </Row>

        {/* filtros */}
        <div className="filtros">
          <TextField
            label="Data Início"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={filtroPeriodo.inicio}
            onChange={(e) =>
              setFiltroPeriodo({ ...filtroPeriodo, inicio: e.target.value })
            }
          />
          <TextField
            label="Data Fim"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={filtroPeriodo.fim}
            onChange={(e) =>
              setFiltroPeriodo({ ...filtroPeriodo, fim: e.target.value })
            }
          />
          <TextField
            select
            label="Pagamento"
            SelectProps={{ native: true }}
            value={filtroPagamento}
            onChange={(e) => setFiltroPagamento(e.target.value)}
          >
            <option value="todos">Todos</option>
            <option value="pago">Pago</option>
            <option value="pendente">Pendente</option>
          </TextField>
        </div>

        {/* tabela */}
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
            {clientesFiltrados.map((cliente) => (
              <tr key={cliente.id}>
                <td>{cliente.nomeCliente}</td>
                <td>{cliente.nomePet}</td>
                <td>{formatarDataBrasileira(cliente.dataServico)}</td>
                <td>R$ {cliente.valor}</td>
                <td>
                  <Checkbox
                    checked={cliente.pago}
                    onChange={() => handleOpenForm(cliente)}
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
              value={
                registroAtual
                  ? formatarDataBrasileira(registroAtual.dataServico)
                  : ""
              }
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
