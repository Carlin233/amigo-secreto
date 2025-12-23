const API = "http://localhost:3000"

function adicionar() {
  const nome = document.getElementById("nome").value
  fetch(API + "/participantes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome })
  }).then(atualizar)
}

function atualizar() {
  fetch(API + "/participantes")
    .then(res => res.json())
    .then(dados => {
      const lista = document.getElementById("lista")
      lista.innerHTML = ""
      dados.forEach(p => {
        lista.innerHTML += `<li>${p.nome} → ${p.sorteado || "?"}</li>`
      })
    })
}

function sortear() {
  fetch(API + "/sortear", { method: "POST" })
    .then(() => atualizar())
}

atualizar()