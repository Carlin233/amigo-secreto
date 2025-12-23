const API = "https://amigo-secreto-backend.onrender.com"

// adicionar participante
async function adicionar() {
  const nome = document.getElementById("nome").value

  if (!nome) {
    alert("Digite um nome")
    return
  }

  await fetch(`${API}/participantes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome })
  })

  document.getElementById("nome").value = ""
  listar()
}

// listar participantes
async function listar() {
  const res = await fetch(`${API}/participantes`)
  const dados = await res.json()

  const lista = document.getElementById("lista")
  lista.innerHTML = ""

  dados.forEach(p => {
    const li = document.createElement("li")
    li.innerText = p.sorteado
      ? `${p.nome} → ${p.sorteado}`
      : p.nome
    lista.appendChild(li)
  })
}

// sortear
async function sortear() {
  const res = await fetch(`${API}/sortear`, {
    method: "POST"
  })

  const data = await res.json()
  alert(data.mensagem)

  listar()
}

// carregar lista ao abrir
listar()