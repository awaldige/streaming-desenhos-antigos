📺 Desenhos Antigos — Streaming Retrô & Cloud Architecture

📖 Visão Geral
Este é um projeto Full Stack de alto desempenho que simula uma plataforma de streaming focada em desenhos clássicos. O sistema utiliza uma arquitetura baseada em nuvem, integrando múltiplas plataformas para garantir persistência de dados, segurança de credenciais e alta disponibilidade de mídia.

O projeto demonstra competências avançadas em Engenharia de Software, manipulação de APIs de terceiros, segurança SSL/TLS e otimização de interface com Vanilla JavaScript.

🏗️ Arquitetura do Projeto
O sistema foi desenhado para operar de forma distribuída e resiliente, superando as limitações de sistemas de arquivos efêmeros:

Frontend & Backend (Hospedagem): Render (Ambiente de execução PHP 8.x).

Banco de Dados Gerenciado: Aiven (Instância MySQL Remota com conexão segura via SSL).

Storage de Mídia (CDN): Cloudinary (Armazenamento permanente e entrega otimizada de capas).

📊 Funcionalidades Implementadas
☁️ Infraestrutura & Segurança Cloud
[x] Conexão SQL Segura: Implementação de túnel TLS/SSL obrigatório entre o Render e o Aiven para proteção contra ataques Man-in-the-Middle.

[x] Persistência de Imagens: Integração via cURL com a API do Cloudinary para evitar perda de arquivos em deploys de servidores efêmeros.

[x] Segurança de Credenciais: Uso de algoritmos de hashing Bcrypt (password_hash) para armazenamento seguro de senhas.

👤 Gestão de Conta (Área do Assinante)
[x] Fluxo de Autenticação Completo: Sistema de Login e Cadastro de assinantes com validação em tempo real.

[x] Painel de Perfil (Self-Service): Interface para o usuário atualizar nome de exibição e senha de forma independente.

[x] Encerramento de Conta (Exclusão Segura): Funcionalidade de exclusão permanente com dupla confirmação de identidade (Prompt de Login), garantindo a autonomia do usuário sobre seus dados.

🎮 Experiência do Usuário (UX)
[x] Modo "Surpreenda-me" (Shuffle): Algoritmo de seleção aleatória que reproduz um desenho instantaneamente, simulando a troca de canais em TVs analógicas.

[x] Notificações Toast: Sistema de feedback visual moderno para confirmação de todas as ações (Login, Cadastro, Edição, Exclusão).

[x] Curadoria por Décadas: Agrupamento dinâmico que organiza o catálogo cronologicamente (Anos 60, 70, 80, 90).

[x] Busca Inteligente: Filtro em tempo real via JavaScript que percorre títulos e sinopses instantaneamente.

🔐 Administração
[x] Painel Administrativo: Interface protegida por níveis de acesso para gestão (CRUD) do catálogo de desenhos.

[x] Player Híbrido: Suporte inteligente para embeds do YouTube e arquivos MP4 diretos.

🛠️ Tecnologias Utilizadas
Frontend: HTML5, CSS3 (Modern UI/Responsive), JavaScript (ES6+ / Fetch API).

Backend: PHP 8.x (Arquitetura de API JSON / Sessões Nativas).

Database: MySQL (Hospedado no Aiven Cloud).

Cloud & Integrações: Cloudinary API (Imagens), cURL (PHP), Render (PaaS).

🚀 Fluxo de Dados (Mídia e Cadastro)
Upload: O ADM faz upload de uma capa; o Backend PHP envia via cURL para o Cloudinary.

Persistência: O Cloudinary retorna uma URL HTTPS otimizada que é salva no banco Aiven.

Segurança: Ao cadastrar ou editar conta, os dados sensíveis passam por sanitização e hashing antes de atingirem a camada de dados.

Consumo: O Frontend consome os endpoints JSON e renderiza a interface de forma assíncrona.

🚀 Próximos Passos
[ ] Sistema de Favoritos: Permitir que o usuário logado salve uma lista personalizada de desenhos favoritos.

[ ] Autenticação JWT: Migrar para JSON Web Tokens para maior escalabilidade da API.

[ ] PWA (Progressive Web App): Tornar a plataforma instalável em dispositivos móveis.

[ ] Efeito CRT/VHS: Filtro visual opcional para aumentar a imersão na estética dos anos 80/90.

🧪 Acesso ao Projeto
O projeto está em produção e pode ser acessado pelo link abaixo:

👉 Assistir Desenhos Antigos

https://streaming-desenhos-antigos.onrender.com/

© 2026 — Desenvolvido por André Waldige
Software Engineer | Full Stack Developer | AI Specialist
