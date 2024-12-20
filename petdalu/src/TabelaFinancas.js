import "./TabelaFinancas.css";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import React, { useEffect, useState } from "react";
import axios from "axios";
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
  const formatarDataBrasileira = (data) => {
    if (!data) return "";
    const partes = data.split("-");
    const p3 = partes[2].split("T");
    return `${p3[0]}/${partes[1]}/${partes[0]}`;
  };

  const formatarData = (data) => {
    const p = data.split("T");
    return p[0];
  };

  const [clientes, setClientes] = useState([]);
  const [registroAtual, setRegistroAtual] = useState(null);

  const [filtroPeriodo, setFiltroPeriodo] = useState({ inicio: "", fim: "" });
  const [filtroPagamento, setFiltroPagamento] = useState("todos");

  const [financas, setfinancas] = useState([]);

  async function buscarfinancass() {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:3010/financas", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setfinancas(response.data);
    } catch (error) {
      console.error("Erro ao buscar finanças:", error);
    }
  }

  useEffect(() => {
    buscarfinancass();
  }, []);

  const [openForm, setOpenForm] = useState(false);
  const [openFormAlterar, setOpenFormAlterar] = useState(false);
  const [hid, setHid] = useState("");
  const [pnome, setPnome] = useState("");
  const [anome, setAnome] = useState("");
  const [data, setData] = useState("");
  const [pago, setPago] = useState("");
  const [preco, setPreco] = useState("");

  const handleOpenFormAlterar = async (
    hid,
    anome,
    pnome,
    data,
    pago,
    preco
  ) => {
    setOpenFormAlterar(true);

    setHid(hid);
    setAnome(anome);
    setPnome(pnome);
    setData(data);
    setPago(pago);
    setPreco(preco);
  };
  const handleCloseFormAlterar = () => {
    setOpenFormAlterar(false);
    setHid("");
    setAnome("");
    setPnome("");
    setData("");
    setPago("");
    setPreco("");
  };

  const alterarfinancas = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:3010/alterarfinanca",
        { pago: pago, hid: hid, data: data },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      buscarfinancass();
      handleCloseFormAlterar();
    } catch (error) {
      console.error("Erro ao alterar finança:", error);
    }
  };

  const handleCheck = async (feito) => {
    if (feito === "s") {
      setPago("n");
    } else {
      setPago("s");
    }
  };

  const filtrarClientes = () => {
    return financas.filter((cliente) => {
      if (filtroPagamento === "pendente" && cliente.pago === "s") return false;
      if (filtroPagamento === "pago" && cliente.pago === "n") return false;

      const dataServico = new Date(formatarData(cliente.data));

      if (
        filtroPeriodo.inicio &&
        new Date(formatarData(cliente.data)) < new Date(filtroPeriodo.inicio)
      ) {
        return false;
      }
      if (
        filtroPeriodo.fim &&
        new Date(formatarData(cliente.data)) > new Date(filtroPeriodo.fim)
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
              <tr key={`${cliente.hid} ${cliente.data}`}>
                <td>{cliente.pnome}</td>
                <td>{cliente.anome}</td>
                <td>{formatarDataBrasileira(cliente.data)}</td>
                <td>R$ {cliente.preco}</td>
                <td>
                  <Checkbox
                    checked={cliente.pago === "s"}
                    onChange={() =>
                      handleOpenFormAlterar(
                        cliente.hid,
                        cliente.anome,
                        cliente.pnome,
                        cliente.data,
                        cliente.pago,
                        cliente.preco
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <Dialog open={openFormAlterar} onClose={handleCloseFormAlterar}>
          <DialogTitle>Alterar Pagamento</DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              label="Cliente"
              value={pnome}
              fullWidth
              variant="outlined"
              disabled
            />
            <TextField
              margin="dense"
              label="Pet"
              value={anome}
              fullWidth
              variant="outlined"
              disabled
            />
            <TextField
              margin="dense"
              label="Data do Serviço"
              value={formatarDataBrasileira(data)}
              fullWidth
              variant="outlined"
              disabled
            />
            <TextField
              margin="dense"
              label="Valor"
              value={preco}
              fullWidth
              variant="outlined"
              disabled
            />
            <div className="checkbox-container">
              <Checkbox
                checked={pago === "s"}
                onClick={() => handleCheck(pago)}
                sx={{ color: "#068146" }}
              />
              <label>Pago</label>
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
              onClick={alterarfinancas}
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
