const capasPadrao = {
    "he-man": "imagens/he-man.png",
    "scooby-doo": "imagens/scooby-doo.png",
    "tom & jerry": "imagens/tom-e-jerry.png",
    "pica-pau": "imagens/pica-pau.png"
};

let listaOriginal = [];

// === INICIALIZAÇÃO ===
async function carregarDesenhos() {
    try {
        const resposta = await fetch("api/desenhos.php");
        listaOriginal = await resposta.json(); 
        renderizarCards(listaOriginal);
        if (listaOriginal.length > 0) atualizarBannerDinamico(listaOriginal[0]);
    } catch (erro) { console.error("Erro ao carregar:", erro); }
}

// === RENDERIZAÇÃO ===
function renderizarCards(desenhos) {
    const lista = document.getElementById("lista");
    lista.innerHTML = "";

    desenhos.forEach((d, index) => {
        const nomeNorm = d.nome.toLowerCase().trim();
        let capa = d.imagem ? `imagens/${d.imagem}` : (capasPadrao[nomeNorm] || `https://picsum.photos/seed/${d.id_desenho}/300/450`);

        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
            <img src="${capa}" alt="${d.nome}">
            <div class="info">
                <h3>${d.nome}</h3>
                <p>${d.ano_lancamento}</p>
                <div class="acoes">
                    <button onclick="event.stopPropagation(); editarDesenho(${d.id_desenho}, '${d.nome.replace(/'/g, "\\'")}', '${d.ano_lancamento}', '${(d.descricao || "").replace(/'/g, "\\'")}')">✏️</button>
                    <button onclick="event.stopPropagation(); excluirDesenho(${d.id_desenho})">🗑️</button>
                </div>
            </div>
        `;
        card.onclick = () => atualizarBannerDinamico(d);
        lista.appendChild(card);
    });
}

// === BUSCA ===
function filtrarDesenhos() {
    const termo = document.getElementById("inputBusca").value.toLowerCase();
    const filtrados = listaOriginal.filter(d => 
        d.nome.toLowerCase().includes(termo) || (d.descricao && d.descricao.toLowerCase().includes(termo))
    );
    renderizarCards(filtrados);
}

// === MODAL E PREVIEW ===
function abrirModal() {
    document.getElementById("modalCadastro").style.display = "block";
}

function fecharModal() {
    document.getElementById("modalCadastro").style.display = "none";
    document.getElementById("formDesenho").reset();
    document.getElementById("edit_id").value = "";
    document.getElementById("container-preview").style.display = "none";
    document.getElementById("modal-titulo").innerText = "Adicionar Desenho";
}

function previewImagem(event) {
    const reader = new FileReader();
    reader.onload = function() {
        const output = document.getElementById('img-preview');
        output.src = reader.result;
        document.getElementById('container-preview').style.display = 'block';
    };
    if(event.target.files[0]) reader.readAsDataURL(event.target.files[0]);
}

// === EDITAR (PREENCHER MODAL) ===
function editarDesenho(id, nome, ano, descricao) {
    document.getElementById("edit_id").value = id;
    document.getElementById("nome").value = nome;
    document.getElementById("ano").value = ano;
    document.getElementById("descricao").value = descricao;
    
    document.getElementById("modal-titulo").innerText = "Editar Desenho";
    document.getElementById("btnEnviar").innerText = "Atualizar Desenho";
    abrirModal();
}

// === SUBMIT (SALVAR OU ATUALIZAR) ===
document.getElementById("formDesenho").onsubmit = async (e) => {
    e.preventDefault();
    const idEdicao = document.getElementById("edit_id").value;
    const formData = new FormData(e.target);
    
    // Adicionamos os campos manualmente para garantir
    formData.append("nome", document.getElementById("nome").value);
    formData.append("ano", document.getElementById("ano").value);
    formData.append("descricao", document.getElementById("descricao").value);
    if (idEdicao) formData.append("id", idEdicao);

    const url = idEdicao ? "api/editar.php" : "api/adicionar.php";

    try {
        const res = await fetch(url, { method: "POST", body: formData });
        const dados = await res.json();
        if (dados.sucesso) {
            fecharModal();
            carregarDesenhos();
        } else { alert("Erro: " + dados.erro); }
    } catch (erro) { alert("Erro na conexão."); }
};

// === BANNER E EXCLUIR ===
function atualizarBannerDinamico(d) {
    const banner = document.getElementById("banner");
    const capa = d.imagem ? `imagens/${d.imagem}` : `https://picsum.photos/seed/${d.id_desenho}/800/450`;
    banner.style.backgroundImage = `linear-gradient(to top, #141414, transparent), url(${capa})`;
    document.getElementById("banner-titulo").innerText = d.nome;
    document.getElementById("banner-desc").innerText = d.descricao || "";
}

async function excluirDesenho(id) {
    if (!confirm("Excluir este desenho?")) return;
    const fd = new FormData(); fd.append("id", id);
    const res = await fetch("api/excluir.php", { method: "POST", body: fd });
    const dados = await res.json();
    if (dados.sucesso) carregarDesenhos();
}

window.onclick = (e) => { if (e.target.className == "modal") fecharModal(); };
carregarDesenhos();
