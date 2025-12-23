const express = require("express")
const cors = require("cors")
const sqlite3 = require("sqlite3").verbose()

const app = express()
const PORT = process.env.PORT || 3000

// ===============================
// MIDDLEWARES
// ===============================
app.use(cors())
app.use(express.json())

// ===============================
// BANCO DE DADOS
// ===============================
const db = new sqlite3.Database("./database.db")

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS participantes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT UNIQUE,
      sorteado TEXT
    )
  `)
})

// ===============================
// ROTAS
// ===============================

// listar participantes
app.get("/participantes", (req, res) => {
  db.all(
    "SELECT nome, sorteado FROM participantes",
    (err, rows) => {
      if (err) {
        return res.status(500).send("Erro ao buscar participantes")
      }
      res.json(rows)
    }
  )
})

// adicionar participante
app.post("/participantes", (req, res) => {
  const { nome } = req.body

  if (!nome) {
    return res.status(400).send("Nome obrigatório")
  }

  db.run(
    "INSERT INTO participantes (nome) VALUES (?)",
    [nome],
    err => {
      if (err) {
        return res.status(400).send("Nome já existe")
      }
      res.send("Participante adicionado")
    }
  )
})

// ===============================
// SORTEIO INDIVIDUAL
// ===============================
app.post("/sortear-usuario", (req, res) => {
  const { nome } = req.body

  if (!nome) {
    return res.status(400).json({ erro: "Nome obrigatório" })
  }

  // verifica se existe
  db.get(
    "SELECT sorteado FROM participantes WHERE nome = ?",
    [nome],
    (err, participante) => {
      if (err) {
        return res.status(500).json({ erro: "Erro no banco" })
      }

      if (!participante) {
        return res.status(400).json({ erro: "Nome não encontrado" })
      }

      // se já sorteou
      if (participante.sorteado) {
        return res.json({ sorteado: participante.sorteado })
      }

      // busca nomes disponíveis
      db.all(
        `
        SELECT nome FROM participantes
        WHERE nome != ?
        AND nome NOT IN (
          SELECT sorteado FROM participantes WHERE sorteado IS NOT NULL
        )
        `,
        [nome],
        (err, rows) => {
          if (err || rows.length === 0) {
            return res
              .status(400)
              .json({ erro: "Não há nomes disponíveis para sortear" })
          }

          const sorteado =
            rows[Math.floor(Math.random() * rows.length)].nome

          // salva no banco
          db.run(
            "UPDATE participantes SET sorteado = ? WHERE nome = ?",
            [sorteado, nome],
            err => {
              if (err) {
                return res
                  .status(500)
                  .json({ erro: "Erro ao salvar sorteio" })
              }

              res.json({ sorteado })
            }
          )
        }
      )
    }
  )
})

// ===============================
// SORTEIO GLOBAL (OPCIONAL)
// ===============================
app.post("/sortear", (req, res) => {
  db.all("SELECT nome FROM participantes", (err, rows) => {
    if (err || rows.length < 3) {
      return res.status(400).send("Participantes insuficientes")
    }

    const nomes = rows.map(r => r.nome)

    function embaralhar(arr) {
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[arr[i], arr[j]] = [arr[j], arr[i]]
      }
      return arr
    }

    let sorteados
    let valido = false

    while (!valido) {
      sorteados = embaralhar([...nomes])
      valido = nomes.every((n, i) => n !== sorteados[i])
    }

    const stmt = db.prepare(
      "UPDATE participantes SET sorteado = ? WHERE nome = ?"
    )

    nomes.forEach((nome, i) => {
      stmt.run(sorteados[i], nome)
    })

    stmt.finalize()
    res.json({ mensagem: "Sorteio realizado com sucesso 🎉" })
  })
})

// ===============================
// START
// ===============================
app.listen(PORT, () => {
  console.log("Servidor rodando na porta", PORT)
})