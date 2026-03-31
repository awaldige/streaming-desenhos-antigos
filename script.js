/* ===== CONFIGURAÇÕES E ESTADO GLOBAL ===== */
const capasPadrao = {
    "he-man": "imagens/he-man.png",
    "scooby-doo": "imagens/scooby-doo.png",
    "tom & jerry": "imagens/tom-e-jerry.png",
    "pica-pau": "imagens/pica-pau.png"
};

let listaOriginal = [];
// Agora controlamos se é admin e se está autenticado (assinante)
let usuarioLogado = { isAdmin: false, estaAutenticado: false };
let videoAtual = ""; 

/* ===== 1. SISTEMA DE AUTENTICAÇÃO ===== */

function abrirModalLogin() { 
    document.getElementById("modalLogin").style.display = "block"; 
}

function fecharModalLogin() { 
    document.getElementById("modalLogin").style.display = "none";
    document.getElementById("formLogin").reset();
}

// Funções para o novo Modal de Cadastro
function abrirModalCadastro() {
    // Você precisará criar esse ID no seu HTML ou usar o de login adaptado
    document.getElementById("modalCadastroUsuario").style.display = "block";
}

function fecharModalCadastro() {
    document.getElementById("modalCadastroUsuario").style.display = "none";
}

document.getElementById("formLogin").onsubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("login", document.getElementById("login_user").value.trim());
    formData.append("senha", document.getElementById("senha_user").value.trim());

    try {
        const res = await fetch("api/login.php", { method: "POST", body: formData });
        const dados = await res.json();
        
        if (dados.sucesso) {
            usuarioLogado.isAdmin = dados.isAdmin;
            usuarioLogado.estaAutenticado = true;
            
            aplicarPermissoes();
            fecharModalLogin();
            
            document.getElementById("btnLogar").style.display = "none";
            document.getElementById("btnSair").style.display = "block";
            
            renderizarCards(listaOriginal);
            
            const msg = dados.isAdmin ? "Bem-vindo, Administrador! 🔓" : `Olá, ${dados.nome}! Acesso VIP liberado. 🍿`;
            mostrarNotificacao(msg);
            
        } else if (dados.status === "nao_encontrado") {
            // LÓGICA DE DESVIO PARA CADASTRO
            if (confirm("Usuário não encontrado. Deseja criar uma conta de assinante agora?")) {
                fecharModalLogin();
                abrirModalCadastro(); // Abre a tela de cadastro
            }
        } else {
            alert(dados.erro);
        }
    } catch (erro) { alert("Erro ao conectar com o servidor."); }
};

function fazerLogout() {
    usuarioLogado = { isAdmin: false, estaAutenticado: false };
    aplicarPermissoes();
    fecharVideo();
    document.getElementById("btnLogar").style.display = "block";
    document.getElementById("btnSair").style.display = "none";
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
        aplicarPermissoes();
        if (listaOriginal.length > 0) atualizarBannerDinamico(listaOriginal[0]);
    } catch (erro) { console.error("Erro ao carregar desenhos:", erro); }
}

function renderizarCards(desenhos) {
    const mainContainer = document.getElementById("secoes-decadas");
    mainContainer.innerHTML = "";

    if (desenhos.length === 0) {
        mainContainer.innerHTML = "<p style='text-align:center; padding: 20px;'>Nenhum desenho encontrado.</p>";
        return;
    }

    const grupos = {};
    desenhos.forEach(d => {
        const ano = parseInt(d.ano_lancamento);
        const decada = Math.floor(ano / 10) * 10;
        const tituloDecada = `Anos ${decada}`;
        if (!grupos[tituloDecada]) grupos[tituloDecada] = [];
        grupos[tituloDecada].push(d);
    });

    const decadasOrdenadas = Object.keys(grupos).sort().reverse();

    decadasOrdenadas.forEach(decada => {
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
    const nomeNorm = d.nome.toLowerCase().trim();
    let capa = d.imagem ? (d.imagem.startsWith("http") ? d.imagem : `imagens/${d.imagem}`) : (capasPadrao[nomeNorm] || `https://picsum.photos/seed/${d.id_desenho}/300/450`);

    const card = document.createElement("div");
    card.className = "card";
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

/* ===== 3. PLAYER COM TRAVA DE ACESSO ===== */

function atualizarBannerDinamico(d) {
    const banner = document.getElementById("banner");
    fecharVideo();

    let capa = d.imagem ? (d.imagem.startsWith("http") ? d.imagem : `imagens/${d.imagem}`) : `https://picsum.photos/seed/${d.id_desenho}/800/450`;

    banner.style.backgroundImage = `linear-gradient(to top, #141414, transparent), url(${capa})`;
    document.getElementById("banner-titulo").innerText = d.nome;
    document.getElementById("banner-desc").innerText = d.descricao || "Sem descrição disponível.";

    videoAtual = d.video_url || "";
    document.getElementById("btnAssistir").style.display = videoAtual ? "block" : "none";
}

function iniciarVideo() {
    // TRAVA: Só assiste se estiver logado (Admin ou Assinante)
    if (!usuarioLogado.estaAutenticado) {
        mostrarNotificacao("Acesso restrito. Faça login para assistir! 🔒");
        abrirModalLogin();
        return;
    }

    if (!videoAtual) return;
    const playerContainer = document.getElementById("player-container");
    document.getElementById("banner-info").style.display = "none";
    playerContainer.style.display = "block";

    let htmlPlayer = `<button id="btnFecharVideo" onclick="fecharVideo()">✕</button>`;

    if (videoAtual.includes("youtube.com") || videoAtual.includes("youtu.be")) {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = videoAtual.match(regExp);
        const idVideo = (match && match[2].length == 11) ? match[2] : null;
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

/* ===== 4. GESTÃO (CRUD) E UTILITÁRIOS (MANTIDOS) ===== */

function abrirModal() {
    if(!usuarioLogado.isAdmin) return alert("Acesso restrito ao Administrador.");
    document.getElementById("modalCadastro").style.display = "block";
}

function fecharModal() {
    document.getElementById("modalCadastro").style.display = "none";
    document.getElementById("formDesenho").reset();
    document.getElementById("edit_id").value = "";
    document.getElementById("container-preview").style.display = "none";
    document.getElementById("modal-titulo").innerText = "Adicionar Desenho";
}

function mostrarNotificacao(msg) {
    const toast = document.getElementById("toast");
    toast.innerText = msg;
    toast.style.display = "block";
    setTimeout(() => { toast.style.display = "none"; }, 3000);
}

// Fechar modais ao clicar fora
window.onclick = (e) => { 
    if (e.target.className === "modal") {
        fecharModal();
        fecharModalLogin();
        if(document.getElementById("modalCadastroUsuario")) fecharModalCadastro();
    }
};

carregarDesenhos();
