import React, { useState } from "react";
import "./Agenda.css";
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

function Agenda() {
  const [exibeAgendamento, setExibeAgendamento] = useState(false);
  const [exibeAgenda, setExibeAgenda] = useState(true);
  const [horarioSelecionado, setHorarioSelecionado] = useState("");
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
    domicilio: 10, // valor único para buscar ou entregar
  };

  const diasDaSemana = [
    { data: "11/11", dia: "Segunda-feira" },
    { data: "12/11", dia: "Terça-feira" },
    { data: "13/11", dia: "Quarta-feira" }, //ainda tenho que mudar aq
  ];

  const horariosPorDia = ["13:30", "14:30", "15:30", "16:30", "17:30"];

  function controlaClique(id) {
    if (id === "voltar") {
      setExibeAgenda(true);
      setExibeAgendamento(false);
      resetFormulario();
    } else {
      setHorarioSelecionado(id);
      setExibeAgenda(false);
      setExibeAgendamento(true);
    }
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
      [horarioSelecionado]: logDados, //mostrar dados daquele horario
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
                        title={
                          isIndisponivel
                            ? `Pet: ${isIndisponivel.pet}, Serviço: ${isIndisponivel.tipoServico}, Valor: R$ ${isIndisponivel.valorTotal},00`
                            : ""
                        }
                      >
                        <p
                          className={
                            isIndisponivel
                              ? "horario-indisponivel"
                              : "horario-disponivel"
                          }
                          onClick={() => !isIndisponivel && controlaClique(id)}
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
                  >
                    {pets.map((pet, idx) => (
                      <MenuItem key={idx} value={pet.nome}>
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
                    onChange={(e) => setTipoServico(e.target.value)}
                  >
                    <FormControlLabel
                      value="banho"
                      control={<Radio style={{ color: "green" }} />}
                      label="Banho"
                    />
                    <FormControlLabel
                      value="tosa"
                      control={<Radio style={{ color: "green" }} />}
                      label="Tosa"
                    />
                    <FormControlLabel
                      value="tosa-banho"
                      control={<Radio style={{ color: "green" }} />}
                      label="Banho + Tosa"
                    />
                  </RadioGroup>
                </FormControl>
                {(tipoServico === "tosa" || tipoServico === "tosa-banho") && (
                  <TextField
                    fullWidth
                    label="Descrição da tosa"
                    value={descricaoTosa}
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
                    value={bdomicilio ? "sim" : "nao"}
                    onChange={(e) => setBdomicilio(e.target.value === "sim")}
                  >
                    <FormControlLabel
                      value="sim"
                      control={<Radio style={{ color: "green" }} />}
                      label="Sim"
                    />
                    <FormControlLabel
                      value="nao"
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
                      onChange={(e) => setEnderecoBusca(e.target.value)}
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
                    onChange={(e) => setEdomicilio(e.target.value === "sim")}
                  >
                    <FormControlLabel
                      value="sim"
                      control={<Radio style={{ color: "green" }} />}
                      label="Sim"
                    />
                    <FormControlLabel
                      value="nao"
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
                      onChange={(e) => setEnderecoEntrega(e.target.value)}
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
                    Método de pagamento
                  </InputLabel>
                  <Select
                    labelId="pagamento-label"
                    value={metodoPagamento}
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
  );
}

export default Agenda;
