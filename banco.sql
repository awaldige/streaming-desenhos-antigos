-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3308
-- Tempo de geração: 07/02/2026 às 01:40
-- Versão do servidor: 10.4.32-MariaDB
-- Versão do PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `desenhos_antigos`
--

-- --------------------------------------------------------

--
-- Estrutura para tabela `criadores`
--

CREATE TABLE `criadores` (
  `id_criador` int(11) NOT NULL,
  `nome` varchar(255) NOT NULL,
  `bio` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `criadores`
--

INSERT INTO `criadores` (`id_criador`, `nome`, `bio`) VALUES
(1, 'William Hanna', 'Co-fundador da Hanna-Barbera.'),
(2, 'Joseph Barbera', 'Co-fundador da Hanna-Barbera.'),
(3, 'Walt Disney', 'Fundador da Disney.'),
(4, 'Osamu Tezuka', 'Pai do mangá moderno.'),
(5, 'Chuck Jones', 'Criador de personagens clássicos.');

-- --------------------------------------------------------

--
-- Estrutura para tabela `desenhos`
--

CREATE TABLE `desenhos` (
  `id_desenho` int(11) NOT NULL,
  `nome` varchar(255) NOT NULL,
  `ano_lancamento` year(4) DEFAULT NULL,
  `descricao` text DEFAULT NULL,
  `id_estudio` int(11) DEFAULT NULL,
  `id_criador` int(11) DEFAULT NULL,
  `imagem` varchar(255) DEFAULT NULL,
  `video_url` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `desenhos`
--

INSERT INTO `desenhos` (`id_desenho`, `nome`, `ano_lancamento`, `descricao`, `id_estudio`, `id_criador`, `imagem`, `video_url`) VALUES
(2, 'Tom & Jerry', '1940', 'Em Tom & Jerry, acompanhamos as tentativas frustradas de Tom, um gato doméstico cinza que tenta a todo custo capturar o rato Jerry. Sempre inventando planos mirabolantes, Tom nunca consegue atingir seus objetivos, já que Jerry sempre está um passo à frente dele.', 1, 2, NULL, 'https://www.youtube.com/embed/irhQxrrl7cg?si=MKKmgrOpRKkXCQBB'),
(4, 'Scooby-Doo', '1969', 'um grupo de adolescentes detetives e seu cachorro de estimação desvendam mistérios sobrenaturais – o primeiro programa de Scooby foi um marco na história da Hanna Barbera. Por causa do grande sucesso, a produção logo se expandiu, ganhando novas séries, filmes animados e em live-action e outros tipos de derivados.', 1, 2, NULL, 'https://www.youtube.com/embed/8fXtGMGiXiA?si=m1nhGR8lJhDBn1lO'),
(17, 'Silverhawks', '1986', 'A série é ambientada no século XXIX e mistura ficção científica com super-heróis, focando em uma equipe de humanos modificados ciberneticamente para combater o crime na Galáxia do Limbo. ', NULL, NULL, '1770318923_6984ec4b96b7b.png', 'https://www.youtube.com/embed/qVns3ANiAY0?si=bV7Gxoz5ChRGJlz0'),
(18, ' Thundercats', '1985', 'As aventuras de um grupo de humanoides felinos do planeta Thundera', NULL, NULL, '1770318998_6984ec964f656.png', 'https://www.youtube.com/embed/Rp2PofFX8kA?si=lMkOroipyzWm0zq'),
(19, 'Os Jetsons', '1962', 'Os Jetsons é uma série que nos leva a uma viagem incrível pelo futuro, apresentando um mundo cheio de tecnologia impressionante e inovações .', NULL, NULL, '1770319231_6984ed7f03ce9.png', 'https://www.youtube.com/embed/oX6AdPWfSG4?si=WKjqBwnlGMzBCIB8'),
(20, 'Os Flintstones', '1960', 'Família da idade da pedra.', NULL, NULL, '1770319524_6984eea42b66d.png', 'https://www.youtube.com/embed/vcQo3TVh-DI?si=4buwW_1s4Q9mkq21'),
(21, ' Astro Boy ', '1963', 'Garoto robô herói.', NULL, NULL, '1770319607_6984eef788776.png', 'https://www.youtube.com/embed/O907sowJ0Og?si=X9vc1pjY38NGIVvf'),
(22, 'Caverna do Dragão', '1983', 'Explore o mundo fascinante da série animada \'Caverna do Dragão\', um ícone dos anos 80 baseado no famoso jogo de RPG \'Dungeons & Dragons', NULL, NULL, '1770320587_6984f2cb2a071.jpg', 'https://www.youtube.com/embed/qDSRmvRhZ9k?si=G_e3LzzMi1RWxakp'),
(23, 'O Gato Félix', '1958', 'O Gato Félix acompanha a história do personagem titular, um gato preto que sempre carrega consigo uma bolsa mágica e que sempre acaba se metendo em várias confusões.', NULL, NULL, '1770321222_6984f5462a20e.jfif', 'https://www.youtube.com/embed/Su8aIaSPG3E?si=odlCU2Jt2G0Su7LL'),
(24, 'Manda-Chuva', '1961', 'Manda-Chuva mostra as aventuras do personagem titular, o líder de uma gangue de gatos de rua que sempre estão tentando ganhar dinheiro usando golpes e meios ilegais.', NULL, NULL, '1770321392_6984f5f03a4d7.jfif', 'https://www.youtube.com/embed/2lW8CpD7t50?si=CKtNuRJK0pBW9Reg'),
(27, 'Popeye', '1929', 'Na trama, o público basicamente acompanhava as aventuras do marinheiro Popeye, juntamente com Olivia Palito, seu grande amor, e de Brutus, seu maior arqui-inimigo.', NULL, NULL, '1770404600_69863af80676f.png', 'https://www.youtube.com/embed/C2opRFtp0xc?si=vFJGq4VEb802KYM'),
(28, 'Pica Pau', '1940', 'As aventuras do Pica-Pau, um pássaro com um parafuso a menos na cabeça que vivia se metendo em confusões', NULL, NULL, '1770404787_69863bb34b769.png', 'https://www.youtube.com/embed/Yo2IjW-0Pyw?si=PXafcHrj12iSdWJx'),
(30, 'A Turma do Charlie Brown', '1983', 'A Turma do Charlie Brown acompanha o dia a dia do personagem titular ao lado de seus melhores amigos e de seu cachorro de estimação, o Snoopy.', NULL, NULL, '1770405577_69863ec9e8efe.webp', 'https://www.youtube.com/embed/lhYh98y1QHo?si=AOF-kwjcGbxT2Lmf'),
(31, 'As Tartarugas Ninja', '1987', 'A história das tartarugas ninjas que protegem a cidade de Nova York do crime é uma das mais conhecidas da cultura pop', NULL, NULL, '1770405871_69863fef9e60a.webp', 'https://www.youtube.com/embed/4kSwsvMd3v0?si=OjEyXBM73tPgEaHd'),
(32, 'Garfield e seus Amigos', '1988', 'Em Garfield e Seus Amigos, seguimos a rotina de Jon Arbuckle, um cartunista nerd que não tem muito sucesso com as mulheres e que sempre acaba caindo em situações inusitadas na companhia de Garfield, seu gato que adora lasanha e é extremamente preguiçoso.', NULL, NULL, '1770405976_698640580f4db.webp', 'https://www.youtube.com/embed/cbi-BV-X_OY?si=oZJM31hIzW7tjV4A'),
(33, 'As Aventuras de Tintim', '1991', 'Inspirada em uma das histórias em quadrinhos mais famosas do mundo, As Aventuras de Tintim marcou o dia a dia das crianças dos anos 90 com a adaptação animada das aventuras criadas pelo escritor Georges Prosper Remi, o Hergé. Na trama, Tintim é um jovem jornalista que, com a ajuda de seu fiel cãozinho, viaja pelo mundo em busca de aventuras.', NULL, NULL, '1770406104_698640d83600a.webp', 'https://www.youtube.com/embed/x6_jRcZiKIg?si=ha2iaLZxxWIm0-VS'),
(34, 'Os Smurfs', '1981', 'Os Smurfs conta a história de pequenos seres azuis que vivem em uma aldeia escondida na floresta e são aterrorizados por Gargamel, um feiticeiro malvado que precisa deles para finalizar uma fórmula mágica.', NULL, NULL, '1770406238_6986415eaa538.webp', 'https://www.youtube.com/embed/qIn9sn2u05M?si=aRf01g6RdQG1SspZ'),
(35, 'A Pantera Cor-de-rosa', '1969', ' Pantera Cor-de-Rosa acompanha as aventuras de uma pantera que acaba se envolvendo em mistérios que sempre a colocam em situações cômicas e divertidas.', NULL, NULL, '1770407319_69864597c13dd.png', 'https://www.youtube.com/embed/USOla5giauo?si=5zJMoHTk6Gkq39NI'),
(36, 'Zé Colmeia', '1961', 'Zé Colmeia conta a história de Zé Colmeia, um urso que, com a ajuda de seu amigo Catatau, está sempre à procura de comida em cestas de piqueniques alheias no Parque Jellystone.', NULL, NULL, '1770407384_698645d8cc9c2.png', 'https://www.youtube.com/embed/cd3UZnACS54?si=cLuUeHUjMLf0W5xI'),
(37, 'He-Man e os Defensores do Universo', '1983', 'A série animada He-Man e os Defensores do Universo conta a história de He-Man, o homem mais poderoso do universo que, para salvar o planeta Eternia, precisa lutar contra as forças do mal e vilões perigosos.', NULL, NULL, '1770416481_69866961789cc.png', 'https://www.youtube.com/embed/Zg-ZI3K3gro?si=86linZR3pGIuS-_9');

-- --------------------------------------------------------

--
-- Estrutura para tabela `desenho_streaming`
--

CREATE TABLE `desenho_streaming` (
  `id_desenho` int(11) NOT NULL,
  `id_streaming` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `desenho_streaming`
--

INSERT INTO `desenho_streaming` (`id_desenho`, `id_streaming`) VALUES
(4, 4);

-- --------------------------------------------------------

--
-- Estrutura para tabela `estudios`
--

CREATE TABLE `estudios` (
  `id_estudio` int(11) NOT NULL,
  `nome` varchar(255) NOT NULL,
  `localizacao` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `estudios`
--

INSERT INTO `estudios` (`id_estudio`, `nome`, `localizacao`) VALUES
(1, 'Hanna-Barbera', 'Estados Unidos'),
(2, 'Disney', 'Estados Unidos'),
(3, 'Toei Animation', 'Japão'),
(4, 'Warner Bros Animation', 'Estados Unidos'),
(5, 'Filmation', 'Estados Unidos');

-- --------------------------------------------------------

--
-- Estrutura para tabela `personagens`
--

CREATE TABLE `personagens` (
  `id_personagem` int(11) NOT NULL,
  `nome` varchar(255) NOT NULL,
  `descricao` text DEFAULT NULL,
  `id_desenho` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `personagens`
--

INSERT INTO `personagens` (`id_personagem`, `nome`, `descricao`, `id_desenho`) VALUES
(2, 'Tom', 'Gato perseguidor', 2),
(3, 'Jerry', 'Rato esperto', 2),
(4, 'Scooby-Doo', 'Cachorro medroso', 4);

-- --------------------------------------------------------

--
-- Estrutura para tabela `streaming`
--

CREATE TABLE `streaming` (
  `id_streaming` int(11) NOT NULL,
  `nome_plataforma` varchar(255) NOT NULL,
  `link_site` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `streaming`
--

INSERT INTO `streaming` (`id_streaming`, `nome_plataforma`, `link_site`) VALUES
(1, 'Netflix', 'https://netflix.com'),
(2, 'Prime Video', 'https://primevideo.com'),
(3, 'HBO Max', 'https://hbomax.com'),
(4, 'Disney+', 'https://disneyplus.com');

-- --------------------------------------------------------

--
-- Estrutura para tabela `temporadas`
--

CREATE TABLE `temporadas` (
  `id_temporada` int(11) NOT NULL,
  `id_desenho` int(11) DEFAULT NULL,
  `numero_temporada` int(11) DEFAULT NULL,
  `ano_inicio` year(4) DEFAULT NULL,
  `ano_fim` year(4) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `temporadas`
--

INSERT INTO `temporadas` (`id_temporada`, `id_desenho`, `numero_temporada`, `ano_inicio`, `ano_fim`) VALUES
(2, 2, 1, '1940', '1941'),
(4, 4, 1, '1969', '1970');

-- --------------------------------------------------------

--
-- Estrutura para tabela `usuarios`
--

CREATE TABLE `usuarios` (
  `id_usuario` int(11) NOT NULL,
  `nome` varchar(100) NOT NULL,
  `login` varchar(50) NOT NULL,
  `senha` varchar(255) NOT NULL,
  `nivel` enum('admin','usuario') DEFAULT 'usuario',
  `criado_em` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `usuarios`
--

INSERT INTO `usuarios` (`id_usuario`, `nome`, `login`, `senha`, `nivel`, `criado_em`) VALUES
(1, 'Administrador', 'admin', '$2a$12$C4x0ruAvI0NeDkSPl64kDeqVVtAfp/YAhxR8rTJMsPLQinn3nJ6gu', 'admin', '2026-02-06 20:30:09'),
(2, 'Administrador', 'awaldige', '$2a$12$ncaAGTqsc5qjFP/EjmUOoepIYQ7eSPnnq98FqbLWpZ8LiRRDQL8y.', 'admin', '2026-02-06 20:30:09');

--
-- Índices para tabelas despejadas
--

--
-- Índices de tabela `criadores`
--
ALTER TABLE `criadores`
  ADD PRIMARY KEY (`id_criador`);

--
-- Índices de tabela `desenhos`
--
ALTER TABLE `desenhos`
  ADD PRIMARY KEY (`id_desenho`),
  ADD KEY `id_estudio` (`id_estudio`),
  ADD KEY `id_criador` (`id_criador`);

--
-- Índices de tabela `desenho_streaming`
--
ALTER TABLE `desenho_streaming`
  ADD PRIMARY KEY (`id_desenho`,`id_streaming`),
  ADD KEY `id_streaming` (`id_streaming`);

--
-- Índices de tabela `estudios`
--
ALTER TABLE `estudios`
  ADD PRIMARY KEY (`id_estudio`);

--
-- Índices de tabela `personagens`
--
ALTER TABLE `personagens`
  ADD PRIMARY KEY (`id_personagem`),
  ADD KEY `personagens_ibfk_1` (`id_desenho`);

--
-- Índices de tabela `streaming`
--
ALTER TABLE `streaming`
  ADD PRIMARY KEY (`id_streaming`);

--
-- Índices de tabela `temporadas`
--
ALTER TABLE `temporadas`
  ADD PRIMARY KEY (`id_temporada`),
  ADD KEY `temporadas_ibfk_1` (`id_desenho`);

--
-- Índices de tabela `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id_usuario`),
  ADD UNIQUE KEY `login` (`login`);

--
-- AUTO_INCREMENT para tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `criadores`
--
ALTER TABLE `criadores`
  MODIFY `id_criador` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de tabela `desenhos`
--
ALTER TABLE `desenhos`
  MODIFY `id_desenho` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- AUTO_INCREMENT de tabela `estudios`
--
ALTER TABLE `estudios`
  MODIFY `id_estudio` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de tabela `personagens`
--
ALTER TABLE `personagens`
  MODIFY `id_personagem` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de tabela `streaming`
--
ALTER TABLE `streaming`
  MODIFY `id_streaming` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de tabela `temporadas`
--
ALTER TABLE `temporadas`
  MODIFY `id_temporada` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de tabela `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Restrições para tabelas despejadas
--

--
-- Restrições para tabelas `desenhos`
--
ALTER TABLE `desenhos`
  ADD CONSTRAINT `desenhos_ibfk_1` FOREIGN KEY (`id_estudio`) REFERENCES `estudios` (`id_estudio`),
  ADD CONSTRAINT `desenhos_ibfk_2` FOREIGN KEY (`id_criador`) REFERENCES `criadores` (`id_criador`);

--
-- Restrições para tabelas `desenho_streaming`
--
ALTER TABLE `desenho_streaming`
  ADD CONSTRAINT `desenho_streaming_ibfk_1` FOREIGN KEY (`id_desenho`) REFERENCES `desenhos` (`id_desenho`) ON DELETE CASCADE,
  ADD CONSTRAINT `desenho_streaming_ibfk_2` FOREIGN KEY (`id_streaming`) REFERENCES `streaming` (`id_streaming`);

--
-- Restrições para tabelas `personagens`
--
ALTER TABLE `personagens`
  ADD CONSTRAINT `personagens_ibfk_1` FOREIGN KEY (`id_desenho`) REFERENCES `desenhos` (`id_desenho`) ON DELETE CASCADE;

--
-- Restrições para tabelas `temporadas`
--
ALTER TABLE `temporadas`
  ADD CONSTRAINT `temporadas_ibfk_1` FOREIGN KEY (`id_desenho`) REFERENCES `desenhos` (`id_desenho`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
