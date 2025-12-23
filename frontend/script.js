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

listar()