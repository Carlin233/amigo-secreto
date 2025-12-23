const API = "https://amigo-secreto-backend.onrender.com"

// adicionar participante
async function adicionar() {
  const nome = document.getElementById("nome").value.trim()
  if (!nome) return alert("Digite um nome")

  const res = await fetch(`${API}/participantes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome })
  })

  const texto = await res.text()

  if (!res.ok) {
    alert(texto)
    return
  }

  document.getElementById("nome").value = ""
  listar()
}

// listar participantes
async function listar() {
  const res = await fetch(`${API}/participantes`)
  const dados = await res.ok ? await res.json() : []

  const lista = document.getElementById("lista")
  lista.innerHTML = ""

  dados.forEach(p => {
    const li = document.createElement("li")
    li.textContent = p.sorteado
      ? `${p.nome} → ${p.sorteado}`
      : p.nome
    lista.appendChild(li)
  })
}

// sortear
async function sortear() {
  const res = await fetch(`${API}/sortear`, { method: "POST" })
  const texto = await res.text()

  try {
    const data = JSON.parse(texto)
    alert(data.mensagem)
    listar()
  } catch {
    alert(texto)
  }
}

// carregar ao abrir
listar()