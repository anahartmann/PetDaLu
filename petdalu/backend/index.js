const express = require('express');

const server = express();
server.use(express.json());
server.use(express.urlencoded({extended: true}));

server.listen(3001, ()=> {console.log('Servidor rodando')});
server.get('/', (req, res) => {
    res.send('Pet da Lu');
})

server.post('/senha', (req, res)=> {
    const nome = req.body.usuario;
    const senha = req.body.senha;

    res.send(`Usuario: ${nome} Senha: ${senha}`)
})

server.post('/data', (req, res)=> {
    const datas = ["12/10", "13/10", "14/10"];
    const datadigitada = req.body.datadigitada;
        switch (datadigitada) {
            case datas[0]:
                res.send(`Horarios disponiveis: 13:00, 14:30, 15:30, 17:00`)
                break;
            case datas[1]:
                res.send(`Horarios disponiveis: 8:00, 11:30, 13:30, 15:00`)
                break;
            case datas[2]:
                res.send(`Horarios disponiveis: 7:00, 8:00, 14:30, 16:00`)
                break;
            default:
                res.send(`Nenhum horario/data disponivel`)
                break;
        }
})

server.post('/cadastro_animal', (req, res)=>{
    const nome = req.body.nome;
    const especie = req.body.especie;
    const porte = req.body.porte;
    const comportamento = req.body.comportamento;
    const permissao = req.body.permissao;

    res.send(`Nome: ${nome} <br> Especie: ${especie} <br>Porte: ${porte}  <br>Comportamento: ${comportamento}  <br>Permissao: ${permissao}`)
})

server.post('/cadastro_usuario', (req, res)=>{
    const nome = req.body.nome;
    const email = req.body.email;
    const endereco = req.body.endereco;

    let i = 0;

    let primeiron = "";
    while (nome[i] != " ") {
        primeiron = primeiron.concat(nome[i]);
        i++;
    }

    res.send(`Nome: ${primeiron} <br> Email: ${email} <br>Endereco: ${endereco}`)
})