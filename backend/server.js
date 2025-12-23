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

/* Neve ❄ (continua igual) */
function criarNeve() {
  let floco = document.createElement("div")
  floco.classList.add("snowflake")
  floco.textContent = "❄"
  floco.style.left = Math.random() * 100 + "vw"
  floco.style.animationDuration = (Math.random() * 3 + 2) + "s"
  document.body.appendChild(floco)
  setTimeout(() => floco.remove(), 5000)
}
setInterval(criarNeve, 200)