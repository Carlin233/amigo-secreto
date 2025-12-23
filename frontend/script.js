const API = "https://amigo-secreto.onrender.com"

async function adicionar() {
  const nome = document.getElementById("nome").value.trim()
  if (!nome) return alert("Digite um nome")

  await fetch(`${API}/participantes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome })
  })

  document.getElementById("nome").value = ""
  listar()
}

async function listar() {
  const res = await fetch(`${API}/participantes`)
  const dados = await res.json()

  const lista = document.getElementById("lista")
  lista.innerHTML = ""

  dados.forEach(p => {
    const li = document.createElement("li")
    li.innerHTML = p.sorteado
      ? `<strong>${p.nome}</strong><span>${p.sorteado}</span>`
      : `<strong>${p.nome}</strong><span>❓</span>`
    lista.appendChild(li)
  })
}

async function sortear() {
  const res = await fetch(`${API}/sortear`, { method: "POST" })
  const data = await res.json()
  alert(data.mensagem)
  listar()
}

listar()