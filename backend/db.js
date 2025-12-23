const sqlite3 = require("sqlite3").verbose()

const db = new sqlite3.Database("./amigo_secreto.db")

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS participantes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      sorteado TEXT
    )
  `)
})

module.exports = db