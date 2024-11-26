import React from "react";
import Cabecalho from "./Cabecalho";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "./App.css";
import Login from "./Login";
import Agenda from "./Agenda";
import TabelaPrecos from "./TabelaPrecos";
import Perfil from "./Perfil";
import CriarConta from "./CriarConta";
import Anotacoes from "./Anotacoes";
import Enderecos from "./Enderecos";
import TabelaFinancas from "./TabelaFinancas";
import Historico from "./Historico";

function App() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [exibeAgenda, setExibeAgenda] = React.useState(false);
  const [exibeEndereco, setexibeEndereco] = React.useState(false);
  const [exibeHistorico, setexibeHistorico] = React.useState(false);
  const [exibeAnotacoes, setexibeAnotacoes] = React.useState(false);
  const [exibeFinancas, setexibeFinancas] = React.useState(false);
  const [exibeTabelaPreco, setexibeTabelaPreco] = React.useState(false);
  const [exibeConta, setexibeConta] = React.useState(false);

  // const navigate = useNavigate();

  React.useEffect(() => {
    // verifica se já está logado
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  function controlaInterface(id) {
    console.log(`Veio ${id}`);
    if (id === "agenda") {
      setExibeAgenda(true);
      setexibeEndereco(false);
      setexibeHistorico(false);
      setexibeAnotacoes(false);
      setexibeFinancas(false);
      setexibeTabelaPreco(false);
      setexibeConta(false);
    } else if (id === "enderecos") {
      setExibeAgenda(false);
      setexibeEndereco(true);
      setexibeHistorico(false);
      setexibeAnotacoes(false);
      setexibeFinancas(false);
      setexibeTabelaPreco(false);
      setexibeConta(false);
    } else if (id === "historico") {
      setExibeAgenda(false);
      setexibeEndereco(false);
      setexibeHistorico(true);
      setexibeAnotacoes(false);
      setexibeFinancas(false);
      setexibeTabelaPreco(false);
      setexibeConta(false);
    } else if (id === "anotacoes") {
      setExibeAgenda(false);
      setexibeEndereco(false);
      setexibeHistorico(false);
      setexibeAnotacoes(true);
      setexibeFinancas(false);
      setexibeTabelaPreco(false);
      setexibeConta(false);
    } else if (id === "financas") {
      setExibeAgenda(false);
      setexibeEndereco(false);
      setexibeHistorico(false);
      setexibeAnotacoes(false);
      setexibeFinancas(true);
      setexibeTabelaPreco(false);
      setexibeConta(false);
    } else if (id === "tabelapreco") {
      setExibeAgenda(false);
      setexibeEndereco(false);
      setexibeHistorico(false);
      setexibeAnotacoes(false);
      setexibeFinancas(false);
      setexibeTabelaPreco(true);
      setexibeConta(false);
    } else if (id === "conta") {
      setExibeAgenda(false);
      setexibeEndereco(false);
      setexibeHistorico(false);
      setexibeAnotacoes(false);
      setexibeFinancas(false);
      setexibeTabelaPreco(false);
      setexibeConta(true);
    }
  }

  return (
    <div>
      <Container>
        <Row>
          <Col>
            <Cabecalho controlaClique={controlaInterface} />
          </Col>
        </Row>
        <Row id="menu">
          {/*  {isLoggedIn ? (
            <div> */}
          {exibeAgenda ? (
            <div id="menu">
              <TabelaPrecos></TabelaPrecos> <Agenda></Agenda>
            </div>
          ) : (
            <div> </div>
          )}
          {exibeAnotacoes ? <Anotacoes></Anotacoes> : <div> </div>}
          {exibeEndereco ? <Enderecos></Enderecos> : <div> </div>}
          {exibeHistorico ? <Historico></Historico> : <div> </div>}
          {exibeAnotacoes ? <Anotacoes></Anotacoes> : <div> </div>}
          {exibeFinancas ? <TabelaFinancas></TabelaFinancas> : <div> </div>}
          {exibeTabelaPreco ? <TabelaPrecos></TabelaPrecos> : <div> </div>}
          {exibeConta ? <Perfil></Perfil> : <div> </div>}
          {/*  </div>
          ) : (
            <Login></Login>
          )} */}
        </Row>
      </Container>
    </div>
  );
}

export default App;
