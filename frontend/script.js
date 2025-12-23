const API = "https://amigo-secreto-backend.onrender.com"

// ===============================
// ADICIONAR PARTICIPANTE
// ===============================
async function adicionar() {
  const nomeInput = document.getElementById("nome")
  const nome = nomeInput.value.trim()

  if (!nome) {
    alert("Digite um nome")
    return
  }

  try {
    const res = await fetch(`${API}/participantes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ nome })
    })

    const texto = await res.text()

    if (!res.ok) {
      alert(texto)
      return
    }

    nomeInput.value = ""
    listar()

  } catch (err) {
    alert("Erro ao adicionar participante")
  }
}

// ===============================
// LISTAR PARTICIPANTES
// ===============================
async function listar() {
  try {
    const res = await fetch(`${API}/participantes`)

    if (!res.ok) {
      alert("Erro ao buscar participantes")
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

  } catch (err) {
    alert("Erro de conexão com o servidor")
  }
}

// ===============================
// SORTEAR TODOS
// ===============================
async function sortear() {
  try {
    const res = await fetch(`${API}/sortear`, {
      method: "POST"
    })

    const texto = await res.text()

    if (!res.ok) {
      alert(texto)
      return
    }

    const data = JSON.parse(texto)
    alert(data.mensagem)
    listar()

  } catch (err) {
    alert("Erro ao realizar sorteio")
  }
}

// ===============================
// CARREGAR AO ABRIR
// ===============================
listar()