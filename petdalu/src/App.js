import React from "react";
import Cabecalho from "./Cabecalho";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "./App.css";
import Login from "./Login";
import Agenda from "./Agenda";
import TabelaPrecos from "./TabelaPrecos";
import AlterarTabelaPrecos from "./AlterarTabelaPrecos";
import Perfil from "./Perfil";
import CriarConta from "./CriarConta";
import Anotacoes from "./Anotacoes";
import Enderecos from "./Enderecos";
import TabelaFinancas from "./TabelaFinancas";
import axios from "axios";
import Animais from "./Animais";

axios.defaults.baseURL = "http://localhost:3010/";
axios.defaults.headers.common["Content-Type"] =
  "application/json;charset=utf-8";

function App() {
  const [exibeAgenda, setExibeAgenda] = React.useState(true);
  const [exibeEndereco, setexibeEndereco] = React.useState(false);
  const [exibeAnotacoes, setexibeAnotacoes] = React.useState(false);
  const [exibeFinancas, setexibeFinancas] = React.useState(false);
  const [exibeTabelaPreco, setexibeTabelaPreco] = React.useState(false);
  const [exibeConta, setexibeConta] = React.useState(false);
  const [exibeAnimais, setexibeAnimais] = React.useState(false);

  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  //const navigate = useNavigate();

  React.useEffect(() => {
    // verifica se já está logado
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  // const handleLogin = () => {
  // 	setIsLoggedIn(true);
  // };

  const handleLogout = () => {
    // Clear the token from localStorage
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  function controlaInterface(id) {
    if (id === "agenda") {
      setExibeAgenda(true);
      setexibeEndereco(false);

      setexibeAnotacoes(false);
      setexibeFinancas(false);
      setexibeTabelaPreco(false);
      setexibeConta(false);
      setexibeAnimais(false);
    } else if (id === "enderecos") {
      setExibeAgenda(false);
      setexibeEndereco(true);

      setexibeAnotacoes(false);
      setexibeFinancas(false);
      setexibeTabelaPreco(false);
      setexibeConta(false);
      setexibeAnimais(false);
    } else if (id === "historico") {
      setExibeAgenda(false);
      setexibeEndereco(false);

      setexibeAnotacoes(false);
      setexibeFinancas(false);
      setexibeTabelaPreco(false);
      setexibeConta(false);
      setexibeAnimais(false);
    } else if (id === "anotacoes") {
      setExibeAgenda(false);
      setexibeEndereco(false);

      setexibeAnotacoes(true);
      setexibeFinancas(false);
      setexibeTabelaPreco(false);
      setexibeConta(false);
      setexibeAnimais(false);
    } else if (id === "financas") {
      setExibeAgenda(false);
      setexibeEndereco(false);

      setexibeAnotacoes(false);
      setexibeFinancas(true);
      setexibeTabelaPreco(false);
      setexibeConta(false);
      setexibeAnimais(false);
    } else if (id === "tabelapreco") {
      setExibeAgenda(false);
      setexibeEndereco(false);

      setexibeAnotacoes(false);
      setexibeFinancas(false);
      setexibeTabelaPreco(true);
      setexibeConta(false);
      setexibeAnimais(false);
    } else if (id === "conta") {
      setExibeAgenda(false);
      setexibeEndereco(false);

      setexibeAnotacoes(false);
      setexibeFinancas(false);
      setexibeTabelaPreco(false);
      setexibeConta(true);
      setexibeAnimais(false);
    } else if (id === "animais") {
      setExibeAgenda(false);
      setexibeEndereco(false);

      setexibeAnotacoes(false);
      setexibeFinancas(false);
      setexibeTabelaPreco(false);
      setexibeConta(false);
      setexibeAnimais(true);
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
          {isLoggedIn ? (
            <div>
              {exibeAgenda ? (
                <div id="menu">
                  <TabelaPrecos></TabelaPrecos> <Agenda></Agenda>
                </div>
              ) : (
                <div> </div>
              )}

              {exibeAnotacoes ? <Anotacoes></Anotacoes> : <div> </div>}
              {exibeEndereco ? <Enderecos></Enderecos> : <div> </div>}
              {exibeFinancas ? <TabelaFinancas></TabelaFinancas> : <div> </div>}
              {exibeTabelaPreco ? (
                <AlterarTabelaPrecos></AlterarTabelaPrecos>
              ) : (
                <div> </div>
              )}
              {exibeConta ? (
                <Perfil logout={handleLogout}></Perfil>
              ) : (
                <div> </div>
              )}
              {exibeAnimais ? <Animais></Animais> : <div></div>}
            </div>
          ) : (
            <Login user={isLoggedIn} handleLogin={setIsLoggedIn} />
          )}
        </Row>
      </Container>
    </div>
  );
}

export default App;
