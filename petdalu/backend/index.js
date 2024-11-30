const express = require("express");
const cors = require("cors");
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

const app = express();
app.use(cors());
app.use(express.json());

// Sessão (modificado para desenvolvimento)
app.use(
  session({
    secret: "alguma_frase_muito_doida_pra_servir_de_SECRET",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // Alterado para false em desenvolvimento
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Estratégia Local
passport.use(
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
    },
    async (username, password, done) => {
      try {
        console.log("Buscando usuário:", username);
        const user = await db.oneOrNone(
          "SELECT email, senha FROM pessoa WHERE email = $1;",
          [username]
        );

        if (!user) {
          console.log("Usuário não encontrado");
          return done(null, false, { message: "Usuário incorreto." });
        }

        const passwordMatch = await bcrypt.compare(password, user.senha);
        if (passwordMatch) {
          console.log("Senha correta. Usuário autenticado:", user.email);
          return done(null, user);
        } else {
          console.log("Senha incorreta");
          return done(null, false, { message: "Senha incorreta." });
        }
      } catch (error) {
        console.error("Erro na autenticação:", error);
        return done(error);
      }
    }
  )
);

// Estratégia JWT
passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: "your-secret-key",
    },
    async (payload, done) => {
      try {
        const user = await db.oneOrNone(
          "SELECT * FROM pessoa WHERE email = $1;",
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

// Serialização e Desserialização
passport.serializeUser((user, cb) => {
  process.nextTick(() => {
    return cb(null, { email: user.email });
  });
});

passport.deserializeUser((user, cb) => {
  process.nextTick(() => {
    return cb(null, user);
  });
});

// Middleware de autenticação JWT
const requireJWTAuth = passport.authenticate("jwt", { session: false });

// Login com LocalStrategy
app.post(
  "/login",
  (req, res, next) => {
    passport.authenticate("local", { session: false }, (err, user, info) => {
      if (err) {
        return res.status(500).json({ error: "Erro no servidor." });
      }
      if (!user) {
        return res
          .status(401)
          .json({ error: info.message || "Autenticação falhou." });
      }
      req.user = user;
      next();
    })(req, res, next);
  },
  (req, res) => {
    const token = jwt.sign({ username: req.user.email }, "your-secret-key", {
      expiresIn: "1h",
    });
    res.json({ message: "Login successful", token });
  }
);

// Rota protegida de exemplo
app.get("/clientes", async (req, res) => {
  try {
    const clientes = await db.any("SELECT * FROM pessoa;");
    console.log("Retornando todos clientes.");
    res.json(clientes).status(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
});

// Cadastro de novo usuário
app.post("/novoUsuario", async (req, res) => {
  const saltRounds = 10;

  try {
    // Recebendo dados da requisição
    const { username, passwd, pnome, cpf, telefone, administrador } = req.body;

    // Validar se todos os campos obrigatórios foram enviados
    if (!username || !passwd || !pnome || !cpf || !telefone) {
      return res.status(400).json({ message: "Campos obrigatórios ausentes." });
    }

    // Verificar se o email ou CPF já existem no banco
    const existingUser = await db.oneOrNone(
      "SELECT * FROM pessoa WHERE email = $1 OR cpf = $2;",
      [username, cpf]
    );

    if (existingUser) {
      return res.status(400).json({ message: "Email ou CPF já registrado." });
    }

    // Gerar o hash da senha
    const hashedPasswd = bcrypt.hashSync(passwd, saltRounds);

    // Inserir o novo usuário no banco
    await db.none(
      "INSERT INTO pessoa (email, pnome, senha, cpf, telefone, administrador) VALUES ($1, $2, $3, $4, $5, $6);",
      [username, pnome, hashedPasswd, cpf, telefone, administrador || false] // `administrador` pode ser falso por padrão
    );

    console.log("Usuário inserido com sucesso");
    res.status(200).json({ message: "Usuário criado com sucesso." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Erro ao criar o usuário." });
  }
});

// Teste inicial
app.get("/", (req, res) => {
  res.send("Hello, world!");
});

// Inicialização do servidor
app.listen(3010, () => console.log("Servidor rodando na porta 3010."));

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
