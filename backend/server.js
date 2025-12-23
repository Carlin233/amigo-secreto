const express = require("express")
const cors = require("cors")
const db = require("./db")

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

// 🔹 TESTE DE VIDA DO SERVIDOR
app.get("/", (req, res) => {
  res.send("Servidor Amigo Secreto ONLINE 🚀")
})

// 🔹 LISTAR PARTICIPANTES
app.get("/participantes", (req, res) => {
  db.all("SELECT nome, sorteado FROM participantes", [], (err, rows) => {
    if (err) {
      return res.status(500).send("Erro ao buscar participantes")
    }
    res.json(rows)
  })
})

// 🔹 SORTEAR TODOS (ADMIN)
app.post("/sortear", (req, res) => {
  db.all("SELECT nome FROM participantes", [], (err, rows) => {
    if (err) return res.status(500).send("Erro no banco")

    const nomes = rows.map(r => r.nome)
    let sorteio = [...nomes]

    // embaralhar
    for (let i = sorteio.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[sorteio[i], sorteio[j]] = [sorteio[j], sorteio[i]]
    }

    // impedir auto-sorteio
    for (let i = 0; i < nomes.length; i++) {
      if (nomes[i] === sorteio[i]) {
        return res.status(400).send("Refaça o sorteio")
      }
    }

    const stmt = db.prepare(
      "UPDATE participantes SET sorteado = ? WHERE nome = ?"
    )

    nomes.forEach((nome, i) => {
      stmt.run(sorteio[i], nome)
    })

    stmt.finalize()
    res.json({ mensagem: "Sorteio realizado com sucesso 🎉" })
  })
})

// 🔹 SORTEAR USUÁRIO INDIVIDUAL (TELA DO SITE)
app.post("/sortear-usuario", (req, res) => {
  const { nome } = req.body

  if (!nome) {
    return res.status(400).json({ erro: "Nome não informado" })
  }

  db.get(
    "SELECT sorteado FROM participantes WHERE nome = ?",
    [nome],
    (err, row) => {
      if (err) {
        return res.status(500).json({ erro: "Erro no servidor" })
      }

      if (!row) {
        return res.status(404).json({ erro: "Nome não encontrado" })
      }

      // 🔥 SE NÃO EXISTIR SORTEIO, FAZ AUTOMATICAMENTE
      if (!row.sorteado) {
        return res.status(400).json({
          erro: "O sorteio geral ainda não foi realizado. Fale com o administrador."
        })
      }

      res.json({ sorteado: row.sorteado })
    }
  )
})


app.listen(PORT, () => {
  console.log("Servidor rodando na porta", PORT)
})