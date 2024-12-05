import "./Historico.css";
import Row from "react-bootstrap/Row";
import { Container, Col } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import axios from "axios";
import EditIcon from "@mui/icons-material/Edit";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import {
  Radio,
  RadioGroup,
  FormControl,
  FormControlLabel,
  FormLabel,
  Select,
  MenuItem,
  InputLabel,
  TextField,
  Tooltip,
  Checkbox,
} from "@mui/material";

function Historico() {
  const [bdomicilio, setBdomicilio] = useState(false);
  const [edomicilio, setEdomicilio] = useState(false);

  const [tipoServico, setTipoServico] = useState("");
  const [descricaoTosa, setDescricaoTosa] = useState("");
  const [metodoPagamento, setMetodoPagamento] = useState("");
  const [hora, setHora] = useState("");
  const [porte, setPorte] = useState("");
  const [nome, setNome] = useState(""); // Estado para o nome
  const [especie, setEspecie] = useState(""); // Estado para a espécie
  const [comp, setComp] = useState(""); // Estado para o comportamento
  const [sexo, setSexo] = useState(""); // Estado para o sexo
  const [permissao, setPermissao] = useState("n");
  const [sid, setSid] = useState("");
  const [cidadeBusca, setCidadeBusca] = useState("");
  const [logBusca, setLogBusca] = useState("");
  const [numBusca, setNumBusca] = useState("");
  const [cidadeEntrega, setCidadeEntrega] = useState("");
  const [logEntrega, setLogEntrega] = useState("");
  const [numEntrega, setNumEntrega] = useState("");
  const [email, setEmail] = useState("");

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

  //const [openForm, setOpenForm] = useState(false);
  const [registroAtual, setRegistroAtual] = useState(null);

  const [filtroPeriodo, setFiltroPeriodo] = useState({ inicio: "", fim: "" });
  const [filtroPagamento, setFiltroPagamento] = useState("todos");

  const [financas, setfinancas] = useState([]); // Armazena os finanças do banco

  async function buscarfinancass() {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:3010/historico", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setfinancas(response.data);
    } catch (error) {
      console.error("Erro ao buscar historico:", error);
    }
  }

  const excluirAgendamento = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:3010/excluiragendamento`,
        { ddata: data, hhora: hora },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      handleCloseForm();
      buscarfinancass();
    } catch (error) {
      console.error("Erro ao excluir agendamento:", error);
    }
  };

  useEffect(() => {
    buscarfinancass();
  }, []);

  const [openForm, setOpenForm] = useState(false);

  const [hid, setHid] = useState(""); // Estado para hid
  const [pnome, setPnome] = useState(""); // Estado para pnome
  const [anome, setAnome] = useState(""); // Estado para anome
  const [data, setData] = useState(""); // Estado para data
  const [pago, setPago] = useState(""); // Estado para pago
  const [preco, setPreco] = useState(""); // Estado para preco

  const handleOpenForm = async (hora, data) => {
    try {
      const token = localStorage.getItem("token"); // Recupera o token JWT
      const response = await axios.get("http://localhost:3010/buscaragenda", {
        params: { hora: hora, data: data },
        headers: {
          Authorization: `Bearer ${token}`, // Adiciona o token no cabeçalho
        },
      });
      setHora(hora);
      setData(data);
      setNome(response.data.nomepet);
      setEspecie(response.data.especie);
      setPorte(response.data.porte);
      setComp(response.data.comp);
      setSexo(response.data.sexo);
      setPermissao(response.data.permissao);
      setTipoServico(response.data.sdescr);
      setDescricaoTosa(response.data.tipo_tosa);
      setCidadeBusca(response.data.cidadebusca);
      setLogBusca(response.data.logbusca);
      setNumBusca(response.data.numbusca);
      setCidadeEntrega(response.data.cidadeentrega);
      setLogEntrega(response.data.logentrega);
      setNumEntrega(response.data.numentrega);
      console.log(cidadeBusca);
      setMetodoPagamento(response.data.met_pagamento);
      setPreco(response.data.preco);
      const bdomicilio =
        response.data.cidadebusca ||
        response.data.logbusca ||
        response.data.numbusca
          ? true
          : false;
      const edomicilio =
        response.data.cidadeentrega ||
        response.data.logentrega ||
        response.data.numentrega
          ? true
          : false;

      setBdomicilio(bdomicilio);
      setEdomicilio(edomicilio);
      setPnome(response.data.pnome);
      setEmail(response.data.email);
      setOpenForm(true);
    } catch (error) {
      console.error("Erro ao buscar agendamento:", error);
    }
  };

  const handleCloseForm = () => {
    setOpenForm(false);
  };

  //filtrar os clientes
  const filtrarClientes = () => {
    return financas.filter((cliente) => {
      // Filtrar por pagamento
      if (filtroPagamento === "pendente" && cliente.pago === "s") return false;
      if (filtroPagamento === "pago" && cliente.pago === "n") return false;

      // Filtrar por período
      const dataServico = new Date(formatarData(cliente.data)); // Normaliza a data para comparação
      console.log(
        new Date(filtroPeriodo.inicio),
        new Date(filtroPeriodo.fim),
        dataServico
      );

      if (
        filtroPeriodo.inicio &&
        new Date(formatarData(cliente.data)) < new Date(filtroPeriodo.inicio) // Comparação com a data inicial
      ) {
        return false;
      }
      if (
        filtroPeriodo.fim &&
        new Date(formatarData(cliente.data)) > new Date(filtroPeriodo.fim) // Comparação com a data final
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
              <th>Ver</th>
            </tr>
          </thead>
          <tbody>
            {clientesFiltrados.map((cliente) => (
              <tr key={cliente.hid}>
                <td>{cliente.pnome}</td>
                <td>{cliente.anome}</td>
                <td>{formatarDataBrasileira(cliente.data)}</td>
                <td>R$ {cliente.preco}</td>
                <td>
                  <Checkbox
                    checked={cliente.pago === "s"}
                    color="default"
                    disabled={true}
                    sx={{
                      color: "#068146",
                      "&.Mui-checked": {
                        color: "#068146",
                      },
                    }}
                  />
                </td>
                <td>
                  <Button
                    sx={{
                      color: "#068146",
                    }}
                    onClick={() => handleOpenForm(cliente.hid, cliente.data)}
                  >
                    <EditIcon></EditIcon>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <Dialog open={openForm} onClose={handleCloseForm}>
          <DialogTitle>Ver Serviço</DialogTitle>
          <DialogContent>
            <Container id="tabela">
              <Col>
                <TextField
                  autoFocus
                  margin="dense"
                  label="Tutor"
                  type="text"
                  fullWidth
                  variant="outlined"
                  disabled={true}
                  value={`${pnome} - ${email}`}
                  onChange={(event) => setNome(event.target.value)}
                />

                <TextField
                  autoFocus
                  margin="dense"
                  label="Nome"
                  type="text"
                  fullWidth
                  variant="outlined"
                  disabled={true}
                  value={nome}
                  onChange={(event) => setNome(event.target.value)}
                />

                <TextField
                  margin="dense"
                  label="Espécie"
                  type="text"
                  fullWidth
                  variant="outlined"
                  disabled={true}
                  value={especie}
                  onChange={(event) => setEspecie(event.target.value)}
                />

                <FormControl fullWidth margin="dense">
                  <InputLabel>Porte</InputLabel>
                  <Select
                    disabled={true}
                    value={porte}
                    onChange={(event) => setPorte(event.target.value)}
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
                  disabled={true}
                  value={comp}
                  onChange={(event) => setComp(event.target.value)}
                />

                <FormControl fullWidth margin="dense">
                  <InputLabel>Sexo</InputLabel>
                  <Select
                    disabled={true}
                    value={sexo}
                    onChange={(event) => setSexo(event.target.value)}
                  >
                    <MenuItem value="M">Macho</MenuItem>
                    <MenuItem value="F">Fêmea</MenuItem>
                  </Select>
                </FormControl>

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={permissao === "s"}
                      disabled={true}
                      color="primary"
                    />
                  }
                  label="Permissão para tosa"
                />

                <Row className="formulario">
                  <FormControl>
                    <FormLabel id="servico" style={{ color: "green" }}>
                      Tipo de serviço
                    </FormLabel>

                    <RadioGroup
                      row
                      value={tipoServico}
                      disabled={true}
                      onChange={(e) => setTipoServico(e.target.value)}
                    >
                      <FormControlLabel
                        value="Banho"
                        control={<Radio style={{ color: "green" }} />}
                        label="Banho"
                        disabled={true}
                      />
                      <FormControlLabel
                        value="Tosa"
                        control={<Radio style={{ color: "green" }} />}
                        label="Tosa"
                        disabled={true}
                      />
                      <FormControlLabel
                        value="Tosa + Banho"
                        control={<Radio style={{ color: "green" }} />}
                        label="Banho + Tosa"
                        disabled={true}
                      />
                    </RadioGroup>
                  </FormControl>
                  {(tipoServico === "Tosa" ||
                    tipoServico === "Tosa + Banho") && (
                    <TextField
                      fullWidth
                      label="Descrição da tosa"
                      value={descricaoTosa}
                      disabled={true}
                      onChange={(e) => setDescricaoTosa(e.target.value)}
                    />
                  )}
                </Row>

                <Row className="formulario">
                  <FormControl>
                    <FormLabel style={{ color: "green" }}>
                      Deseja que o pet seja buscado a domicílio?
                    </FormLabel>
                    <RadioGroup
                      row
                      value={bdomicilio ? "s" : "n"}
                      disabled={true}
                      onChange={(e) => setBdomicilio(e.target.value === "s")}
                    >
                      <FormControlLabel
                        value="s"
                        control={<Radio style={{ color: "green" }} />}
                        label="Sim"
                        disabled={true}
                      />
                      <FormControlLabel
                        value="n"
                        control={<Radio style={{ color: "green" }} />}
                        label="Não"
                        disabled={true}
                      />
                    </RadioGroup>
                  </FormControl>
                  {bdomicilio && (
                    <TextField
                      margin="dense"
                      label="Endereço para buscar"
                      type="text"
                      fullWidth
                      variant="outlined"
                      disabled={true}
                      value={`${cidadeBusca}, ${logBusca}, ${numBusca}`}
                    />
                  )}
                </Row>

                <Row className="formulario">
                  <FormControl>
                    <FormLabel style={{ color: "green" }}>
                      Deseja que o pet seja entregue a domicílio?
                    </FormLabel>
                    <RadioGroup
                      row
                      value={edomicilio ? "s" : "n"}
                      disabled={true}
                      onChange={(e) => setEdomicilio(e.target.value === "s")}
                    >
                      <FormControlLabel
                        value="s"
                        control={<Radio style={{ color: "green" }} />}
                        label="Sim"
                        disabled={true}
                      />
                      <FormControlLabel
                        value="n"
                        control={<Radio style={{ color: "green" }} />}
                        label="Não"
                        disabled={true}
                      />
                    </RadioGroup>
                  </FormControl>
                  {edomicilio && (
                    <TextField
                      margin="dense"
                      label="Endereço para entrega"
                      type="text"
                      fullWidth
                      variant="outlined"
                      disabled={true}
                      value={`${cidadeEntrega}, ${logEntrega}, ${numEntrega}`}
                    />
                  )}
                </Row>

                <Row className="formulario">
                  <FormControl fullWidth>
                    <InputLabel id="pagamento-label">
                      Método de pagamento
                    </InputLabel>
                    <Select
                      labelId="pagamento-label"
                      value={metodoPagamento}
                      disabled={true}
                      onChange={(e) => setMetodoPagamento(e.target.value)}
                    >
                      <MenuItem value="pix">Pix</MenuItem>
                      <MenuItem value="dinheiro">Dinheiro</MenuItem>
                    </Select>
                  </FormControl>
                </Row>

                <Row className="formulario">
                  <h4>Preço: R$ {preco},00</h4>
                </Row>

                <div className="botoes">
                  <Button
                    variant="text"
                    style={{ color: "green" }}
                    onClick={() => handleCloseForm()}
                  >
                    Voltar
                  </Button>
                  <Button
                    variant="text"
                    style={{ color: "green" }}
                    onClick={excluirAgendamento}
                  >
                    Excluir
                  </Button>
                </div>
              </Col>
            </Container>
          </DialogContent>
        </Dialog>
      </Container>
    </div>
  );
}
export default Historico;
