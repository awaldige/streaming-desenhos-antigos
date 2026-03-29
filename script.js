/* ===== CONFIGURAÇÕES E ESTADO GLOBAL ===== */
const capasPadrao = {
    "he-man": "imagens/he-man.png",
    "scooby-doo": "imagens/scooby-doo.png",
    "tom & jerry": "imagens/tom-e-jerry.png",
    "pica-pau": "imagens/pica-pau.png"
};

let listaOriginal = [];
// Alterado: Adicionado isAssinante para o plano VIP do Aiven
let usuarioLogado = { isAdmin: false, isAssinante: false };
let videoAtual = ""; 

/* ===== 1. SISTEMA DE AUTENTICAÇÃO ===== */

function abrirModalLogin() { 
    document.getElementById("modalLogin").style.display = "flex"; 
}

function fecharModalLogin() { 
    document.getElementById("modalLogin").style.display = "none";
    document.getElementById("formLogin").reset();
}

document.getElementById("formLogin").onsubmit = async (e) => {
    e.preventDefault();
    const btn = document.getElementById("btnFazerLogin");
    btn.innerText = "Conectando ao Aiven...";
    btn.disabled = true;

    const formData = new FormData();
    formData.append("login", document.getElementById("login_user").value.trim());
    formData.append("senha", document.getElementById("senha_user").value.trim());

    try {
        const res = await fetch("api/login.php", { method: "POST", body: formData });
        const dados = await res.json();
        
        if (dados.sucesso) {
            usuarioLogado.isAdmin = dados.isAdmin;
            usuarioLogado.isAssinante = true; // No Aiven, login bem-sucedido = VIP
            
            aplicarPermissoes();
            fecharModalLogin();
            
            document.getElementById("btnLogar").style.display = "none";
            document.getElementById("btnSair").style.display = "block";
            
            renderizarCards(listaOriginal);
            mostrarNotificacao(dados.isAdmin ? "Modo Administrador Ativo! 🔓" : "Acesso VIP Liberado! 🍿");
            
            // Se o usuário já tinha clicado em um desenho, inicia o vídeo automaticamente
            if (videoAtual) iniciarVideo();
            
        } else {
            alert(dados.erro);
        }
    } catch (erro) { 
        alert("Erro ao conectar com o banco Cloud."); 
    } finally {
        btn.innerText = "Entrar";
        btn.disabled = false;
    }
};

function fazerLogout() {
    usuarioLogado = { isAdmin: false, isAssinante: false };
    aplicarPermissoes();
    document.getElementById("btnLogar").style.display = "block";
    document.getElementById("btnSair").style.display = "none";
    fecharVideo();
    renderizarCards(listaOriginal);
    mostrarNotificacao("Sessão encerrada.");
}

function aplicarPermissoes() {
    if (usuarioLogado.isAdmin) {
        document.body.classList.add("is-admin");
    } else {
        document.body.classList.remove("is-admin");
    }
}

/* ===== 2. CARREGAMENTO E RENDERIZAÇÃO (MANTIDOS) ===== */

async function carregarDesenhos() {
    try {
        const resposta = await fetch("api/desenhos.php");
        listaOriginal = await resposta.json(); 
        renderizarCards(listaOriginal);
        if (listaOriginal.length > 0) atualizarBannerDinamico(listaOriginal[0]);
    } catch (erro) { console.error("Erro ao carregar desenhos:", erro); }
}

function renderizarCards(desenhos) {
    const mainContainer = document.getElementById("secoes-decadas");
    mainContainer.innerHTML = "";

    const grupos = {};
    desenhos.forEach(d => {
        const ano = parseInt(d.ano_lancamento);
        const decada = Math.floor(ano / 10) * 10;
        const tituloDecada = `Anos ${decada}`;
        if (!grupos[tituloDecada]) grupos[tituloDecada] = [];
        grupos[tituloDecada].push(d);
    });

    Object.keys(grupos).sort().reverse().forEach(decada => {
        const h2 = document.createElement("h2");
        h2.className = "categoria";
        h2.innerText = decada;
        mainContainer.appendChild(h2);

        const section = document.createElement("section");
        section.className = "linha";
        grupos[decada].forEach(d => section.appendChild(criarCard(d)));
        mainContainer.appendChild(section);
    });
}

function criarCard(d) {
    const card = document.createElement("div");
    card.className = "card";
    const capa = d.imagem || `https://picsum.photos/seed/${d.id_desenho}/300/450`;
    
    card.innerHTML = `
        <img src="${capa}" alt="${d.nome}" loading="lazy">
        <div class="info">
            <h3>${d.nome}</h3>
            <p>${d.ano_lancamento}</p>
            <div class="acoes admin-only">
                <button onclick="event.stopPropagation(); prepararEdicao(${d.id_desenho})">✏️</button>
                <button onclick="event.stopPropagation(); excluirDesenho(${d.id_desenho})">🗑️</button>
            </div>
        </div>
    `;
    card.onclick = () => atualizarBannerDinamico(d);
    return card;
}

/* ===== 3. PLAYER COM TRAVA VIP ===== */

function atualizarBannerDinamico(d) {
    const banner = document.getElementById("banner");
    const btnAssistir = document.getElementById("btnAssistir");

    fecharVideo();
    const capa = d.imagem || `https://picsum.photos/seed/${d.id_desenho}/800/450`;
    banner.style.backgroundImage = `linear-gradient(to top, #141414, transparent), url(${capa})`;
    
    document.getElementById("banner-titulo").innerText = d.nome;
    document.getElementById("banner-desc").innerText = d.descricao || "Sem descrição disponível.";

    videoAtual = d.video_url || "";
    btnAssistir.style.display = videoAtual ? "block" : "none";
}

function iniciarVideo() {
    // TRAVA DE SEGURANÇA: Só assiste se estiver logado (Admin ou Assinante)
    if (!usuarioLogado.isAssinante && !usuarioLogado.isAdmin) {
        mostrarNotificacao("Faça login para liberar o player! 🔒");
        abrirModalLogin();
        return;
    }

    if (!videoAtual) return;
    const playerContainer = document.getElementById("player-container");
    document.getElementById("banner-info").style.display = "none";
    playerContainer.style.display = "block";

    let htmlPlayer = `<button id="btnFecharVideo" onclick="fecharVideo()">✕</button>`;

    if (videoAtual.includes("youtube.com") || videoAtual.includes("youtu.be")) {
        const idVideo = videoAtual.match(/(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/user\/\S+|\/ytscreeningroom\?v=))([\w\-]{11})/)[1];
        htmlPlayer += `<iframe width="100%" height="100%" src="https://www.youtube.com/embed/${idVideo}?autoplay=1" frameborder="0" allow="autoplay" allowfullscreen></iframe>`;
    } else {
        htmlPlayer += `<video width="100%" height="100%" controls autoplay><source src="${videoAtual}" type="video/mp4"></video>`;
    }
    playerContainer.innerHTML = htmlPlayer;
}

function fecharVideo() {
    const pc = document.getElementById("player-container");
    pc.innerHTML = "";
    pc.style.display = "none";
    document.getElementById("banner-info").style.display = "block";
}

/* ===== 4. GESTÃO E UTILITÁRIOS (MANTIDOS) ===== */
// ... (mantenha suas funções de abrirModal, fecharModal, excluirDesenho e mostrarNotificacao como estão)

function mostrarNotificacao(msg) {
    const toast = document.getElementById("toast");
    toast.innerText = msg;
    toast.style.display = "block";
    setTimeout(() => { toast.style.display = "none"; }, 3000);
}

carregarDesenhos();
