/* ===== CONFIGURAÇÕES E ESTADO GLOBAL ===== */
const capasPadrao = {
    "he-man": "imagens/he-man.png",
    "scooby-doo": "imagens/scooby-doo.png",
    "tom & jerry": "imagens/tom-e-jerry.png",
    "pica-pau": "imagens/pica-pau.png"
};

let listaOriginal = [];
let usuarioLogado = { isAdmin: false, estaAutenticado: false, nome: "", login: "" };
let videoAtual = ""; 

/* ===== 1. SISTEMA DE AUTENTICAÇÃO, CADASTRO E PERFIL ===== */

function abrirModalLogin() { document.getElementById("modalLogin").style.display = "block"; }
function fecharModalLogin() { 
    document.getElementById("modalLogin").style.display = "none";
    document.getElementById("formLogin").reset();
}
function abrirModalCadastro() { document.getElementById("modalCadastroUsuario").style.display = "block"; }
function fecharModalCadastro() { 
    document.getElementById("modalCadastroUsuario").style.display = "none";
    document.getElementById("formRegistro").reset();
}
function abrirModalPerfil() {
    if (!usuarioLogado.estaAutenticado) return abrirModalLogin();
    document.getElementById("edit_nome_user").value = usuarioLogado.nome;
    document.getElementById("modalPerfilUsuario").style.display = "block";
}
function fecharModalPerfil() {
    document.getElementById("modalPerfilUsuario").style.display = "none";
    document.getElementById("formEditarPerfil").reset();
}

// LOGIN
document.getElementById("formLogin").onsubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    try {
        const res = await fetch("api/login.php", { method: "POST", body: formData });
        const dados = await res.json();
        if (dados.sucesso) {
            usuarioLogado.isAdmin = dados.isAdmin;
            usuarioLogado.estaAutenticado = true;
            usuarioLogado.nome = dados.nome;
            usuarioLogado.login = document.getElementById("login_user").value.trim();
            aplicarPermissoes();
            fecharModalLogin();
            document.getElementById("btnLogar").innerText = `Perfil: ${dados.nome}`;
            document.getElementById("btnSair").style.display = "block";
            renderizarCards(listaOriginal);
            mostrarNotificacao(dados.isAdmin ? "Modo Administrador Ativado! 🔓" : `Olá, ${dados.nome}! 🍿`);
        } else if (dados.status === "nao_encontrado") {
            if (confirm("Usuário não encontrado. Criar conta?")) {
                fecharModalLogin(); abrirModalCadastro();
            }
        } else { alert(dados.erro); }
    } catch (erro) { alert("Erro ao conectar com o servidor."); }
};

// REGISTRO E GESTÃO DE CONTA (Mantenha como você já tem...)
document.getElementById("formRegistro").onsubmit = async (e) => {
    e.preventDefault();
    const btn = document.getElementById("btnFinalizarCadastro");
    btn.innerText = "Criando conta..."; btn.disabled = true;
    const formData = new FormData(e.target);
    try {
        const res = await fetch("api/cadastrar.php", { method: "POST", body: formData });
        const dados = await res.json();
        if (dados.sucesso) {
            mostrarNotificacao("Conta criada! ✨");
            fecharModalCadastro(); abrirModalLogin(); 
        } else { alert("Erro: " + dados.erro); }
    } catch (erro) { alert("Erro na conexão."); }
    finally { btn.innerText = "Finalizar Cadastro 🎬"; btn.disabled = false; }
};

function fazerLogout() {
    usuarioLogado = { isAdmin: false, estaAutenticado: false, nome: "", login: "" };
    aplicarPermissoes();
    fecharVideo();
    document.getElementById("btnLogar").innerText = "Entrar 🔑";
    document.getElementById("btnSair").style.display = "none";
    renderizarCards(listaOriginal);
    mostrarNotificacao("Sessão encerrada.");
}

function aplicarPermissoes() {
    document.body.classList.toggle("is-admin", usuarioLogado.isAdmin);
}

/* ===== 2. CARREGAMENTO E RENDERIZAÇÃO ===== */

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
        const decada = Math.floor(parseInt(d.ano_lancamento) / 10) * 10;
        const titulo = `Anos ${decada}`;
        if (!grupos[titulo]) grupos[titulo] = [];
        grupos[titulo].push(d);
    });
    Object.keys(grupos).sort().reverse().forEach(decada => {
        const h2 = document.createElement("h2");
        h2.className = "categoria"; h2.innerText = decada;
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
    card.onclick = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        atualizarBannerDinamico(d);
        setTimeout(() => { iniciarVideo(); }, 400);
    };
    return card;
}

/* ===== 3. PLAYER E BANNER ===== */

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
    if (!usuarioLogado.estaAutenticado) {
        mostrarNotificacao("Acesso VIP necessário! 🔒");
        abrirModalLogin(); return;
    }
    if (!videoAtual) return;
    const playerContainer = document.getElementById("player-container");
    document.getElementById("banner-info").style.display = "none";
    playerContainer.style.display = "block";
    let htmlPlayer = `<button id="btnFecharVideo" onclick="fecharVideo()" style="position: absolute; top: 20px; right: 20px; z-index: 100; background: rgba(0,0,0,0.5); color: white; border: 2px solid white; width: 40px; height: 40px; border-radius: 50%; cursor: pointer; font-size: 20px;">✕</button>`;
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
    pc.innerHTML = ""; pc.style.display = "none";
    document.getElementById("banner-info").style.display = "block";
}

/* ===== 4. GESTÃO (CRUD) - ADICIONADO E CORRIGIDO ===== */

function abrirModal() {
    if(!usuarioLogado.isAdmin) return alert("Acesso restrito.");
    document.getElementById("modal-titulo").innerText = "Adicionar Desenho";
    document.getElementById("edit_id").value = "";
    document.getElementById("modalCadastro").style.display = "block";
}

function fecharModal() {
    document.getElementById("modalCadastro").style.display = "none";
    document.getElementById("formDesenho").reset();
    document.getElementById("container-preview").style.display = "none";
}

// BUSCA OS DADOS E PREENCHE O MODAL
function prepararEdicao(id) {
    const desenho = listaOriginal.find(d => d.id_desenho == id);
    if (!desenho) return;

    document.getElementById("modal-titulo").innerText = "Editar Desenho";
    document.getElementById("edit_id").value = desenho.id_desenho;
    document.getElementById("nome").value = desenho.nome;
    document.getElementById("ano").value = desenho.ano_lancamento;
    document.getElementById("descricao").value = desenho.descricao || "";
    document.getElementById("video_url").value = desenho.video_url || "";
    
    if (desenho.imagem) {
        document.getElementById("img-preview").src = desenho.imagem.startsWith("http") ? desenho.imagem : `imagens/${desenho.imagem}`;
        document.getElementById("container-preview").style.display = "block";
    }
    document.getElementById("modalCadastro").style.display = "block";
}

// SALVAR (CADASTRO OU EDIÇÃO)
document.getElementById("formDesenho").onsubmit = async (e) => {
    e.preventDefault();
    const idEdicao = document.getElementById("edit_id").value;
    const formData = new FormData(e.target);
    if(idEdicao) formData.set("id", idEdicao);

    const url = idEdicao ? "api/editar_desenho.php" : "api/cadastrar_desenho.php";
    
    try {
        const res = await fetch(url, { method: "POST", body: formData });
        const dados = await res.json();
        if (dados.sucesso) {
            mostrarNotificacao("Sucesso!");
            fecharModal(); carregarDesenhos();
        } else { alert("Erro: " + dados.erro); }
    } catch (erro) { alert("Erro na conexão."); }
};

// EXCLUIR
async function excluirDesenho(id) {
    if (!confirm("Excluir este desenho permanentemente?")) return;
    const formData = new FormData();
    formData.append("id", id);
    try {
        const res = await fetch("api/excluir_desenho.php", { method: "POST", body: formData });
        const dados = await res.json();
        if (dados.sucesso) {
            mostrarNotificacao("Removido!");
            carregarDesenhos();
        } else { alert(dados.erro); }
    } catch (erro) { alert("Erro ao excluir."); }
}

/* ===== UTILITÁRIOS ===== */

function filtrarDesenhos() {
    const termo = document.getElementById("inputBusca").value.toLowerCase();
    const filtrados = listaOriginal.filter(d => 
        d.nome.toLowerCase().includes(termo) || (d.descricao && d.descricao.toLowerCase().includes(termo))
    );
    renderizarCards(filtrados);
}

function mostrarNotificacao(msg) {
    const toast = document.getElementById("toast");
    toast.innerText = msg; toast.style.display = "block";
    setTimeout(() => { toast.style.display = "none"; }, 3000);
}

window.onclick = (e) => { 
    if (e.target.className === "modal") {
        fecharModal(); fecharModalLogin(); fecharModalCadastro(); fecharModalPerfil();
    }
};

carregarDesenhos();
