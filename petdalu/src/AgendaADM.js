import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AgendaADM.css";
import { Container, Row, Col, Button } from "react-bootstrap";

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

function AgendaADM({ userRole }) {
  const [exibeAgendamento, setExibeAgendamento] = useState(false);
  const [exibeAgenda, setExibeAgenda] = useState(true);
  const [horarioSelecionado, setHorarioSelecionado] = useState("");
  const [bdomicilio, setBdomicilio] = useState(false);
  const [edomicilio, setEdomicilio] = useState(false);
  const [petSelecionado, setPetSelecionado] = useState("");
  const [erropetSelecionado, setErroPetSelecionado] = useState(false);
  const [enderecoBusca, setEnderecoBusca] = useState("");
  const [enderecoEntrega, setEnderecoEntrega] = useState("");
  const [erroenderecoBusca, setErroEnderecoBusca] = useState(false);
  const [erroenderecoEntrega, setErroEnderecoEntrega] = useState(false);
  const [tipoServico, setTipoServico] = useState("");
  const [descricaoTosa, setDescricaoTosa] = useState("");
  const [metodoPagamento, setMetodoPagamento] = useState("");
  const [errometodoPagamento, setErroMetodoPagamento] = useState(false);
  const [valorTotal, setValorTotal] = useState(0);
  const [horariosIndisponiveis, setHorariosIndisponiveis] = useState([]);
  const [hora, setHora] = useState("");
  const [data, setData] = useState("");
  const [diasDaSemana, setDiasDaSemana] = useState([]);
  const [horariosPorDia, setHorariosPorDia] = useState([]);
  const [somenteLeitura, setSomenteLeitura] = useState(false);
  const [nome, setNome] = useState("");
  const [especie, setEspecie] = useState("");
  const [comp, setComp] = useState("");
  const [sexo, setSexo] = useState("");
  const [permissao, setPermissao] = useState("n");
  const [sid, setSid] = useState("");
  const [exibeAgMarcado, setExibeAgMarcado] = useState(false);
  const [preco, setPreco] = useState(0);
  const [cidadeBusca, setCidadeBusca] = useState("");
  const [logBusca, setLogBusca] = useState("");
  const [numBusca, setNumBusca] = useState("");
  const [cidadeEntrega, setCidadeEntrega] = useState("");
  const [logEntrega, setLogEntrega] = useState("");
  const [numEntrega, setNumEntrega] = useState("");
  const [pnome, setPnome] = useState("");
  const [email, setEmail] = useState("");
  const [ultimopago, setUltimoPago] = useState(false);

  async function buscarhorarios() {
    try {
      const token = localStorage.getItem("token");
      const responseHorarios = await axios.get(
        "http://localhost:3010/horarios",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const responseDatas = await axios.get("http://localhost:3010/datas", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const horarios = responseHorarios.data;
      const dias = responseDatas.data;

      const indisponiveisPorDia = await Promise.all(
        dias.map(async (dia) => {
          const indisponiveis = await Promise.all(
            horarios.map(async (horario) => {
              const disponivel = await verDisponibilidade(
                dia.data,
                horario.hora
              );
              return !disponivel ? horario.hora : null;
            })
          );

          return {
            dia: dia.data,
            horarios: indisponiveis.filter(Boolean),
          };
        })
      );

      setHorariosIndisponiveis(indisponiveisPorDia);
      setHorariosPorDia(horarios);
      setDiasDaSemana(dias);
    } catch (error) {
      console.error("Erro ao buscar horários e datas:", error);
    }
  }

  useEffect(() => {
    buscarhorarios();
    buscaranimais();
    buscarEnderecos();
    buscarPagamento();
  }, []);

  async function verDisponibilidade(data, hora) {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:3010/agenda", {
        params: { data: data, hora: hora },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data.disponivel;
    } catch (error) {
      console.error("Erro ao verificar disponibilidade:", error);
    }
  }

  async function buscarPagamento() {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:3010/historicopago", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const pagamentos = response.data;

      const pagamentosNaoPagos = pagamentos.filter(
        (pagamento) => pagamento.pago === "n"
      );

      if (pagamentosNaoPagos.length > 0) {
        setUltimoPago(false);
      } else {
        setUltimoPago(true);
      }
    } catch (error) {
      console.error("Erro ao verificar pagamento:", error);
    }
  }

  const adicionarAgendamento = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:3010/criaragendamento",
        {
          sid: sid,
          ddata: data,
          hhora: hora,
          pagamento: "n",
          met_pagamento: metodoPagamento,
          tipo_tosa: descricaoTosa,
          preco_total: valorTotal,
          aid: petSelecionado,
          eid_entrega: edomicilio ? enderecoEntrega : null,
          eid_busca: bdomicilio ? enderecoBusca : null,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      buscarhorarios();
      setExibeAgenda(true);
      setExibeAgendamento(false);
      setExibeAgMarcado(false);
    } catch (error) {
      console.error("Erro ao adicionar agendamento:", error);
    }
  };

  const [pets, setPets] = useState([]);

  async function buscaranimais() {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:3010/animais", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPets(response.data);
    } catch (error) {
      console.error("Erro ao buscar animais:", error);
    }
  }

  const [enderecos, setEnderecos] = useState([]);

  async function buscarEnderecos() {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:3010/enderecos", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setEnderecos(response.data);
    } catch (error) {
      console.error("Erro ao buscar endereços:", error);
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
      buscarhorarios();
      setExibeAgenda(true);
      setExibeAgendamento(false);
      setExibeAgMarcado(false);
    } catch (error) {
      console.error("Erro ao excluir agendamento:", error);
    }
  };

  const [servicos, setServicos] = useState([]);
  const [porte, setPorte] = useState();

  async function controlaClique(id, data, hora, dadosAgendados) {
    if (id === "voltar") {
      setExibeAgenda(true);
      setExibeAgendamento(false);
      resetFormulario();
      setSomenteLeitura(false);
      setExibeAgMarcado(false);
      setHora("");
      setData("");
    } else {
      setData(data);
      setHora(hora);
      setHorarioSelecionado(id);
      if (dadosAgendados && userRole) {
        try {
          const token = localStorage.getItem("token");
          const response = await axios.get(
            "http://localhost:3010/buscaragenda",
            {
              params: { hora: hora, data: data },
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
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
        } catch (error) {
          console.error("Erro ao buscar agendamento:", error);
        }

        setSomenteLeitura(true);
        setExibeAgenda(false);
        setExibeAgendamento(false);
        setExibeAgMarcado(true);
      } else if (!dadosAgendados) {
        resetFormulario();
        setSomenteLeitura(false);
        setExibeAgMarcado(false);
        setExibeAgenda(false);
        setExibeAgendamento(true);
      }
    }
  }

  function resetFormulario() {
    setBdomicilio(false);
    setEdomicilio(false);
    setErroPetSelecionado(false);
    setErroMetodoPagamento(false);
    setErroEnderecoBusca(false);
    setErroEnderecoEntrega(false);
    setPetSelecionado("");
    setEnderecoBusca("");
    setEnderecoEntrega("");
    setTipoServico("");
    setDescricaoTosa("");
    setMetodoPagamento("");
    setValorTotal(0);
  }

  async function calcularTotal() {
    if (petSelecionado) {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:3010/buscarporte", {
        params: { aid: petSelecionado },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPorte(response.data.porte);
    }
    let total = 0;
    if (tipoServico && petSelecionado) {
      try {
        const response = await axios.get(
          "http://localhost:3010/buscarservico",
          {
            params: { sdescr: tipoServico, porte: porte },
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setSid(response.data.sid);
        total += response.data.preco || 0;
      } catch (error) {
        total += 0;
      }
    }

    if (bdomicilio || edomicilio) {
      try {
        const response = await axios.get(
          "http://localhost:3010/buscarservico",
          {
            params: { sdescr: "Entrega/Retirada", porte: "-" },
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        total += response.data.preco || 0;
      } catch (error) {
        total += 0;
      }
    }

    setValorTotal(total);
  }

  function handleAgendar() {
    setPetSelecionado(false);
    setErroMetodoPagamento(false);
    setErroEnderecoBusca(false);
    setErroEnderecoEntrega(false);
    if (
      petSelecionado === "" ||
      metodoPagamento === "" ||
      (bdomicilio && enderecoBusca === "") ||
      (edomicilio && enderecoEntrega === "")
    ) {
      if (petSelecionado === "") {
        setErroPetSelecionado(true);
      }
      if (metodoPagamento === "") {
        setErroMetodoPagamento(true);
      }
      if (bdomicilio && enderecoBusca === "") {
        setErroEnderecoBusca(true);
      }
      if (edomicilio && enderecoEntrega === "") {
        setErroEnderecoEntrega(true);
      }
      alert("Por favor preencha todos os campos");
    }
    if (!ultimopago) {
      alert("Você não pode agendar pois seu último agendamento não foi pago");
      resetFormulario();
      setSomenteLeitura(false);
      setExibeAgMarcado(false);
      setExibeAgenda(true);
      setExibeAgendamento(false);
    } else {
      adicionarAgendamento();
    }
  }

  React.useEffect(() => {
    calcularTotal();
  }, [petSelecionado, tipoServico, bdomicilio, edomicilio]);

  const formatarDataBrasileira = (data) => {
    if (!data) return "";
    const partes = data.split("-");
    const p3 = partes[2].split("T");
    return `${p3[0]}/${partes[1]}/${partes[0]}`;
  };
  const [paginaDias, setPaginaDias] = useState(0);
  const diasPorPagina = 5;

  const diasExibidos = diasDaSemana.slice(
    paginaDias * diasPorPagina,
    (paginaDias + 1) * diasPorPagina
  );

  function irParaPaginaAnterior() {
    if (paginaDias > 0) setPaginaDias(paginaDias - 1);
  }

  function irParaPaginaProxima() {
    if ((paginaDias + 1) * diasPorPagina < diasDaSemana.length) {
      setPaginaDias(paginaDias + 1);
    }
  }

  return (
    <div>
      {exibeAgenda ? (
        <div>
          <h2 className="titulo">Agenda da Semana</h2>
          <Container id="semana">
            {diasExibidos.map((dia) => (
              <Col key={dia.data} className="dia">
                <div className="cabecalho-dia">
                  <p>{formatarDataBrasileira(dia.data)}</p>
                  <p>{dia.descr}</p>
                </div>
                <div className="horarios">
                  {horariosPorDia.map((horario) => {
                    const id = `${formatarDataBrasileira(dia.data)}-${
                      horario.hora
                    }`;
                    const indisponiveis =
                      horariosIndisponiveis.find(
                        (item) => item.dia === dia.data
                      )?.horarios || [];
                    const isIndisponivel = !indisponiveis.includes(
                      horario.hora
                    );
                    return (
                      <p
                        className={
                          isIndisponivel
                            ? "horario-indisponivel"
                            : "horario-disponivel"
                        }
                        onClick={() =>
                          controlaClique(
                            id,
                            dia.data,
                            horario.hora,
                            isIndisponivel
                          )
                        }
                      >
                        {horario.hora}
                      </p>
                    );
                  })}
                </div>
              </Col>
            ))}
          </Container>
          <div className="navegacao">
            <Button
              disabled={paginaDias === 0}
              onClick={irParaPaginaAnterior}
              style={{ marginRight: "10px" }}
            >
              Anterior
            </Button>
            <Button
              disabled={(paginaDias + 1) * diasPorPagina >= diasDaSemana.length}
              onClick={irParaPaginaProxima}
            >
              Próximo
            </Button>
          </div>
        </div>
      ) : (
        <div>
          <h2 className="titulo">{horarioSelecionado}</h2>
          {exibeAgMarcado ? (
            <div>
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
                      onClick={() => controlaClique("voltar")}
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
            </div>
          ) : (
            <div>
              <Container id="tabela">
                <Col>
                  <Row className="formulario">
                    <FormControl fullWidth>
                      <InputLabel id="pet-label">Selecione o pet</InputLabel>
                      <Select
                        labelId="pet-label"
                        value={petSelecionado}
                        error={erropetSelecionado}
                        disabled={somenteLeitura}
                        onChange={(e) => setPetSelecionado(e.target.value)}
                      >
                        {pets.map((pet) => (
                          <MenuItem key={pet.aid} value={pet.aid}>
                            {pet.nome} ({pet.porte})
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Row>

                  <Row className="formulario">
                    <FormControl>
                      <FormLabel id="servico" style={{ color: "green" }}>
                        Tipo de serviço
                      </FormLabel>
                      <RadioGroup
                        row
                        value={tipoServico}
                        disabled={somenteLeitura}
                        onChange={(e) => setTipoServico(e.target.value)}
                      >
                        <FormControlLabel
                          value="Banho"
                          control={<Radio style={{ color: "green" }} />}
                          label="Banho"
                        />
                        <FormControlLabel
                          value="Tosa"
                          control={<Radio style={{ color: "green" }} />}
                          label="Tosa"
                        />
                        <FormControlLabel
                          value="Tosa + Banho"
                          control={<Radio style={{ color: "green" }} />}
                          label="Banho + Tosa"
                        />
                      </RadioGroup>
                    </FormControl>
                    {(tipoServico === "Tosa" ||
                      tipoServico === "Tosa + Banho") && (
                      <TextField
                        fullWidth
                        label="Descrição da tosa"
                        value={descricaoTosa}
                        disabled={somenteLeitura}
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
                        disabled={somenteLeitura}
                        onChange={(e) => setBdomicilio(e.target.value === "s")}
                      >
                        <FormControlLabel
                          value="s"
                          control={<Radio style={{ color: "green" }} />}
                          label="Sim"
                        />
                        <FormControlLabel
                          value="n"
                          control={<Radio style={{ color: "green" }} />}
                          label="Não"
                        />
                      </RadioGroup>
                    </FormControl>
                    {bdomicilio && (
                      <FormControl fullWidth>
                        <InputLabel id="endereco-busca-label">
                          Selecione o endereço de busca
                        </InputLabel>
                        <Select
                          labelId="endereco-busca-label"
                          value={enderecoBusca}
                          error={erroenderecoBusca}
                          disabled={somenteLeitura}
                          onChange={(e) => setEnderecoBusca(e.target.value)}
                        >
                          {enderecos.map((endereco) => (
                            <MenuItem key={endereco.eid} value={endereco.eid}>
                              {endereco.cidade}, {endereco.logradouro},{" "}
                              {endereco.num}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
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
                        disabled={somenteLeitura}
                        onChange={(e) => setEdomicilio(e.target.value === "s")}
                      >
                        <FormControlLabel
                          value="s"
                          control={<Radio style={{ color: "green" }} />}
                          label="Sim"
                        />
                        <FormControlLabel
                          value="n"
                          control={<Radio style={{ color: "green" }} />}
                          label="Não"
                        />
                      </RadioGroup>
                    </FormControl>
                    {edomicilio && (
                      <FormControl fullWidth>
                        <InputLabel id="endereco-entrega-label">
                          Selecione o endereço de entrega
                        </InputLabel>
                        <Select
                          labelId="endereco-entrega-label"
                          value={enderecoEntrega}
                          error={erroenderecoEntrega}
                          disabled={somenteLeitura}
                          onChange={(e) => setEnderecoEntrega(e.target.value)}
                        >
                          {enderecos.map((endereco) => (
                            <MenuItem key={endereco.eid} value={endereco.eid}>
                              {endereco.cidade}, {endereco.logradouro},{" "}
                              {endereco.num}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
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
                        disabled={somenteLeitura}
                        error={errometodoPagamento}
                        onChange={(e) => setMetodoPagamento(e.target.value)}
                      >
                        <MenuItem value="pix">Pix</MenuItem>
                        <MenuItem value="dinheiro">Dinheiro</MenuItem>
                      </Select>
                    </FormControl>
                  </Row>

                  <Row className="formulario">
                    <h4>Preço: R$ {valorTotal},00</h4>
                  </Row>

                  <div className="botoes">
                    <Button
                      variant="text"
                      style={{ color: "green" }}
                      onClick={() => controlaClique("voltar")}
                    >
                      Voltar
                    </Button>
                    <Button
                      variant="text"
                      style={{ color: "green" }}
                      onClick={handleAgendar}
                    >
                      Agendar
                    </Button>
                  </div>
                </Col>
              </Container>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AgendaADM;
