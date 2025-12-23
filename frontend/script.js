const API = "https://amigo-secreto-backend.onrender.com"

async function sortear() {
  const meuNome = document.getElementById("meuNome").value.trim()
  const erro = document.getElementById("mensagemErro")
  erro.textContent = ""

  if (!meuNome) {
    erro.textContent = "Digite seu nome!"
    return
  }

  try {
    const res = await fetch(`${API}/sortear-usuario`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ nome: meuNome })
    })

    const data = await res.json()

    if (!res.ok) {
      erro.textContent = data.erro
      return
    }

    document.getElementById("resultado").innerHTML =
      `🎁 Você tirou:<br><strong>${data.sorteado}</strong> 🎄`

    document.getElementById("popup").style.display = "flex"

  } catch (err) {
    erro.textContent = "Erro ao conectar com o servidor"
  }
}

function fecharPopup() {
  document.getElementById("popup").style.display = "none"
}