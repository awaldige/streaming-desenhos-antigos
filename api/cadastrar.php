<?php
header("Content-Type: application/json; charset=utf-8");
include 'conexao.php'; // Use aquele seu arquivo de conexão SSL

$nome = $_POST['nome'] ?? '';
$login = $_POST['login'] ?? '';
$senha = $_POST['senha'] ?? '';

if (empty($login) || empty($senha)) {
    echo json_encode(["sucesso" => false, "erro" => "Campos obrigatórios vazios"]);
    exit;
}

// Criptografa a senha para segurança (Boa prática de Engenharia)
$senhaHash = password_hash($senha, PASSWORD_DEFAULT);

// O nível é sempre 'assinante' por padrão no cadastro público
$nivel = 'assinante';

$stmt = $conn->prepare("INSERT INTO usuarios (nome, login, senha, nivel) VALUES (?, ?, ?, ?)");
$stmt->bind_param("ssss", $nome, $login, $senhaHash, $nivel);

if ($stmt->execute()) {
    echo json_encode(["sucesso" => true, "mensagem" => "Conta criada! Agora é só logar."]);
} else {
    echo json_encode(["sucesso" => false, "erro" => "Erro ao cadastrar. Talvez o login já exista?"]);
}

$stmt->close();
$conn->close();
?>
