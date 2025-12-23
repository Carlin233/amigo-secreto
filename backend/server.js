const express = require("express")
const cors = require("cors")
const db = require("./db")

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

/* ROTA DE TESTE (MUITO IMPORTANTE) */
app.get("/", (req, res) => {
  res.send("🔥 Backend Amigo Secreto rodando!")
})

/* LISTAR PARTICIPANTES */
app.get("/participantes", (req, res) => {
  db.all(
    "SELECT nome, sorteado FROM participantes",
    [],
    (err, rows) => {
      if (err) {
        console.error(err)
        return res.status(500).send("Erro ao buscar participantes")
      }
      res.json(rows)
    }
  )
})

/* SORTEIO INDIVIDUAL */
app.post("/sortear-usuario", (req, res) => {
  const { nome } = req.body

  if (!nome) {
    return res.status(400).json({ erro: "Nome é obrigatório" })
  }

  db.get(
    "SELECT * FROM participantes WHERE nome = ?",
    [nome],
    (err, usuario) => {
      if (err) {
        console.error(err)
        return res.status(500).json({ erro: "Erro no banco" })
      }

      if (!usuario) {
        return res.status(404).json({ erro: "Nome não encontrado" })
      }

      if (usuario.sorteado) {
        return res.json({ sorteado: usuario.sorteado })
      }

      db.all(
        "SELECT nome FROM participantes WHERE nome != ? AND sorteado IS NULL",
        [nome],
        (err, disponiveis) => {
          if (err || disponiveis.length === 0) {
            return res.status(400).json({
              erro: "Não há mais nomes disponíveis"
            })
          }

          const escolhido =
            disponiveis[Math.floor(Math.random() * disponiveis.length)].nome

          db.run(
            "UPDATE participantes SET sorteado = ? WHERE nome = ?",
            [escolhido, nome],
            err => {
              if (err) {
                return res.status(500).json({ erro: "Erro ao salvar sorteio" })
              }

              res.json({ sorteado: escolhido })
            }
          )
        }
      )
    }
  )
})

/* INICIAR SERVIDOR (OBRIGATÓRIO NO RENDER) */
app.listen(PORT, () => {
  console.log("✅ Servidor rodando na porta", PORT)
})
