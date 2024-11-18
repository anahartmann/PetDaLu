import "./Cabecalho.css";
import React from "react";
import Titulo from "./Titulo";
import ImagemUsuario from "./ImagemUsuario";

function Cabecalho() {
  return (
    <div id="faixa">
      <div id="logo">
        <Titulo id="logo"></Titulo>
      </div>

      <div id="itens">
        <a href="Agenda" className="item">
          Pets
        </a>
        <a href="Agenda" className="item">
          Endereços
        </a>
        <a href="Agenda" className="item">
          Histórico
        </a>
        <a href="Agenda" className="item">
          Anotações
        </a>
        <a href="Agenda" className="item">
          Finanças
        </a>
        <a href="Agenda" className="item">
          Tabela de Preços
        </a>

        <a href="Usuario" className="item">
          <ImagemUsuario></ImagemUsuario>
        </a>
      </div>
    </div>
  );
}

export default Cabecalho;
