import React, { useState } from "react";
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
} from "@mui/material";
import { EditRoadOutlined } from "@mui/icons-material";

function AgendaADM() {
  const [exibeAgendamento, setExibeAgendamento] = useState(false);
  const [exibeAgenda, setExibeAgenda] = useState(true);
  const [horarioSelecionado, setHorarioSelecionado] = useState("");
  const [somenteLeitura, setSomenteLeitura] = useState(false);
  const [bdomicilio, setBdomicilio] = useState(false);
  const [edomicilio, setEdomicilio] = useState(false);
  const [petSelecionado, setPetSelecionado] = useState("");
  const [enderecoBusca, setEnderecoBusca] = useState("");
  const [enderecoEntrega, setEnderecoEntrega] = useState("");
  const [tipoServico, setTipoServico] = useState("banho");
  const [descricaoTosa, setDescricaoTosa] = useState("");
  const [metodoPagamento, setMetodoPagamento] = useState("");
  const [valorTotal, setValorTotal] = useState(0);
  const [horariosIndisponiveis, setHorariosIndisponiveis] = useState({});
  const [tooltipInfo, setTooltipInfo] = useState({});

  const enderecos = [
    "Rua Barão do Rio Branco, 36475 - Centro",
    "Av. Fernando Machado, 3562 - Centro",
  ];

  const pets = [
    { nome: "Felix", porte: "médio" },
    { nome: "Iris", porte: "médio" },
  ];

  const precos = {
    pequeno: { banho: 30, tosa: 40, "tosa-banho": 60 },
    médio: { banho: 40, tosa: 50, "tosa-banho": 80 },
    grande: { banho: 50, tosa: 60, "tosa-banho": 100 },
    domicilio: 10,
  };

  const diasDaSemana = [
    { data: "11/11", dia: "Segunda-feira" },
    { data: "12/11", dia: "Terça-feira" },
    { data: "13/11", dia: "Quarta-feira" },
  ];

  const horariosPorDia = ["13:30", "14:30", "15:30", "16:30", "17:30"];

  function controlaClique(id) {
    if (id === "voltar") {
      setExibeAgenda(true);
      setExibeAgendamento(false);
      resetFormulario();
      setSomenteLeitura(false);
    } else {
      setHorarioSelecionado(id);
      const dadosAgendados = horariosIndisponiveis[id];
      if (dadosAgendados) {
        preencherFormulario(dadosAgendados);
        setSomenteLeitura(true);
      } else {
        resetFormulario();
        setSomenteLeitura(false);
      }
      setExibeAgenda(false);
      setExibeAgendamento(true);
    }
  }

  function preencherFormulario(dados) {
    setPetSelecionado(dados.pet);
    setTipoServico(dados.tipoServico);
    setDescricaoTosa(dados.descricaoTosa || "");
    setBdomicilio(dados.buscarDomicilio);
    setEnderecoBusca(dados.enderecoBusca || "");
    setEdomicilio(dados.entregarDomicilio);
    setEnderecoEntrega(dados.enderecoEntrega || "");
    setMetodoPagamento(dados.metodoPagamento);
    setValorTotal(dados.valorTotal);
  }

  function resetFormulario() {
    setBdomicilio(false);
    setEdomicilio(false);
    setPetSelecionado("");
    setEnderecoBusca("");
    setEnderecoEntrega("");
    setTipoServico("banho");
    setDescricaoTosa("");
    setMetodoPagamento("");
    setValorTotal(0);
  }

  function calcularTotal() {
    if (!petSelecionado) return;
    const porte = pets.find((pet) => pet.nome === petSelecionado)?.porte;
    const precoBase = precos[porte][tipoServico];
    const extraDomicilio = bdomicilio || edomicilio ? precos.domicilio : 0;
    setValorTotal(precoBase + extraDomicilio);
  }

  function handleAgendar() {
    const logDados = {
      horario: horarioSelecionado,
      pet: petSelecionado,
      tipoServico,
      descricaoTosa:
        tipoServico === "tosa" || tipoServico === "tosa-banho"
          ? descricaoTosa
          : null,
      buscarDomicilio: bdomicilio,
      enderecoBusca: bdomicilio ? enderecoBusca : null,
      entregarDomicilio: edomicilio,
      enderecoEntrega: edomicilio ? enderecoEntrega : null,
      metodoPagamento,
      valorTotal,
    };
    console.log("Agendamento realizado:", logDados);

    setHorariosIndisponiveis({
      ...horariosIndisponiveis,
      [horarioSelecionado]: logDados,
    });
    setExibeAgenda(true);
    setExibeAgendamento(false);
  }

  React.useEffect(() => {
    calcularTotal();
  }, [petSelecionado, tipoServico, bdomicilio, edomicilio]);

  return (
    <div>
      {exibeAgenda ? (
        <div>
          <h2 className="titulo">Agenda da Semana</h2>
          <Container id="semana">
            {diasDaSemana.map((dia) => (
              <Col key={dia.data} className="dia">
                <div className="cabecalho-dia">
                  <p>{dia.data}</p>
                  <p>{dia.dia}</p>
                </div>
                <div className="horarios">
                  {horariosPorDia.map((horario) => {
                    const id = `${dia.data}-${horario}`;
                    const isIndisponivel = horariosIndisponiveis[id];
                    return (
                      <Tooltip
                        key={id}
                        title={isIndisponivel ? `Ocupado` : "Disponível"}
                      >
                        <p
                          className={
                            isIndisponivel
                              ? "horario-indisponivel"
                              : "horario-disponivel"
                          }
                          onClick={() => controlaClique(id)}
                        >
                          {horario}
                        </p>
                      </Tooltip>
                    );
                  })}
                </div>
              </Col>
            ))}
          </Container>
        </div>
      ) : (
        <div>
          <h2 className="titulo">{horarioSelecionado}</h2>
          <Container id="tabela">
            <Col>
              <Row className="formulario">
                <FormControl fullWidth>
                  <InputLabel id="pet-label">Selecione o pet</InputLabel>
                  <Select
                    labelId="pet-label"
                    value={petSelecionado}
                    onChange={(e) => setPetSelecionado(e.target.value)}
                    disabled={somenteLeitura}
                  >
                    {pets.map((pet) => (
                      <MenuItem key={pet.nome} value={pet.nome}>
                        {pet.nome}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Row>

              <Row className="formulario">
                <FormControl>
                  <FormLabel id="servico" style={{ color: "green" }}>
                    Tipo de Serviço
                  </FormLabel>
                  <RadioGroup
                    row
                    value={tipoServico}
                    onChange={(e) => setTipoServico(e.target.value)}
                    disabled={somenteLeitura}
                  >
                    <FormControlLabel
                      value="banho"
                      control={<Radio style={{ color: "green" }} />}
                      label="Banho"
                      disabled={somenteLeitura}
                    />
                    <FormControlLabel
                      value="tosa"
                      control={<Radio style={{ color: "green" }} />}
                      label="Tosa"
                      disabled={somenteLeitura}
                    />
                    <FormControlLabel
                      value="tosa-banho"
                      control={<Radio style={{ color: "green" }} />}
                      label="Banho + Tosa"
                      disabled={somenteLeitura}
                    />
                  </RadioGroup>
                </FormControl>
              </Row>

              {tipoServico !== "banho" && (
                <Row className="formulario">
                  <TextField
                    label="Descrição da Tosa"
                    value={descricaoTosa}
                    onChange={(e) => setDescricaoTosa(e.target.value)}
                    disabled={somenteLeitura}
                    fullWidth
                  />
                </Row>
              )}

              <Row className="formulario">
                <FormControl>
                  <FormLabel style={{ color: "green" }}>
                    Deseja que o pet seja buscado a domicílio?
                  </FormLabel>
                  <RadioGroup
                    row
                    value={bdomicilio ? "sim" : "nao"}
                    onChange={(e) =>
                      !somenteLeitura && setBdomicilio(e.target.value === "sim")
                    }
                  >
                    <FormControlLabel
                      value="sim"
                      control={<Radio style={{ color: "green" }} />}
                      label="Sim"
                      disabled={somenteLeitura}
                    />
                    <FormControlLabel
                      value="nao"
                      control={<Radio style={{ color: "green" }} />}
                      label="Não"
                      disabled={somenteLeitura}
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
                      onChange={(e) =>
                        !somenteLeitura && setEnderecoBusca(e.target.value)
                      }
                      disabled={somenteLeitura}
                    >
                      {enderecos.map((endereco, idx) => (
                        <MenuItem key={idx} value={endereco}>
                          {endereco}
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
                    value={edomicilio ? "sim" : "nao"}
                    onChange={(e) =>
                      !somenteLeitura && setEdomicilio(e.target.value === "sim")
                    }
                  >
                    <FormControlLabel
                      value="sim"
                      control={<Radio style={{ color: "green" }} />}
                      label="Sim"
                      disabled={somenteLeitura}
                    />
                    <FormControlLabel
                      value="nao"
                      control={<Radio style={{ color: "green" }} />}
                      label="Não"
                      disabled={somenteLeitura}
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
                      onChange={(e) =>
                        !somenteLeitura && setEnderecoEntrega(e.target.value)
                      }
                      disabled={somenteLeitura}
                    >
                      {enderecos.map((endereco, idx) => (
                        <MenuItem key={idx} value={endereco}>
                          {endereco}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              </Row>

              <Row className="formulario">
                <FormControl fullWidth>
                  <InputLabel id="pagamento-label">
                    Método de Pagamento
                  </InputLabel>
                  <Select
                    labelId="pagamento-label"
                    value={metodoPagamento}
                    onChange={(e) => setMetodoPagamento(e.target.value)}
                    disabled={somenteLeitura}
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
                {!somenteLeitura ? (
                  <Button
                    variant="text"
                    style={{ color: "green" }}
                    onClick={handleAgendar}
                  >
                    Agendar
                  </Button>
                ) : (
                  <p style={{ color: "green" }}>Horário agendado</p>
                )}
                <Button
                  variant="text"
                  style={{ color: "green" }}
                  onClick={() => controlaClique("voltar")}
                >
                  Voltar
                </Button>
              </div>
            </Col>
          </Container>
        </div>
      )}
    </div>
  );
}

export default AgendaADM;
