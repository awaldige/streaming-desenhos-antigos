📺 Desenhos Antigos — Streaming Retrô & Cloud Architecture

📖 Visão Geral
Este é um projeto Full Stack que simula uma plataforma de streaming focada em desenhos clássicos. O sistema evoluiu de um ambiente local para uma arquitetura baseada em nuvem, utilizando integração entre múltiplas plataformas para garantir persistência de dados e alta disponibilidade de mídia.

O projeto demonstra competências avançadas em CRUD, manipulação de APIs de terceiros, segurança SSL e armazenamento em nuvem.

🏗️ Arquitetura do Projeto
O sistema foi desenhado para operar de forma distribuída:

Frontend & Backend (Hospedagem): Render (Ambiente de execução PHP).

Banco de Dados Remoto: Aiven (Instância MySQL Gerenciada com conexão via SSL).

Storage de Mídia (CDN): Cloudinary (Armazenamento permanente e otimização de imagens).

📊 Funcionalidades Implementadas
[x] Arquitetura Cloud: Sistema hospedado e funcional em ambiente de produção.

[x] Persistência de Imagens: Integração com API do Cloudinary para evitar perda de arquivos em servidores efêmeros.

[x] Banco de Dados Remoto: Conexão segura via TLS/SSL com MySQL externo.

[x] Painel Administrativo: Interface protegida para gestão em tempo real do catálogo.

[x] Player de Vídeo Híbrido: Suporte para embeds do YouTube e arquivos MP4 diretos.

[x] Busca em Tempo Real: Filtro inteligente por nome ou descrição via JavaScript.

🛠️ Tecnologias Utilizadas
Frontend: HTML5, CSS3 (Modern UI), JavaScript (ES6+ / Fetch API).

Backend: PHP 8.x (Arquitetura de API JSON).

Database: MySQL (Hospedado no Aiven).

Cloud & Integrações: Cloudinary API (Imagens), cURL (PHP), Render (PaaS).

🚀 Como o Projeto Funciona (Fluxo de Dados)
O usuário ADM faz upload de uma capa e preenche os dados do desenho.

O Backend PHP recebe a imagem e a envia via cURL para o Cloudinary.

O Cloudinary processa e retorna uma URL segura (HTTPS).

O PHP salva essa URL e os dados do desenho no banco Aiven.

O Frontend consome a API e renderiza os cards utilizando as URLs otimizadas da CDN.

🧪 Como usar
Como o projeto está em produção, você pode acessá-lo diretamente pelo link:

(https://streaming-desenhos-antigos.onrender.com/)

🚀 Próximos Passos & Melhorias Futuras
Para tornar a plataforma ainda mais robusta e completa, estão planeadas as seguintes evoluções:

🛠️ Evoluções Técnicas
[ ] Sistema de Cache: Implementar Redis ou cache via Service Workers para acelerar o carregamento das listas de desenhos.

[ ] Autenticação JWT: Substituir a validação simples por JSON Web Tokens (JWT) para uma comunicação API-Client mais segura e profissional.

[ ] Refatoração para POO: Migrar o código PHP procedural para Programação Orientada a Objetos (POO) utilizando o padrão MVC.

[ ] Dockerização: Criar um docker-compose para facilitar o setup do ambiente de desenvolvimento por outros programadores.

📺 Funcionalidades para o Utilizador
[ ] Minha Lista (Favoritos): Implementar um sistema de favoritos utilizando localStorage ou persistência no banco de dados.

[ ] Sistema de Episódios: Alterar a estrutura do banco de dados para suportar múltiplas temporadas e listas de episódios por desenho.

[ ] Categorização por Tags: Filtros avançados por estúdio (Hanna-Barbera, Disney, Warner Bros) e género (Ação, Comédia, Mistério).

[ ] Modo Kids: Uma interface ainda mais simplificada e com bloqueio de funções administrativas para crianças.

🎨 Experiência & Interface
[ ] Lazy Loading: Carregamento progressivo das capas para otimizar o consumo de dados e a performance inicial.

[ ] PWA (Progressive Web App): Transformar o site numa PWA para que possa ser "instalado" no telemóvel e acedido como uma app nativa.

[ ] Skeleton Screens: Substituir os spinners de carregamento por placeholders elegantes enquanto os dados são puxados da API.

© 2026 - Desenvolvido por André Waldige
