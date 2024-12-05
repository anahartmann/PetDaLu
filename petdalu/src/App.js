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
import Anotacoes from "./Anotacoes";
import Enderecos from "./Enderecos";
import TabelaFinancas from "./TabelaFinancas";
import axios from "axios";
import Animais from "./Animais";
import CadastroHorarios from "./CadastroHorarios";

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
  const [userRole, setUserRole] = React.useState(false);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [exibeCadHorario, setexibeCadHorario] = React.useState(false);

  React.useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    } else {
      handleLogout();
    }
    isAdmin();
  }, []);

  async function isAdmin() {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:3010/usuario", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.administrador === "s") {
        setUserRole(true);
      } else {
        setUserRole(false);
      }
    } catch (error) {
      console.error("Erro ao buscar perfil:", error);
    }
  }

  function handleLogin() {
    setIsLoggedIn(true);
    isAdmin();
  }
  // Faz a requisição quando o componente é montado

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setExibeAgenda(true);
    setexibeEndereco(false);
    setexibeAnotacoes(false);
    setexibeFinancas(false);
    setexibeTabelaPreco(false);
    setexibeConta(false);
  };

  function controlaInterface(id) {
    if (id === "agenda") {
      setExibeAgenda(true);
      setexibeEndereco(false);
      setexibeCadHorario(false);
      setexibeAnotacoes(false);
      setexibeFinancas(false);
      setexibeTabelaPreco(false);
      setexibeConta(false);
      setexibeAnimais(false);
    } else if (id === "enderecos") {
      setExibeAgenda(false);
      setexibeEndereco(true);
      setexibeCadHorario(false);
      setexibeAnotacoes(false);
      setexibeFinancas(false);
      setexibeTabelaPreco(false);
      setexibeConta(false);
      setexibeAnimais(false);
    } else if (id === "historico") {
      setExibeAgenda(false);
      setexibeEndereco(false);
      setexibeCadHorario(false);
      setexibeAnotacoes(false);
      setexibeFinancas(false);
      setexibeTabelaPreco(false);
      setexibeConta(false);
      setexibeAnimais(false);
    } else if (id === "anotacoes") {
      setExibeAgenda(false);
      setexibeEndereco(false);
      setexibeCadHorario(false);
      setexibeAnotacoes(true);
      setexibeFinancas(false);
      setexibeTabelaPreco(false);
      setexibeConta(false);
      setexibeAnimais(false);
    } else if (id === "financas") {
      setExibeAgenda(false);
      setexibeEndereco(false);
      setexibeCadHorario(false);
      setexibeAnotacoes(false);
      setexibeFinancas(true);
      setexibeTabelaPreco(false);
      setexibeConta(false);
      setexibeAnimais(false);
    } else if (id === "tabelapreco") {
      setExibeAgenda(false);
      setexibeEndereco(false);
      setexibeCadHorario(false);
      setexibeAnotacoes(false);
      setexibeFinancas(false);
      setexibeTabelaPreco(true);
      setexibeConta(false);
      setexibeAnimais(false);
    } else if (id === "conta") {
      setExibeAgenda(false);
      setexibeEndereco(false);
      setexibeCadHorario(false);
      setexibeAnotacoes(false);
      setexibeFinancas(false);
      setexibeTabelaPreco(false);
      setexibeConta(true);
      setexibeAnimais(false);
    } else if (id === "animais") {
      setExibeAgenda(false);
      setexibeEndereco(false);
      setexibeCadHorario(false);
      setexibeAnotacoes(false);
      setexibeFinancas(false);
      setexibeTabelaPreco(false);
      setexibeConta(false);
      setexibeAnimais(true);
    } else if (id === "cadhorario") {
      setExibeAgenda(false);
      setexibeEndereco(false);
      setexibeAnotacoes(false);
      setexibeFinancas(false);
      setexibeTabelaPreco(false);
      setexibeConta(false);
      setexibeAnimais(false);
      setexibeCadHorario(true);
    }
  }

  return (
    <div>
      <Container>
        <Row>
          <Col>
            <Cabecalho
              controlaClique={controlaInterface}
              userRole={userRole}
              isLoggedIn={isLoggedIn}
            />
          </Col>
        </Row>
        <Row id="menu">
          {isLoggedIn ? (
            <div>
              {exibeAgenda && (
                <div id="menu">
                  <AlterarTabelaPrecos userRole={userRole} />
                  <Agenda />
                </div>
              )}

              {exibeAnotacoes && <Anotacoes />}
              {exibeEndereco && <Enderecos />}
              {exibeFinancas && <TabelaFinancas />}
              {exibeTabelaPreco && <AlterarTabelaPrecos />}
              {exibeConta && <Perfil logout={handleLogout} />}
              {exibeAnimais && <Animais userRole={userRole} />}
              {exibeCadHorario && <CadastroHorarios />}
            </div>
          ) : (
            <Login user={isLoggedIn} handleLogin={handleLogin} />
          )}
        </Row>
      </Container>
    </div>
  );
}

export default App;
