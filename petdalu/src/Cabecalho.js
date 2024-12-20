import "./Cabecalho.css";
import React from "react";
import Titulo from "./Titulo";
import ImagemUsuario from "./ImagemUsuario";
import { Button } from "@mui/material";

function Cabecalho({ controlaClique, userRole, isLoggedIn }) {
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
        {userRole && isLoggedIn ? (
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
        ) : (
          <div></div>
        )}
        {userRole && isLoggedIn ? (
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
        ) : (
          <div></div>
        )}
        {/*   {userRole && isLoggedIn ? (
          <Button
            id="tabelapreco"
            variant="link"
            className="item"
            onClick={(event) => {
              controlaClique(event.target.id);
            }}
          >
            Tabela de Preços
          </Button>
        ) : (
          <div></div>
        )} */}
        <Button
          id="animais"
          variant="link"
          className="item"
          onClick={(event) => {
            controlaClique(event.target.id);
          }}
        >
          Animais
        </Button>
        {userRole && isLoggedIn ? (
          <Button
            id="cadhorario"
            variant="link"
            className="item"
            onClick={(event) => {
              controlaClique(event.target.id);
            }}
          >
            Cadastro Agenda
          </Button>
        ) : (
          <div></div>
        )}
        {!userRole && isLoggedIn ? (
          <Button
            id="historico"
            variant="link"
            className="item"
            onClick={(event) => {
              controlaClique(event.target.id);
            }}
          >
            Historico
          </Button>
        ) : (
          <div></div>
        )}
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
