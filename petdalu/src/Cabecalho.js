import "./Cabecalho.css";
import React from "react";
import Titulo from "./Titulo";
import ImagemUsuario from "./ImagemUsuario";
import { Box, Button } from "@mui/material";

function Cabecalho({ controlaClique }) {
  return (
    <div id="faixa">
      <div id="logo">
        <Titulo id="logo"></Titulo>
      </div>

      <div id="itens">
        <Button
          id="agenda"
          variant="link"
          className="item"
          onClick={(event) => {
            controlaClique(event.target.id);
          }}
        >
          Agenda
        </Button>
        <Button
          id="enderecos"
          variant="link"
          className="item"
          onClick={(event) => {
            controlaClique(event.target.id);
          }}
        >
          Endereços
        </Button>
        <Button
          id="historico"
          variant="link"
          className="item"
          onClick={(event) => {
            controlaClique(event.target.id);
          }}
        >
          Histórico
        </Button>
        <Button
          id="anotacoes"
          variant="link"
          className="item"
          onClick={(event) => {
            controlaClique(event.target.id);
          }}
        >
          Anotações
        </Button>
        <Button
          id="financas"
          variant="link"
          className="item"
          onClick={(event) => {
            controlaClique(event.target.id);
          }}
        >
          Finanças
        </Button>
        <Button
          id="tabelaprecos"
          variant="link"
          className="item"
          onClick={(event) => {
            controlaClique(event.target.id);
          }}
        >
          Tabela de Preços
        </Button>

        <Button
          id="conta"
          className="item"
          variant="link"
          onClick={(event) => {
            controlaClique(event.target.id);
          }}
        >
          <ImagemUsuario />
        </Button>
      </div>
    </div>
  );
}

export default Cabecalho;
