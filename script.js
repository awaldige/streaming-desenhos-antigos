```javascript
/* ===== CONFIGURAÇÕES E ESTADO GLOBAL ===== */
const capasPadrao = {
    "he-man": "imagens/he-man.png",
    "scooby-doo": "imagens/scooby-doo.png",
    "tom & jerry": "imagens/tom-e-jerry.png",
    "pica-pau": "imagens/pica-pau.png"
};

let listaOriginal = [];
let usuarioLogado = { isAdmin: false };
let videoAtual = "";

/* ⭐ FAVORITOS */
let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];

/* ===== FAVORITOS ===== */
function toggleFavorito(id) {
    if (favoritos.includes(id)) {
        favoritos = favoritos.filter(f => f !== id);
        mostrarNotificacao("Removido dos favoritos ❌");
    } else {
        favoritos.push(id);
        mostrarNotificacao("Adicionado aos favoritos ⭐");
    }
    localStorage.setItem("favoritos", JSON.stringify(favoritos));
    renderizarCards(listaOriginal);
}

function renderizarFavoritos() {
    const favoritosLista = listaOriginal.filter(d => favoritos.includes(d.id_desenho));
    if (favoritosLista.length === 0) return;

    const container = document.getElementById("secoes-decadas");

    const h2 = document.createElement("h2");
    h2.innerText = "⭐ Minha Lista";
    container.prepend(h2);

    const section = document.createElement("section");
    section.className = "linha";

    favoritosLista.forEach(d => {
        section.appendChild(criarCard(d));
    });

    container.prepend(section);
}

/* ===== CARDS ===== */
function criarCard(d) {
    const nomeNorm = d.nome.toLowerCase().trim();
    let capa = d.imagem
        ? (d.imagem.startsWith("http") ? d.imagem : `imagens/${d.imagem}`)
        : (capasPadrao[nomeNorm] || `https://picsum.photos/seed/${d.id_desenho}/300/450`);

    const isFav = favoritos.includes(d.id_desenho);

    const card = document.createElement("div");
    card.className = "card";
    card.setAttribute("data-title", d.nome);

    card.innerHTML = `
        <img src="${capa}" alt="${d.nome}" loading="lazy">
        <button class="btn-fav" onclick="event.stopPropagation(); toggleFavorito(${d.id_desenho})">
            ${isFav ? "⭐" : "☆"}
        </button>
    `;

    card.onclick = () => atualizarBannerDinamico(d);
    return card;
}

/* ===== RENDER ===== */
function renderizarCards(desenhos) {
    const mainContainer = document.getElementById("secoes-decadas");
    mainContainer.innerHTML = "";

    if (desenhos.length === 0) {
        mainContainer.innerHTML = "<p>Nenhum desenho encontrado.</p>";
        return;
    }

    renderizarFavoritos();

    const grupos = {};
    desenhos.forEach(d => {
        const decada = Math.floor(d.ano_lancamento / 10) * 10;
        const key = `Anos ${decada}`;
        if (!grupos[key]) grupos[key] = [];
        grupos[key].push(d);
    });

    Object.keys(grupos).sort().reverse().forEach(decada => {
        const h2 = document.createElement("h2");
        h2.innerText = decada;
        mainContainer.appendChild(h2);

        const section = document.createElement("section");
        section.className = "linha";

        grupos[decada].forEach(d => section.appendChild(criarCard(d)));

        mainContainer.appendChild(section);
    });
}

/* ===== PLAYER MELHORADO ===== */
function iniciarVideo() {
    if (!videoAtual) return;

    const container = document.getElementById("player-container");
    const info = document.getElementById("banner-info");

    info.style.display = "none";
    container.style.display = "block";

    let html = `<button onclick="fecharVideo()" class="fechar-video">✕</button>`;

    if (/youtube|youtu\.be/.test(videoAtual)) {
        const id = videoAtual.split("v=")[1]?.split("&")[0] || videoAtual.split("/").pop();

        html += `
        <iframe src="https://www.youtube.com/embed/${id}?autoplay=1"
        frameborder="0" allow="autoplay" allowfullscreen></iframe>`;
    } else {
        html += `<video src="${videoAtual}" controls autoplay></video>`;
    }

    container.innerHTML = html;
}

/* ===== ALEATÓRIO ===== */
function assistirAlgoAleatorio() {
    if (!listaOriginal.length) return;

    const sorteado = listaOriginal[Math.floor(Math.random() * listaOriginal.length)];
    atualizarBannerDinamico(sorteado);

    setTimeout(() => iniciarVideo(), 500);
}

/* ===== BUSCA ===== */
function filtrarDesenhos() {
    const termo = document.getElementById("inputBusca").value.toLowerCase();

    const filtrados = listaOriginal.filter(d =>
        d.nome.toLowerCase().includes(termo) ||
        (d.descricao && d.descricao.toLowerCase().includes(termo))
    );

    renderizarCards(filtrados);
}

/* ===== INIT ===== */
async function carregarDesenhos() {
    const res = await fetch("api/desenhos.php");
    listaOriginal = await res.json();

    renderizarCards(listaOriginal);

    if (listaOriginal.length > 0) {
        atualizarBannerDinamico(listaOriginal[0]);
    }
}

carregarDesenhos();
```
