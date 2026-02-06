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

/* ===== 1. SISTEMA DE AUTENTICAÇÃO ===== */

function abrirModalLogin() { 
    document.getElementById("modalLogin").style.display = "block"; 
}

function fecharModalLogin() { 
    document.getElementById("modalLogin").style.display = "none";
    document.getElementById("formLogin").reset();
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
            aplicarPermissoes();
            fecharModalLogin();
            document.getElementById("btnLogar").style.display = "none";
            document.getElementById("btnSair").style.display = "block";
            renderizarCards(listaOriginal);
        } else {
            alert(dados.erro);
        }
    } catch (erro) { alert("Erro ao conectar com o servidor."); }
};

function fazerLogout() {
    usuarioLogado.isAdmin = false;
    aplicarPermissoes();
    document.getElementById("btnLogar").style.display = "block";
    document.getElementById("btnSair").style.display = "none";
    renderizarCards(listaOriginal);
}

function aplicarPermissoes() {
    if (usuarioLogado.isAdmin) {
        document.body.classList.add("is-admin");
    } else {
        document.body.classList.remove("is-admin");
    }
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
    const lista = document.getElementById("lista");
    lista.innerHTML = "";
    desenhos.forEach((d) => {
        const nomeNorm = d.nome.toLowerCase().trim();
        let capa = d.imagem ? `imagens/${d.imagem}` : (capasPadrao[nomeNorm] || `https://picsum.photos/seed/${d.id_desenho}/300/450`);

        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
            <img src="${capa}" alt="${d.nome}">
            <div class="info">
                <h3>${d.nome}</h3>
                <p>${d.ano_lancamento}</p>
                <div class="acoes admin-only">
                    <button onclick="event.stopPropagation(); editarDesenho(${d.id_desenho}, '${d.nome.replace(/'/g, "\\'")}', '${d.ano_lancamento}', '${(d.descricao || "").replace(/'/g, "\\'")}', '${d.video_url || ""}')">✏️</button>
                    <button onclick="event.stopPropagation(); excluirDesenho(${d.id_desenho})">🗑️</button>
                </div>
            </div>
        `;
        card.onclick = () => atualizarBannerDinamico(d);
        lista.appendChild(card);
    });
}

function filtrarDesenhos() {
    const termo = document.getElementById("inputBusca").value.toLowerCase();
    const filtrados = listaOriginal.filter(d => 
        d.nome.toLowerCase().includes(termo) || (d.descricao && d.descricao.toLowerCase().includes(termo))
    );
    renderizarCards(filtrados);
}

/* ===== 3. PLAYER DE VÍDEO (BANNER) ===== */

function atualizarBannerDinamico(d) {
    const banner = document.getElementById("banner");
    const info = document.getElementById("banner-info");
    const btnAssistir = document.getElementById("btnAssistir");

    // Fecha qualquer vídeo que esteja rodando ao trocar de desenho
    fecharVideo();

    const capa = d.imagem ? `imagens/${d.imagem}` : `https://picsum.photos/seed/${d.id_desenho}/800/450`;
    banner.style.backgroundImage = `linear-gradient(to top, #141414, transparent), url(${capa})`;
    
    document.getElementById("banner-titulo").innerText = d.nome;
    document.getElementById("banner-desc").innerText = d.descricao || "Sem descrição disponível.";

    videoAtual = d.video_url || "";
    btnAssistir.style.display = videoAtual ? "block" : "none";
}

function iniciarVideo() {
    if (!videoAtual) return;
    const playerContainer = document.getElementById("player-container");
    const info = document.getElementById("banner-info");

    info.style.display = "none";
    playerContainer.style.display = "block";

    // Botão de fechar flutuante
    let htmlPlayer = `<button id="btnFecharVideo" onclick="fecharVideo()" style="position: absolute; top: 20px; right: 20px; z-index: 100; background: rgba(0,0,0,0.5); color: white; border: 2px solid white; width: 40px; height: 40px; border-radius: 50%; cursor: pointer; font-size: 20px;">✕</button>`;

    if (videoAtual.includes("youtube.com") || videoAtual.includes("youtu.be")) {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = videoAtual.match(regExp);
        const idVideo = (match && match[2].length == 11) ? match[2] : null;
        
        htmlPlayer += `
            <iframe width="100%" height="100%" src="https://www.youtube.com/embed/${idVideo}?autoplay=1&rel=0" 
            frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
    } else {
        htmlPlayer += `
            <video width="100%" height="100%" controls autoplay>
                <source src="${videoAtual}" type="video/mp4">
                Seu navegador não suporta este formato de vídeo.
            </video>`;
    }
    playerContainer.innerHTML = htmlPlayer;
}

function fecharVideo() {
    const playerContainer = document.getElementById("player-container");
    const info = document.getElementById("banner-info");

    playerContainer.innerHTML = "";
    playerContainer.style.display = "none";
    info.style.display = "block";
}

/* ===== 4. GESTÃO (CRUD) ===== */

function abrirModal() {
    if(!usuarioLogado.isAdmin) return alert("Acesso restrito.");
    document.getElementById("modalCadastro").style.display = "block";
}

function fecharModal() {
    document.getElementById("modalCadastro").style.display = "none";
    document.getElementById("formDesenho").reset();
    document.getElementById("edit_id").value = "";
    document.getElementById("container-preview").style.display = "none";
    document.getElementById("img-preview").src = "";
    document.getElementById("modal-titulo").innerText = "Adicionar Desenho";
    document.getElementById("btnEnviar").innerText = "Salvar na Biblioteca";
}

function previewImagem(event) {
    const reader = new FileReader();
    const modalContent = document.querySelector('#modalCadastro .modal-content');
    reader.onload = function() {
        document.getElementById('img-preview').src = reader.result;
        document.getElementById('container-preview').style.display = 'block';
        setTimeout(() => { modalContent.scrollTo({ top: modalContent.scrollHeight, behavior: 'smooth' }); }, 150);
    };
    if(event.target.files[0]) reader.readAsDataURL(event.target.files[0]);
}

function editarDesenho(id, nome, ano, descricao, video) {
    if(!usuarioLogado.isAdmin) return;
    document.getElementById("edit_id").value = id;
    document.getElementById("nome").value = nome;
    document.getElementById("ano").value = ano;
    document.getElementById("descricao").value = descricao;
    document.getElementById("video_url").value = video; 
    
    document.getElementById("modal-titulo").innerText = "Editar Desenho";
    document.getElementById("btnEnviar").innerText = "Atualizar Desenho";
    abrirModal();
}

document.getElementById("formDesenho").onsubmit = async (e) => {
    e.preventDefault();
    if(!usuarioLogado.isAdmin) return;

    const idEdicao = document.getElementById("edit_id").value;
    const formData = new FormData(e.target);
    
    // Adiciona explicitamente o ID se for edição
    if (idEdicao) formData.append("id", idEdicao);

    const url = idEdicao ? "api/editar.php" : "api/adicionar.php";
    try {
        const res = await fetch(url, { method: "POST", body: formData });
        const dados = await res.json();
        if (dados.sucesso) { 
            fecharModal(); 
            carregarDesenhos(); 
        } else { 
            alert("Erro: " + dados.erro); 
        }
    } catch (erro) { alert("Erro na conexão."); }
};

/* ===== 5. EXCLUSÃO E INICIALIZAÇÃO ===== */

async function excluirDesenho(id) {
    if(!usuarioLogado.isAdmin || !confirm("Excluir este desenho?")) return;
    const fd = new FormData(); fd.append("id", id);
    try {
        const res = await fetch("api/excluir.php", { method: "POST", body: fd });
        const dados = await res.json();
        if (dados.sucesso) { carregarDesenhos(); }
    } catch (erro) { alert("Erro ao excluir."); }
}

window.onclick = (e) => { 
    if (e.target.id === "modalCadastro") fecharModal();
    if (e.target.id === "modalLogin") fecharModalLogin();
};

carregarDesenhos();
