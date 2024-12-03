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

app.get("/clientes", requireJWTAuth, async (req, res) => {
  try {
    const clientes = await db.any("SELECT email, pnome FROM pessoa;");
    console.log("Retornando todos clientes.");
    res.json(clientes).status(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
});

// Endereço -----------------------------------------------------------------
app.get("/enderecos", requireJWTAuth, async (req, res) => {
  try {
    const userEmail = req.user.email; // Pega o email do usuário logado a partir do JWT
    const enderecos = await db.any(
      "SELECT eid, num, cidade, logradouro, email FROM endereco WHERE email = $1;",
      [userEmail]
    );

    // Verifica se não há endereços
    if (enderecos.length === 0) {
      return res.status(404).json({ message: "Nenhum endereço encontrado." });
    }

    return res.status(200).json(enderecos);
  } catch (error) {
    console.error("Erro ao buscar endereços:", error);
    return res.status(500).json({ message: "Erro interno do servidor." });
  }
});

app.post("/criarendereco", requireJWTAuth, async (req, res) => {
  try {
    const userEmail = req.user.email;
    const { num, logradouro, cidade } = req.body;

    if (!num || !logradouro || !cidade) {
      console.log("erro");
      return res.status(400).json({ message: "Campos obrigatórios ausentes." });
    }

    await db.none(
      "insert into endereco(num, cidade, logradouro, email) values ($1, $2, $3, $4);",
      [parseInt(num), cidade, logradouro, userEmail]
    );

    console.log("Endereço criado com sucesso");
    res.status(200).json({ message: "Endereço criado com sucesso." });
  } catch (error) {
    console.error("Erro ao criar endereço:", error);
    return res.status(500).json({ message: "Erro interno do servidor." });
  }
});

app.post("/excluirendereco", requireJWTAuth, async (req, res) => {
  try {
    const { eid } = req.body;

    await db.none("delete from endereco where eid =$1;", [eid]);

    console.log("Endereço excluido com sucesso");
    res.status(200).json({ message: "Endereço excluido com sucesso" });
  } catch (error) {
    console.error("Erro ao exluir endereço:", error);
    return res.status(500).json({ message: "Erro interno do servidor." });
  }
});

app.post("/alterarendereco", requireJWTAuth, async (req, res) => {
  try {
    const { num, logradouro, cidade, eid } = req.body;
    console.log(eid);
    if (!num || !logradouro || !cidade || !eid) {
      console.log("erro");
      return res.status(400).json({ message: "Campos obrigatórios ausentes." });
    }

    await db.none(
      "update endereco set num = $1, cidade = $2, logradouro = $3 where eid = $4",
      [num, cidade, logradouro, eid]
    );

    console.log("Endereço alterado com sucesso");
    res.status(200).json({ message: "Endereço alterado com sucesso." });
  } catch (error) {
    console.error("Erro ao alterar endereço:", error);
    return res.status(500).json({ message: "Erro interno do servidor." });
  }
});

// Perfil ---------------------------------------------------------------------------------

app.get("/perfil", requireJWTAuth, async (req, res) => {
  try {
    const userEmail = req.user.email;
    const perfil = await db.oneOrNone(
      "SELECT email, pnome, cpf, telefone FROM pessoa WHERE email = $1;",
      [userEmail]
    );

    if (!perfil) {
      return res.status(404).json({ message: "Perfil não encontrado." });
    }

    console.log(perfil);
    return res.status(200).json(perfil);
  } catch (error) {
    console.error("Erro ao buscar perfil:", error);
    return res.status(500).json({ message: "Erro interno do servidor." });
  }
});

app.post("/alterarperfil", requireJWTAuth, async (req, res) => {
  try {
    const { telefone, pnome } = req.body;
    const userEmail = req.user.email;

    if (!telefone || !pnome) {
      console.log("erro");
      return res.status(400).json({ message: "Campos obrigatórios ausentes." });
    }

    await db.none(
      "update pessoa set telefone = $1, pnome = $2 where email = $3;",
      [telefone, pnome, userEmail]
    );

    console.log("Perfil alterado com sucesso");
    res.status(200).json({ message: "Perfil alterado com sucesso." });
  } catch (error) {
    console.error("Erro ao alterar perfil:", error);
    return res.status(500).json({ message: "Erro interno do servidor." });
  }
});

// Tabela de precos ----------------------------------------------------------------------

app.get("/servico", requireJWTAuth, async (req, res) => {
  try {
    const servicos = await db.any("SELECT sid, preco, sdescr from servico;");
    if (servicos.length === 0) {
      return res.status(404).json({ message: "Nenhum serviço encontrado." });
    }

    return res.status(200).json(servicos);
  } catch (error) {
    console.error("Erro ao buscar serviços:", error);
    return res.status(500).json({ message: "Erro interno do servidor." });
  }
});

app.post("/criarservico", requireJWTAuth, async (req, res) => {
  try {
    const { preco, sdescr } = req.body;

    if (!preco || !sdescr) {
      console.log("erro");
      return res.status(400).json({ message: "Campos obrigatórios ausentes." });
    }

    await db.none(" insert into servico(preco, sdescr) values ($1, $2);", [
      preco,
      sdescr,
    ]);

    console.log("serviço criado com sucesso");
    res.status(200).json({ message: "servico criado com sucesso." });
  } catch (error) {
    console.error("Erro ao criar servico:", error);
    return res.status(500).json({ message: "Erro interno do servidor." });
  }
});

app.post("/excluirservico", requireJWTAuth, async (req, res) => {
  try {
    const { sid } = req.body;

    await db.none("delete from servico where sid =$1;", [sid]);

    console.log("servico excluido com sucesso");
    res.status(200).json({ message: "servico excluido com sucesso" });
  } catch (error) {
    console.error("Erro ao exluir servico:", error);
    return res.status(500).json({ message: "Erro interno do servidor." });
  }
});

app.post("/alterarservico", requireJWTAuth, async (req, res) => {
  try {
    const { sid, preco, sdescr } = req.body;

    if (!preco || !sdescr || !sid) {
      console.log("erro");
      return res.status(400).json({ message: "Campos obrigatórios ausentes." });
    }

    await db.none("update servico set preco = $1, sdescr = $2 where sid = $3", [
      preco,
      sdescr,
      sid,
    ]);

    console.log("servico alterado com sucesso");
    res.status(200).json({ message: "servico alterado com sucesso." });
  } catch (error) {
    console.error("Erro ao alterar servico:", error);
    return res.status(500).json({ message: "Erro interno do servidor." });
  }
});

// Anotacoes -----------------------------------------------------------------
app.get("/anotacoes", requireJWTAuth, async (req, res) => {
  try {
    const anotacoes = await db.any(
      " select anid, andescr, feito from anotacoes;"
    );

    if (anotacoes.length === 0) {
      return res.status(404).json({ message: "Nenhuma anotação encontrado." });
    }

    return res.status(200).json(anotacoes);
  } catch (error) {
    console.error("Erro ao buscar anotações:", error);
    return res.status(500).json({ message: "Erro interno do servidor." });
  }
});

app.post("/criaranotacoes", requireJWTAuth, async (req, res) => {
  try {
    const { andescr, feito } = req.body;

    if (!andescr || !feito) {
      console.log("erro");
      return res.status(400).json({ message: "Campos obrigatórios ausentes." });
    }

    await db.none("insert into anotacoes(andescr, feito) values ($1, $2);", [
      andescr,
      feito,
    ]);

    console.log("Anotação criada com sucesso");
    res.status(200).json({ message: "Anotação criada com sucesso." });
  } catch (error) {
    console.error("Erro ao criar endereço:", error);
    return res.status(500).json({ message: "Erro interno do servidor." });
  }
});

app.post("/excluiranotacoes", requireJWTAuth, async (req, res) => {
  try {
    const { anid } = req.body;

    await db.none("delete from anotacoes where anid =$1;", [anid]);

    console.log("Anotação excluido com sucesso");
    res.status(200).json({ message: "Anotação excluido com sucesso" });
  } catch (error) {
    console.error("Erro ao exluir anotação:", error);
    return res.status(500).json({ message: "Erro interno do servidor." });
  }
});

app.post("/alteraranotacoes", requireJWTAuth, async (req, res) => {
  try {
    const { andescr, feito, anid } = req.body;

    if (!andescr || !feito || !anid) {
      console.log("erro");
      return res.status(400).json({ message: "Campos obrigatórios ausentes." });
    }

    await db.none(
      "update anotacoes set andescr = $1, feito = $2 where anid = $3;",
      [andescr, feito, anid]
    );

    console.log("Anotação alterado com sucesso");
    res.status(200).json({ message: "Anotação alterado com sucesso." });
  } catch (error) {
    console.error("Erro ao alterar anotação:", error);
    return res.status(500).json({ message: "Erro interno do servidor." });
  }
});

// Animal -----------------------------------------------------------------
app.get("/animais", requireJWTAuth, async (req, res) => {
  try {
    const userEmail = req.user.email; // Pega o email do usuário logado a partir do JWT
    const animais = await db.any(
      "select aid, nome, especie, porte, comp, sexo, permissao from animal where email = $1;",
      [userEmail]
    );

    if (animais.length === 0) {
      return res.status(404).json({ message: "Nenhum animal encontrado." });
    }

    return res.status(200).json(animais);
  } catch (error) {
    console.error("Erro ao buscar animals:", error);
    return res.status(500).json({ message: "Erro interno do servidor." });
  }
});

app.post("/criaranimal", requireJWTAuth, async (req, res) => {
  try {
    const userEmail = req.user.email;
    const { nome, especie, porte, comp, sexo, permissao, email } = req.body;

    if (!nome || !especie || !porte || !comp || !sexo || !permissao) {
      console.log("erro");
      return res.status(400).json({ message: "Campos obrigatórios ausentes." });
    }

    if (!email) {
      await db.none(
        "insert into animal(nome, especie, porte, comp, sexo, permissao, email) values ($1, $2, $3, $4, $5, $6, $7);",
        [nome, especie, porte, comp, sexo, permissao, userEmail]
      );
    } else {
      await db.none(
        "insert into animal(nome, especie, porte, comp, sexo, permissao, email) values ($1, $2, $3, $4, $5, $6, $7);",
        [nome, especie, porte, comp, sexo, permissao, email]
      );
    }

    console.log("animal criado com sucesso");
    res.status(200).json({ message: "animal criado com sucesso." });
  } catch (error) {
    console.error("Erro ao criar animal:", error);
    return res.status(500).json({ message: "Erro interno do servidor." });
  }
});

app.post("/excluiranimal", requireJWTAuth, async (req, res) => {
  try {
    const { aid } = req.body;

    await db.none("delete from animal where aid =$1;", [aid]);

    console.log("animal excluido com sucesso");
    res.status(200).json({ message: "animal excluido com sucesso" });
  } catch (error) {
    console.error("Erro ao exluir animal:", error);
    return res.status(500).json({ message: "Erro interno do servidor." });
  }
});

app.post("/alteraranimal", requireJWTAuth, async (req, res) => {
  try {
    const userEmail = req.user.email;
    const { aid, nome, especie, porte, comp, sexo, permissao, email } =
      req.body;

    if (!aid || !nome || !especie || !porte || !comp || !sexo || !permissao) {
      console.log("erro");
      return res.status(400).json({ message: "Campos obrigatórios ausentes." });
    }
    if (!email) {
      await db.none(
        "update animal set nome = $1, especie = $2, porte = $3, comp = $4, sexo = $5, permissao = $6, email = $7 where aid = $8;",
        [nome, especie, porte, comp, sexo, permissao, userEmail, aid]
      );
    } else {
      await db.none(
        "update animal set nome = $1, especie = $2, porte = $3, comp = $4, sexo = $5, permissao = $6, email = $7 where aid = $8;",
        [nome, especie, porte, comp, sexo, permissao, email, aid]
      );
    }

    console.log("animal alterado com sucesso");
    res.status(200).json({ message: "animal alterado com sucesso." });
  } catch (error) {
    console.error("Erro ao alterar animal:", error);
    return res.status(500).json({ message: "Erro interno do servidor." });
  }
});

//busca usuario
app.get("/usuario", requireJWTAuth, async (req, res) => {
  try {
    const userEmail = req.user.email;
    const perfil = await db.oneOrNone(
      "select administrador from pessoa WHERE email = $1;",
      [userEmail]
    );

    if (!perfil) {
      return res.status(404).json({ message: "Perfil não encontrado." });
    }

    console.log(perfil);
    return res.status(200).json(perfil);
  } catch (error) {
    console.error("Erro ao buscar perfil:", error);
    return res.status(500).json({ message: "Erro interno do servidor." });
  }
});

// Cadastro de novo usuário
app.post("/novoUsuario", async (req, res) => {
  const saltRounds = 10;

  try {
    // Recebendo dados da requisição
    const { username, passwd, pnome, cpf, telefone, administrador } = req.body;

    // Validar se todos os campos obrigatórios foram enviados
    if (!username || !passwd || !pnome || !cpf || !telefone || !administrador) {
      console.log("erro");
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
      [username, pnome, hashedPasswd, cpf, telefone, administrador]
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
