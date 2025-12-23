const API = "https://amigo-secreto.onrender.com"

// adicionar participante
async function adicionar() {
  const nome = document.getElementById("nome").value.trim()
  if (!nome) return alert("Digite um nome")

  const res = await fetch(`${API}/participantes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome })
  })

  if (!res.ok) {
    const texto = await res.text()
    alert(texto)
    return
  }

  document.getElementById("nome").value = ""
  listar()
}

// listar participantes
async function listar() {
  const res = await fetch(`${API}/participantes`)

  if (!res.ok) {
    const texto = await res.text()
    console.error(texto)
    return
  }

  const dados = await res.json()
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
  const res = await fetch(`${API}/sortear`, {
    method: "POST"
  })

  if (!res.ok) {
    const texto = await res.text()
    alert(texto)
    return
  }

  const data = await res.json()
  alert(data.mensagem)
  listar()
}

// carregar ao abrir
listar()