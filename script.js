let desenhos = [];

fetch("api/desenhos.php")
.then(r => r.json())
.then(data => {
    desenhos = data;
    mostrarBanner(desenhos[0]);
    mostrarLista(desenhos);
});

function mostrarBanner(d) {
    document.getElementById("banner-titulo").innerText = d.nome;
    document.getElementById("banner-desc").innerText = d.descricao;
}

function mostrarLista(lista) {
    const area = document.getElementById("lista");

    lista.forEach(d => {
        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `<div style="padding:10px">${d.nome}</div>`;

        card.onclick = () => mostrarBanner(d);

        area.appendChild(card);
    });
}
