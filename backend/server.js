const express = require("express")
const cors = require("cors")
const db = require("./db")

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

// ===============================
// LISTAR PARTICIPANTES (FIX)
// ===============================
app.get("/participantes", (req, res) => {
  db.all(
    "SELECT nome, sorteado FROM participantes",
    (err, rows) => {
      if (err) {
        console.error(err)
        return res
          .status(500)
          .send("Erro ao buscar participantes")
      }
      res.json(rows)
    }
  )
})

// ===============================
// SORTEAR USUÁRIO
// ===============================
app.post("/sortear-usuario", (req, res) => {
  const { nome } = req.body

  if (!nome) {
    return res.status(400).json({ erro: "Nome obrigatório" })
  }

  db.get(
    "SELECT sorteado FROM participantes WHERE nome = ?",
    [nome],
    (err, row) => {
      if (err || !row) {
        return res.status(400).json({ erro: "Nome não encontrado" })
      }

      if (row.sorteado) {
        return res.json({ sorteado: row.sorteado })
      }

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
          if (!rows || rows.length === 0) {
            return res
              .status(400)
              .json({ erro: "Não há nomes disponíveis" })
          }

          const sorteado =
            rows[Math.floor(Math.random() * rows.length)].nome

          db.run(
            "UPDATE participantes SET sorteado = ? WHERE nome = ?",
            [sorteado, nome],
            () => res.json({ sorteado })
          )
        }
      )
    }
  )
})

// ===============================
app.listen(PORT, () => {
  console.log("Servidor rodando na porta", PORT)
})