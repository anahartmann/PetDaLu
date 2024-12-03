import "./Animais.css";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import AddIcon from "@mui/icons-material/Add";
import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import axios from "axios";

function Animais({ userRole }) {
  //onst [animais, setanimais] = useState([]);
  //const [openForm, setOpenForm] = useState(false);

  const [tutores, setTutores] = useState([]); // pegar do clientes

  async function buscarclientes() {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:3010/clientes", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTutores(response.data); // Atualiza os dados no estado
    } catch (error) {
      console.error("Erro ao buscar clientes:", error);
    }
  }

  const [animais, setanimais] = useState([]);

  async function buscaranimais() {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:3010/animais", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setanimais(response.data); // Atualiza os dados no estado
    } catch (error) {
      console.error("Erro ao buscar animais:", error);
    }
  }

  // Faz a requisição quando o componente é montado
  useEffect(() => {
    buscaranimais();
    buscarclientes();
  }, []);

  // Estados para controlar o formulário de novo animal
  const [openForm, setOpenForm] = useState(false);
  const [aid, setAid] = useState(""); // Estado para o aid
  const [nome, setNome] = useState(""); // Estado para o nome
  const [especie, setEspecie] = useState(""); // Estado para a espécie
  const [porte, setPorte] = useState(""); // Estado para o porte
  const [comp, setComp] = useState(""); // Estado para o comportamento
  const [sexo, setSexo] = useState(""); // Estado para o sexo
  const [permissao, setPermissao] = useState("n"); // Estado para a permissão
  const [email, setEmail] = useState("");
  const [erroNome, setErroNome] = useState(false); // Erro para o nome
  const [erroEspecie, setErroEspecie] = useState(false); // Erro para a espécie
  const [erroPorte, setErroPorte] = useState(false); // Erro para o porte
  const [erroComp, setErroComp] = useState(false); // Erro para o comportamento
  const [erroSexo, setErroSexo] = useState(false); // Erro para o sexo

  const [openFormAlterar, setOpenFormAlterar] = useState(false);

  const handleOpenForm = () => setOpenForm(true);
  const handleCloseForm = () => {
    setOpenForm(false);
    setAid("");
    setNome("");
    setEspecie("");
    setPorte("");
    setComp("");
    setSexo("");
    setPermissao("");
    setEmail("");
    setErroNome(false);
    setErroEspecie(false);
    setErroPorte(false);
    setErroComp(false);
    setErroSexo(false);
  };

  const handleOpenFormAlterar = async (
    aid,
    nome,
    especie,
    porte,
    comp,
    sexo,
    permissao,
    email
  ) => {
    setOpenFormAlterar(true);
    setAid(aid);
    setNome(nome);
    setEspecie(especie);
    setPorte(porte);
    setComp(comp);
    setSexo(sexo);
    setPermissao(permissao);
    setEmail(email);
  };
  const handleCloseFormAlterar = () => {
    setOpenFormAlterar(false);
    setAid("");
    setNome("");
    setEspecie("");
    setPorte("");
    setComp("");
    setSexo("");
    setPermissao("");
    setEmail("");
    setErroNome(false);
    setErroEspecie(false);
    setErroPorte(false);
    setErroComp(false);
    setErroSexo(false);
  };

  const handleAdicionaranimal = async () => {
    setErroNome(false);
    setErroEspecie(false);
    setErroPorte(false);
    setErroComp(false);
    setErroSexo(false);
    if (
      nome === "" ||
      especie === "" ||
      porte === "" ||
      comp === "" ||
      sexo === ""
    ) {
      if (nome === "") {
        setErroNome(true);
      }
      if (especie === "") {
        setErroEspecie(true);
      }
      if (porte === "") {
        setErroPorte(true);
      }
      if (comp === "") {
        setErroComp(true);
      }
      if (sexo === "") {
        setErroSexo(true);
      }

      alert("Por favor preencha todos os campos");
    } else {
      adicionaranimal();
    }
  };

  const handleAlteraranimal = async () => {
    setErroNome(false);
    setErroEspecie(false);
    setErroPorte(false);
    setErroComp(false);
    setErroSexo(false);

    if (
      nome === "" ||
      especie === "" ||
      porte === "" ||
      comp === "" ||
      sexo === ""
    ) {
      if (nome === "") {
        setErroNome(true);
      }
      if (especie === "") {
        setErroEspecie(true);
      }
      if (porte === "") {
        setErroPorte(true);
      }
      if (comp === "") {
        setErroComp(true);
      }
      if (sexo === "") {
        setErroSexo(true);
      }

      alert("Por favor preencha todos os campos");
    } else {
      alteraranimal();
    }
  };

  const adicionaranimal = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:3010/criaranimal",
        {
          nome: nome,
          especie: especie,
          porte: porte,
          comp: comp,
          sexo: sexo,
          permissao: permissao,
          email: email,
        }, // Dados do novo animal
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      buscaranimais(); // Atualiza a lista de animals
      handleCloseForm();
    } catch (error) {
      console.error("Erro ao adicionar animal:", error);
    }
  };

  const alteraranimal = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:3010/alteraranimal",
        {
          aid: aid,
          nome: nome,
          especie: especie,
          porte: porte,
          comp: comp,
          sexo: sexo,
          permissao: permissao,
          email: email,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      buscaranimais(); // Atualiza a lista de animals
      handleCloseFormAlterar();
    } catch (error) {
      console.error("Erro ao alterar animal:", error);
    }
  };

  const excluiranimal = async (aid) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:3010/excluiranimal`,
        { aid: aid },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      buscaranimais();
    } catch (error) {
      console.error("Erro ao excluir animal:", error);
    }
  };

  const handleCheck = async (feito) => {
    if (feito === "s") {
      setPermissao("n");
    } else {
      setPermissao("s");
    }
  };

  return (
    <div id="Animais">
      <Container id="cont_ani">
        <Row className="row_ani">
          <p className="txt_ani">Animais</p>
          <Button variant="text" className="item" onClick={handleOpenForm}>
            <AddIcon id="mais" />
          </Button>
        </Row>

        {animais.map((Animal) => (
          <Row key={Animal.aid} className="row_Animal">
            <p className="txt_Animal">
              {Animal.nome} ({Animal.especie})
            </p>
            <div className="actions">
              <Button
                variant="text"
                color="primary"
                size="small"
                onClick={() =>
                  handleOpenFormAlterar(
                    Animal.aid,
                    Animal.nome,
                    Animal.especie,
                    Animal.porte,
                    Animal.comp,
                    Animal.sexo,
                    Animal.permissao
                  )
                }
              >
                Alterar
              </Button>
              <Button
                variant="text"
                color="secondary"
                size="small"
                onClick={() => excluiranimal(Animal.aid)}
              >
                Excluir
              </Button>
            </div>
          </Row>
        ))}

        <Dialog open={openForm} onClose={handleCloseForm}>
          <DialogTitle>Adicionar novo pet</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Nome"
              type="text"
              fullWidth
              error={erroNome}
              variant="outlined"
              value={nome}
              onChange={(event) => setNome(event.target.value)}
            />

            <TextField
              margin="dense"
              label="Espécie"
              type="text"
              fullWidth
              variant="outlined"
              error={erroEspecie}
              value={especie}
              onChange={(event) => setEspecie(event.target.value)}
            />

            <FormControl fullWidth margin="dense">
              <InputLabel>Porte</InputLabel>
              <Select
                error={erroPorte}
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
              error={erroComp}
              value={comp}
              onChange={(event) => setComp(event.target.value)}
            />

            <FormControl fullWidth margin="dense">
              <InputLabel>Sexo</InputLabel>
              <Select
                error={erroSexo}
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
                  onClick={() => handleCheck(permissao)}
                  color="primary"
                />
              }
              label="Permissão para tosa"
            />

            {userRole ? (
              <FormControl fullWidth margin="dense">
                <InputLabel>Tutor</InputLabel>
                <Select
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                >
                  {tutores.map((tutor) => (
                    <MenuItem key={tutor.email} value={tutor.email}>
                      {tutor.pnome} - {tutor.email}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : (
              <div></div>
            )}
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
              onClick={handleAdicionaranimal}
              sx={{ color: "#068146" }}
            >
              Adicionar
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={openFormAlterar} onClose={handleCloseFormAlterar}>
          <DialogTitle>ALterar pet</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Nome"
              type="text"
              fullWidth
              error={erroNome}
              variant="outlined"
              value={nome}
              onChange={(event) => setNome(event.target.value)}
            />

            <TextField
              margin="dense"
              label="Espécie"
              type="text"
              fullWidth
              variant="outlined"
              error={erroEspecie}
              value={especie}
              onChange={(event) => setEspecie(event.target.value)}
            />

            <FormControl fullWidth margin="dense">
              <InputLabel>Porte</InputLabel>
              <Select
                error={erroPorte}
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
              error={erroComp}
              value={comp}
              onChange={(event) => setComp(event.target.value)}
            />

            <FormControl fullWidth margin="dense">
              <InputLabel>Sexo</InputLabel>
              <Select
                error={erroSexo}
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
                  onClick={() => handleCheck(permissao)}
                  color="primary"
                />
              }
              label="Permissão para tosa"
            />
            {userRole ? (
              <FormControl fullWidth margin="dense">
                <InputLabel>Tutor</InputLabel>
                <Select
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                >
                  {tutores.map((tutor) => (
                    <MenuItem key={tutor.email} value={tutor.email}>
                      {tutor.pnome} - {tutor.email}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : (
              <div></div>
            )}
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
              onClick={handleAlteraranimal}
              sx={{ color: "#068146" }}
            >
              Adicionar
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </div>
  );
}

export default Animais;
