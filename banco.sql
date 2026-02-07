-- Desativar verificação de chaves estrangeiras para evitar erros durante a criação
SET FOREIGN_KEY_CHECKS = 0;

-- --------------------------------------------------------
-- Estrutura para tabela `criadores`
-- --------------------------------------------------------
CREATE TABLE `criadores` (
  `id_criador` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(255) NOT NULL,
  `bio` text DEFAULT NULL,
  PRIMARY KEY (`id_criador`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `criadores` (`id_criador`, `nome`, `bio`) VALUES
(1, 'William Hanna', 'Co-fundador da Hanna-Barbera.'),
(2, 'Joseph Barbera', 'Co-fundador da Hanna-Barbera.'),
(3, 'Walt Disney', 'Fundador da Disney.'),
(4, 'Osamu Tezuka', 'Pai do mangá moderno.'),
(5, 'Chuck Jones', 'Criador de personagens clássicos.');

-- --------------------------------------------------------
-- Estrutura para tabela `estudios`
-- --------------------------------------------------------
CREATE TABLE `estudios` (
  `id_estudio` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(255) NOT NULL,
  `localizacao` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_estudio`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `estudios` (`id_estudio`, `nome`, `localizacao`) VALUES
(1, 'Hanna-Barbera', 'Estados Unidos'),
(2, 'Disney', 'Estados Unidos'),
(3, 'Toei Animation', 'Japão'),
(4, 'Warner Bros Animation', 'Estados Unidos'),
(5, 'Filmation', 'Estados Unidos');

-- --------------------------------------------------------
-- Estrutura para tabela `desenhos`
-- --------------------------------------------------------
CREATE TABLE `desenhos` (
  `id_desenho` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(255) NOT NULL,
  `ano_lancamento` year(4) DEFAULT NULL,
  `descricao` text DEFAULT NULL,
  `id_estudio` int(11) DEFAULT NULL,
  `id_criador` int(11) DEFAULT NULL,
  `imagem` varchar(255) DEFAULT NULL,
  `video_url` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_desenho`),
  CONSTRAINT `fk_desenho_estudio` FOREIGN KEY (`id_estudio`) REFERENCES `estudios` (`id_estudio`),
  CONSTRAINT `fk_desenho_criador` FOREIGN KEY (`id_criador`) REFERENCES `criadores` (`id_criador`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `desenhos` (`id_desenho`, `nome`, `ano_lancamento`, `descricao`, `id_estudio`, `id_criador`, `imagem`, `video_url`) VALUES
(2, 'Tom & Jerry', '1940', 'Tom e Jerry tentam se capturar.', 1, 2, NULL, 'https://www.youtube.com/embed/irhQxrrl7cg?si=MKKmgrOpRKkXCQBB'),
(4, 'Scooby-Doo', '1969', 'Grupo de detetives e seu cachorro.', 1, 2, NULL, 'https://www.youtube.com/embed/8fXtGMGiXiA?si=m1nhGR8lJhDBn1lO'),
(17, 'Silverhawks', '1986', 'Heróis cibernéticos na Galáxia do Limbo.', NULL, NULL, '1770318923_6984ec4b96b7b.png', 'https://www.youtube.com/embed/qVns3ANiAY0?si=bV7Gxoz5ChRGJlz0'),
(18, ' Thundercats', '1985', 'Humanoides felinos de Thundera.', NULL, NULL, '1770318998_6984ec964f656.png', 'https://www.youtube.com/embed/Rp2PofFX8kA?si=lMkOroipyzWm0zq'),
(19, 'Os Jetsons', '1962', 'Família no futuro tecnológico.', NULL, NULL, '1770319231_6984ed7f03ce9.png', 'https://www.youtube.com/embed/oX6AdPWfSG4?si=WKjqBwnlGMzBCIB8'),
(20, 'Os Flintstones', '1960', 'Família da idade da pedra.', NULL, NULL, '1770319524_6984eea42b66d.png', 'https://www.youtube.com/embed/vcQo3TVh-DI?si=4buwW_1s4Q9mkq21'),
(21, ' Astro Boy ', '1963', 'Garoto robô herói.', NULL, NULL, '1770319607_6984eef788776.png', 'https://www.youtube.com/embed/O907sowJ0Og?si=X9vc1pjY38NGIVvf'),
(22, 'Caverna do Dragão', '1983', 'Baseado no famoso jogo de RPG.', NULL, NULL, '1770320587_6984f2cb2a071.jpg', 'https://www.youtube.com/embed/qDSRmvRhZ9k?si=G_e3LzzMi1RWxakp'),
(23, 'O Gato Félix', '1958', 'Gato preto com bolsa mágica.', NULL, NULL, '1770321222_6984f5462a20e.jfif', 'https://www.youtube.com/embed/Su8aIaSPG3E?si=odlCU2Jt2G0Su7LL'),
(24, 'Manda-Chuva', '1961', 'Gangue de gatos de rua.', NULL, NULL, '1770321392_6984f5f03a4d7.jfif', 'https://www.youtube.com/embed/2lW8CpD7t50?si=CKtNuRJK0pBW9Reg'),
(27, 'Popeye', '1929', 'Aventuras do marinheiro comedor de espinafre.', NULL, NULL, '1770404600_69863af80676f.png', 'https://www.youtube.com/embed/C2opRFtp0xc?si=vFJGq4VEb802KYM'),
(28, 'Pica Pau', '1940', 'Pássaro maluco em confusões.', NULL, NULL, '1770404787_69863bb34b769.png', 'https://www.youtube.com/embed/Yo2IjW-0Pyw?si=PXafcHrj12iSdWJx'),
(30, 'A Turma do Charlie Brown', '1983', 'Dia a dia de Charlie Brown e Snoopy.', NULL, NULL, '1770405577_69863ec9e8efe.webp', 'https://www.youtube.com/embed/lhYh98y1QHo?si=AOF-kwjcGbxT2Lmf'),
(31, 'As Tartarugas Ninja', '1987', 'Tartarugas que protegem NY.', NULL, NULL, '1770405871_69863fef9e60a.webp', 'https://www.youtube.com/embed/4kSwsvMd3v0?si=OjEyXBM73tPgEaHd'),
(32, 'Garfield e seus Amigos', '1988', 'Gato que adora lasanha.', NULL, NULL, '1770405976_698640580f4db.webp', 'https://www.youtube.com/embed/cbi-BV-X_OY?si=oZJM31hIzW7tjV4A'),
(33, 'As Aventuras de Tintim', '1991', 'Jovem jornalista e seu cão Milu.', NULL, NULL, '1770406104_698640d83600a.webp', 'https://www.youtube.com/embed/x6_jRcZiKIg?si=ha2iaLZxxWIm0-VS'),
(34, 'Os Smurfs', '1981', 'Pequenos seres azuis na floresta.', NULL, NULL, '1770406238_6986415eaa538.webp', 'https://www.youtube.com/embed/qIn9sn2u05M?si=aRf01g6RdQG1SspZ'),
(35, 'A Pantera Cor-de-rosa', '1969', 'Pantera em situações cômicas.', NULL, NULL, '1770407319_69864597c13dd.png', 'https://www.youtube.com/embed/USOla5giauo?si=5zJMoHTk6Gkq39NI'),
(36, 'Zé Colmeia', '1961', 'Urso que rouba cestas de piquenique.', NULL, NULL, '1770407384_698645d8cc9c2.png', 'https://www.youtube.com/embed/cd3UZnACS54?si=cLuUeHUjMLf0W5xI'),
(37, 'He-Man', '1983', 'O homem mais poderoso do universo.', NULL, NULL, '1770416481_69866961789cc.png', 'https://www.youtube.com/embed/Zg-ZI3K3gro?si=86linZR3pGIuS-_9');

-- --------------------------------------------------------
-- Estrutura para tabela `usuarios`
-- --------------------------------------------------------
CREATE TABLE `usuarios` (
  `id_usuario` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  `login` varchar(50) NOT NULL,
  `senha` varchar(255) NOT NULL,
  `nivel` enum('admin','usuario') DEFAULT 'usuario',
  `criado_em` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `login` (`login`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `usuarios` (`id_usuario`, `nome`, `login`, `senha`, `nivel`) VALUES
(1, 'Administrador', 'admin', '$2a$12$C4x0ruAvI0NeDkSPl64kDeqVVtAfp/YAhxR8rTJMsPLQinn3nJ6gu', 'admin'),
(2, 'Administrador', 'awaldige', '$2a$12$ncaAGTqsc5qjFP/EjmUOoepIYQ7eSPnnq98FqbLWpZ8LiRRDQL8y.', 'admin');

-- --------------------------------------------------------
-- Estrutura para tabela `streaming`
-- --------------------------------------------------------
CREATE TABLE `streaming` (
  `id_streaming` int(11) NOT NULL AUTO_INCREMENT,
  `nome_plataforma` varchar(255) NOT NULL,
  `link_site` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_streaming`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `streaming` (`id_streaming`, `nome_plataforma`, `link_site`) VALUES
(1, 'Netflix', 'https://netflix.com'),
(2, 'Prime Video', 'https://primevideo.com'),
(3, 'HBO Max', 'https://hbomax.com'),
(4, 'Disney+', 'https://disneyplus.com');

-- --------------------------------------------------------
-- Estrutura para tabela `desenho_streaming`
-- --------------------------------------------------------
CREATE TABLE `desenho_streaming` (
  `id_desenho` int(11) NOT NULL,
  `id_streaming` int(11) NOT NULL,
  PRIMARY KEY (`id_desenho`,`id_streaming`),
  CONSTRAINT `fk_ds_desenho` FOREIGN KEY (`id_desenho`) REFERENCES `desenhos` (`id_desenho`) ON DELETE CASCADE,
  CONSTRAINT `fk_ds_streaming` FOREIGN KEY (`id_streaming`) REFERENCES `streaming` (`id_streaming`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `desenho_streaming` (`id_desenho`, `id_streaming`) VALUES (4, 4);

-- --------------------------------------------------------
-- Estrutura para tabela `personagens`
-- --------------------------------------------------------
CREATE TABLE `personagens` (
  `id_personagem` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(255) NOT NULL,
  `descricao` text DEFAULT NULL,
  `id_desenho` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_personagem`),
  CONSTRAINT `fk_personagem_desenho` FOREIGN KEY (`id_desenho`) REFERENCES `desenhos` (`id_desenho`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `personagens` (`id_personagem`, `nome`, `descricao`, `id_desenho`) VALUES
(2, 'Tom', 'Gato perseguidor', 2),
(3, 'Jerry', 'Rato esperto', 2),
(4, 'Scooby-Doo', 'Cachorro medroso', 4);

-- --------------------------------------------------------
-- Estrutura para tabela `temporadas`
-- --------------------------------------------------------
CREATE TABLE `temporadas` (
  `id_temporada` int(11) NOT NULL AUTO_INCREMENT,
  `id_desenho` int(11) DEFAULT NULL,
  `numero_temporada` int(11) DEFAULT NULL,
  `ano_inicio` year(4) DEFAULT NULL,
  `ano_fim` year(4) DEFAULT NULL,
  PRIMARY KEY (`id_temporada`),
  CONSTRAINT `fk_temporada_desenho` FOREIGN KEY (`id_desenho`) REFERENCES `desenhos` (`id_desenho`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `temporadas` (`id_temporada`, `id_desenho`, `numero_temporada`, `ano_inicio`, `ano_fim`) VALUES
(2, 2, 1, '1940', '1941'),
(4, 4, 1, '1969', '1970');

-- Reativar verificação de chaves estrangeiras
SET FOREIGN_KEY_CHECKS = 1;
COMMIT;
