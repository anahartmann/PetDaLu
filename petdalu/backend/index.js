const express = require("express");
const cors = require("cors"); // Importa o middleware CORS para habilitar requisições de diferentes origens

const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;

const pgp = require("pg-promise")({});

const usuario = "postgres";
const senha = "analinda";
const db = pgp(`postgres://${usuario}:${senha}@localhost:5432/petdalu`);

const server = express();
app.use(cors());
app.use(express.json());

app.use(
  session({
    secret: "alguma_frase_muito_doida_pra_servir_de_SECRET",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: true },
  })
);
app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
    },
    async (username, password, done) => {
      try {
        // busca o usuário no banco de dados
        const user = await db.oneOrNone(
          "SELECT user_id, user_password FROM users WHERE user_id = $1;",
          [username]
        );

        // se não encontrou, retorna erro
        if (!user) {
          return done(null, false, { message: "Usuário incorreto." });
        }

        // verifica se o hash da senha bate com a senha informada
        const passwordMatch = await bcrypt.compare(
          password,
          user.user_password
        );

        // se senha está ok, retorna o objeto usuário
        if (passwordMatch) {
          console.log("Usuário autenticado!");
          return done(null, user);
        } else {
          // senão, retorna um erro
          return done(null, false, { message: "Senha incorreta." });
        }
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: "your-secret-key",
    },
    async (payload, done) => {
      try {
        const user = await db.oneOrNone(
          "SELECT * FROM users WHERE user_id = $1;",
          [payload.username]
        );

        if (user) {
          done(null, user);
        } else {
          done(null, false);
        }
      } catch (error) {
        done(error, false);
      }
    }
  )
);

passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, {
      user_id: user.user_id,
      username: user.user_id,
    });
  });
});

passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, user);
  });
});

const requireJWTAuth = passport.authenticate("jwt", { session: false });

app.listen(3010, () => console.log("Servidor rodando na porta 3010."));

server.listen(3001, () => {
  console.log("Servidor rodando");
});
server.get("/", (req, res) => {
  res.send("Pet da Lu");
});

/* server.post("/senha", (req, res) => {
  const nome = req.body.usuario;
  const senha = req.body.senha;

  res.send(`Usuario: ${nome} Senha: ${senha}`);
});

server.post("/data", (req, res) => {
  const datas = ["12/10", "13/10", "14/10"];
  const datadigitada = req.body.datadigitada;
  switch (datadigitada) {
    case datas[0]:
      res.send(`Horarios disponiveis: 13:00, 14:30, 15:30, 17:00`);
      break;
    case datas[1]:
      res.send(`Horarios disponiveis: 8:00, 11:30, 13:30, 15:00`);
      break;
    case datas[2]:
      res.send(`Horarios disponiveis: 7:00, 8:00, 14:30, 16:00`);
      break;
    default:
      res.send(`Nenhum horario/data disponivel`);
      break;
  }
});

server.post("/cadastro_animal", (req, res) => {
  const nome = req.body.nome;
  const especie = req.body.especie;
  const porte = req.body.porte;
  const comportamento = req.body.comportamento;
  const permissao = req.body.permissao;

  res.send(
    `Nome: ${nome} <br> Especie: ${especie} <br>Porte: ${porte}  <br>Comportamento: ${comportamento}  <br>Permissao: ${permissao}`
  );
});

server.post("/cadastro_usuario", (req, res) => {
  const nome = req.body.nome;
  const email = req.body.email;
  const endereco = req.body.endereco;

  let i = 0;

  let primeiron = "";
  while (nome[i] != " ") {
    primeiron = primeiron.concat(nome[i]);
    i++;
  }

  res.send(`Nome: ${primeiron} <br> Email: ${email} <br>Endereco: ${endereco}`);
}); */
