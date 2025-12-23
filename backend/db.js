const sqlite3 = require("sqlite3").verbose()

const db = new sqlite3.Database(
  process.env.DB_PATH || "./amigo_secreto.db"
)

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS participantes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL UNIQUE,
      sorteado TEXT
    )
  `)
})

const participantesFixos = [
  "Sharlise",
  "Gabrielle",
  "Ledinha",
  "Adriana",
  "Aline",
  "Jovina",
  "Ana Clara"
]

participantesFixos.forEach(nome => {
  db.run(
    "INSERT OR IGNORE INTO participantes (nome) VALUES (?)",
    [nome]
  )
})

module.exports = db