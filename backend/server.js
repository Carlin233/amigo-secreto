const API = "https://amigo-secreto-backend.onrender.com"

// listar participantes
async function listar() {
  try {
    const res = await fetch(`${API}/participantes`)

    if (!res.ok) {
      const texto = await res.text()
      alert(texto)
      return
    }

    const dados = await res.json()
    const lista = document.getElementById("lista")
    lista.innerHTML = ""

    dados.forEach(p => {
      const li = document.createElement("li")

      // só mostra o sorteado depois do sorteio
      li.innerText = p.sorteado
        ? `${p.nome} → ${p.sorteado}`
        : p.nome

      lista.appendChild(li)
    })
  } catch (err) {
    alert("Erro ao carregar participantes")
  }
}

// sortear
async function sortear() {
  try {
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
  } catch (err) {
    alert("Erro ao realizar sorteio")
  }
}

// carregar ao abrir
listar()