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

    res.status(200).json({ message: "Endereço excluido com sucesso" });
  } catch (error) {
    console.error("Erro ao exluir endereço:", error);
    return res.status(500).json({ message: "Erro interno do servidor." });
  }
});

app.post("/alterarendereco", requireJWTAuth, async (req, res) => {
  try {
    const { num, logradouro, cidade, eid } = req.body;

    if (!num || !logradouro || !cidade || !eid) {
      console.log("erro");
      return res.status(400).json({ message: "Campos obrigatórios ausentes." });
    }

    await db.none(
      "update endereco set num = $1, cidade = $2, logradouro = $3 where eid = $4",
      [num, cidade, logradouro, eid]
    );

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

    res.status(200).json({ message: "Perfil alterado com sucesso." });
  } catch (error) {
    console.error("Erro ao alterar perfil:", error);
    return res.status(500).json({ message: "Erro interno do servidor." });
  }
});

// Tabela de precos ----------------------------------------------------------------------

app.get("/servico", requireJWTAuth, async (req, res) => {
  try {
    const servicos = await db.any(
      "SELECT sid, preco, sdescr, porte from servico;"
    );

    return res.status(200).json(servicos);
  } catch (error) {
    console.error("Erro ao buscar serviços:", error);
    return res.status(500).json({ message: "Erro interno do servidor." });
  }
});

app.post("/criarservico", requireJWTAuth, async (req, res) => {
  try {
    const { preco, sdescr, porte } = req.body;

    if (!preco || !sdescr) {
      console.log("erro");
      return res.status(400).json({ message: "Campos obrigatórios ausentes." });
    }

    await db.none(
      " insert into servico(preco, sdescr, porte) values ($1, $2, $3);",
      [preco, sdescr, porte]
    );

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

    res.status(200).json({ message: "servico excluido com sucesso" });
  } catch (error) {
    console.error("Erro ao exluir servico:", error);
    return res.status(500).json({ message: "Erro interno do servidor." });
  }
});

app.post("/alterarservico", requireJWTAuth, async (req, res) => {
  try {
    const { sid, preco, sdescr, porte } = req.body;

    if (!preco || !sdescr || !sid) {
      console.log("erro");
      return res.status(400).json({ message: "Campos obrigatórios ausentes." });
    }

    await db.none(
      "update servico set preco = $1, sdescr = $2, porte = $3 where sid = $4",
      [preco, sdescr, porte, sid]
    );

    res.status(200).json({ message: "servico alterado com sucesso." });
  } catch (error) {
    console.error("Erro ao alterar servico:", error);
    return res.status(500).json({ message: "Erro interno do servidor." });
  }
});

app.get("/buscarservico", requireJWTAuth, async (req, res) => {
  try {
    const { sdescr, porte } = req.query; // Usar req.query para GET

    if (!sdescr || !porte) {
      return res.status(400).json({ message: "Campos obrigatórios ausentes." });
    }

    const servico = await db.oneOrNone(
      "SELECT preco, sid FROM servico WHERE porte = $1 AND sdescr = $2 LIMIT 1;",
      [porte, sdescr]
    );

    if (!servico) {
      return res.status(404).json({ message: "Serviço não encontrado." });
    }

    return res.status(200).json(servico);
  } catch (error) {
    console.error("Erro ao buscar serviço:", error);
    return res.status(500).json({ message: "Erro interno do servidor." });
  }
});

app.get("/buscarporte", requireJWTAuth, async (req, res) => {
  try {
    const { aid } = req.query; // Usar req.query para GET

    if (!aid) {
      return res.status(400).json({ message: "Campo 'aid' é obrigatório." });
    }

    const porte = await db.oneOrNone(
      "SELECT porte FROM animal WHERE aid = $1 LIMIT 1;",
      [aid]
    );

    if (!porte) {
      return res.status(404).json({ message: "Animal não encontrado." });
    }

    return res.status(200).json(porte);
  } catch (error) {
    console.error("Erro ao buscar porte:", error);
    return res.status(500).json({ message: "Erro interno do servidor." });
  }
});

// Anotacoes -----------------------------------------------------------------
app.get("/anotacoes", requireJWTAuth, async (req, res) => {
  try {
    const anotacoes = await db.any(
      " select anid, andescr, feito from anotacoes;"
    );

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
      return res.status(400).json({ message: "Campos obrigatórios ausentes." });
    }

    await db.none("insert into anotacoes(andescr, feito) values ($1, $2);", [
      andescr,
      feito,
    ]);

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

    res.status(200).json({ message: "animal alterado com sucesso." });
  } catch (error) {
    console.error("Erro ao alterar animal:", error);
    return res.status(500).json({ message: "Erro interno do servidor." });
  }
});

// Finanças -----------------------------------------------------------------------------------------
app.get("/financas", requireJWTAuth, async (req, res) => {
  try {
    const financas = await db.any(
      "select h.hhora as hid, p.pnome as pnome, a.nome as anome, d.ddata as data, g.preco_total as preco, g.pagamento as pago from pessoa p join animal a on p.email = a.email join agendamento g on g.aid = a.aid join horarios h on h.hhora = g.hhora join data d on d.ddata = g.ddata;"
    );

    return res.status(200).json(financas);
  } catch (error) {
    console.error("Erro ao buscar finanças:", error);
    return res.status(500).json({ message: "Erro interno do servidor." });
  }
});

app.post("/alterarfinanca", requireJWTAuth, async (req, res) => {
  try {
    const { pago, hid, data } = req.body;

    if (!pago || !hid || !data) {
      console.log("erro");
      return res.status(400).json({ message: "Campos obrigatórios ausentes." });
    }

    await db.none(
      "update agendamento set pagamento = $1 where hhora = $2 and ddata = $3;",
      [pago, hid, data]
    );

    res.status(200).json({ message: "Finança alterado com sucesso." });
  } catch (error) {
    console.error("Erro ao alterar endereço:", error);
    return res.status(500).json({ message: "Erro interno do servidor." });
  }
});

// Data -----------------------------------------------------------------
app.get("/datas", requireJWTAuth, async (req, res) => {
  try {
    const datas = await db.any(
      " select ddata as data, ddescr as descr from data order by ddata;"
    );

    return res.status(200).json(datas);
  } catch (error) {
    console.error("Erro ao buscar datas:", error);
    return res.status(500).json({ message: "Erro interno do servidor." });
  }
});

app.post("/criardatas", requireJWTAuth, async (req, res) => {
  try {
    const { data, descr } = req.body;

    if (!data || !descr) {
      console.log("erro");
      return res.status(400).json({ message: "Campos obrigatórios ausentes." });
    }

    await db.none("insert into data(ddata, ddescr) values ($1, $2);", [
      data,
      descr,
    ]);

    res.status(200).json({ message: "data criada com sucesso." });
  } catch (error) {
    console.error("Erro ao criar data:", error);
    return res.status(500).json({ message: "Erro interno do servidor." });
  }
});

app.post("/excluirdatas", requireJWTAuth, async (req, res) => {
  try {
    const { data } = req.body;

    await db.none("delete from data where ddata = $1;", [data]);

    res.status(200).json({ message: "data excluida com sucesso" });
  } catch (error) {
    console.error("Erro ao exluir data:", error);
    return res.status(500).json({ message: "Erro interno do servidor." });
  }
});

app.post("/alterardatas", requireJWTAuth, async (req, res) => {
  try {
    const { data, descr, dataant } = req.body;

    if (!data || !descr || !dataant) {
      console.log("erro");
      return res.status(400).json({ message: "Campos obrigatórios ausentes." });
    }

    await db.none("update data set ddescr = $1, ddata = $2 where ddata = $3;", [
      descr,
      data,
      dataant,
    ]);

    res.status(200).json({ message: "data alterada com sucesso." });
  } catch (error) {
    console.error("Erro ao alterar data:", error);
    return res.status(500).json({ message: "Erro interno do servidor." });
  }
});

// Horarios -----------------------------------------------------------------
app.get("/horarios", requireJWTAuth, async (req, res) => {
  try {
    const horarios = await db.any(
      "select hhora as hora from horarios order by hhora;"
    );

    return res.status(200).json(horarios);
  } catch (error) {
    console.error("Erro ao buscar horarios:", error);
    return res.status(500).json({ message: "Erro interno do servidor." });
  }
});

app.post("/criarhorarios", requireJWTAuth, async (req, res) => {
  try {
    const { horario } = req.body;

    if (!horario) {
      console.log("erro");
      return res.status(400).json({ message: "Campos obrigatórios ausentes." });
    }

    await db.none("insert into horarios(hhora) values ($1);", [horario]);

    res.status(200).json({ message: "horario criado com sucesso." });
  } catch (error) {
    console.error("Erro ao criar horario:", error);
    return res.status(500).json({ message: "Erro interno do servidor." });
  }
});

app.post("/excluirhorarios", requireJWTAuth, async (req, res) => {
  try {
    const { horario } = req.body;

    await db.none("delete from horarios where hhora =$1;", [horario]);

    res.status(200).json({ message: "horario excluido com sucesso" });
  } catch (error) {
    console.error("Erro ao exluir horario:", error);
    return res.status(500).json({ message: "Erro interno do servidor." });
  }
});

app.post("/alterarhorarios", requireJWTAuth, async (req, res) => {
  try {
    const { horario, horarioant } = req.body;

    if (!horario || !horarioant) {
      console.log("erro");
      return res.status(400).json({ message: "Campos obrigatórios ausentes." });
    }

    await db.none("update horarios set hhora = $1 where hhora = $2;", [
      horario,
      horarioant,
    ]);

    res.status(200).json({ message: "horario alterado com sucesso." });
  } catch (error) {
    console.error("Erro ao alterar horarios:", error);
    return res.status(500).json({ message: "Erro interno do servidor." });
  }
});

// Agenda -----------------------------------------------------------------
app.get("/agenda", async (req, res) => {
  try {
    const { hora, data } = req.query; // Usar req.query para GET
    if (!hora || !data) {
      return res.status(400).json({ message: "Hora e data são obrigatórios." });
    }

    const agenda = await db.oneOrNone(
      "SELECT ddata, hhora FROM agendamento WHERE ddata = $1 AND hhora = $2;",
      [data, hora]
    );

    if (!agenda) {
      return res.json({ disponivel: false });
    }

    return res.json({ disponivel: true });
  } catch (error) {
    console.error("Erro ao buscar agenda:", error);
    return res.status(500).json({ message: "Erro interno do servidor." });
  }
});

app.get("/buscaragenda", requireJWTAuth, async (req, res) => {
  try {
    const { hora, data } = req.query; // Usar req.query para GET
    if (!hora || !data) {
      return res.status(400).json({ message: "Hora e data são obrigatórios." });
    }

    const agenda = await db.oneOrNone(
      "SELECT pe.pnome as pnome, a.email as email, s.sdescr, g.met_pagamento AS met_pagamento, g.tipo_tosa AS tipo_tosa, g.preco_total AS preco, a.nome AS nomepet, a.especie AS especie,a.porte AS porte,a.comp AS comp,a.sexo AS sexo,a.permissao AS permissao,e1.logradouro AS logbusca,e1.num AS numbusca,e1.cidade AS cidadebusca, e2.logradouro AS logentrega, e2.num AS numentrega, e2.cidade AS cidadeentrega FROM agendamento g LEFT JOIN animal a ON g.aid = a.aid LEFT JOIN endereco e1 ON g.eid_busca = e1.eid LEFT JOIN endereco e2 ON g.eid_entrega = e2.eid natural left JOIN processo p natural left JOIN servico s join pessoa pe on pe.email = a.email WHERE g.ddata = $1 AND g.hhora = $2;",
      [data, hora]
    );

    return res.json(agenda);
  } catch (error) {
    console.error("Erro ao buscar agenda:", error);
    return res.status(500).json({ message: "Erro interno do servidor." });
  }
});

app.post("/criaragendamento", requireJWTAuth, async (req, res) => {
  try {
    const {
      sid,
      ddata,
      hhora,
      pagamento,
      met_pagamento,
      tipo_tosa,
      preco_total,
      aid,
      eid_entrega,
      eid_busca,
    } = req.body;

    if (
      !sid ||
      !ddata ||
      !hhora ||
      !pagamento ||
      !met_pagamento ||
      !preco_total ||
      !aid
    ) {
      console.log("erro");
      return res.status(400).json({ message: "Campos obrigatórios ausentes." });
    }

    await db.none(
      "insert into agendamento( ddata, hhora, pagamento, met_pagamento, tipo_tosa, preco_total, aid, eid_entrega, eid_busca) values ($1, $2, $3, $4, $5, $6, $7, $8, $9);",
      [
        ddata,
        hhora,
        pagamento,
        met_pagamento,
        tipo_tosa,
        preco_total,
        aid,
        eid_entrega,
        eid_busca,
      ]
    );

    await db.none(
      "insert into processo(sid, ddata, hhora) values ($1, $2, $3);",
      [sid, ddata, hhora]
    );

    res.status(200).json({ message: "agendamento criado com sucesso." });
  } catch (error) {
    console.error("Erro ao criar agendamento:", error);
    return res.status(500).json({ message: "Erro interno do servidor." });
  }
});

app.post("/excluiragendamento", requireJWTAuth, async (req, res) => {
  try {
    const { ddata, hhora } = req.body;

    await db.none("delete from processo where hhora =$1 and ddata = $2;", [
      hhora,
      ddata,
    ]);

    await db.none("delete from agendamento where hhora =$1 and ddata = $2;", [
      hhora,
      ddata,
    ]);

    res.status(200).json({ message: "agendamento excluido com sucesso" });
  } catch (error) {
    console.error("Erro ao exluir agendamento:", error);
    return res.status(500).json({ message: "Erro interno do servidor." });
  }
});

// Historico  -----------------------------------------------------------------------------------------
app.get("/historico", requireJWTAuth, async (req, res) => {
  try {
    const userEmail = req.user.email;
    const financas = await db.any(
      "select h.hhora as hid, p.pnome as pnome, a.nome as anome, d.ddata as data, g.preco_total as preco, g.pagamento as pago from pessoa p join animal a on p.email = a.email join agendamento g on g.aid = a.aid join horarios h on h.hhora = g.hhora join data d on d.ddata = g.ddata where p.email = $1;",
      [userEmail]
    );

    return res.status(200).json(financas);
  } catch (error) {
    console.error("Erro ao buscar historico:", error);
    return res.status(500).json({ message: "Erro interno do servidor." });
  }
});

app.get("/historicopago", requireJWTAuth, async (req, res) => {
  try {
    const userEmail = req.user.email;
    const financas = await db.any(
      "select g.hhora, g.ddata, g.pagamento as pago from pessoa p join animal a on p.email = a.email join agendamento g on g.aid = a.aid join horarios h on h.hhora = g.hhora join data d on d.ddata = g.ddata where p.email = $1;",
      [userEmail]
    );

    return res.status(200).json(financas);
  } catch (error) {
    console.error("Erro ao buscar historico do pagamento:", error);
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

    res.status(200).json({ message: "Usuário criado com sucesso." });
  } catch (error) {
    res.status(500).json({ message: "Erro ao criar o usuário." });
  }
});

// Teste inicial
app.get("/", (req, res) => {
  res.send("Hello, world!");
});

// Inicialização do servidor
app.listen(3010, () => console.log("Servidor rodando na porta 3010."));
