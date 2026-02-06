<?php
session_start();
header("Content-Type: application/json");

// Parâmetros: servidor, usuário, senha, banco, porta
$conn = new mysqli("localhost", "root", "", "desenhos_antigos", 3308);

if ($conn->connect_error) {
    die(json_encode(["sucesso" => false, "erro" => "Falha na conexão: " . $conn->connect_error]));
}

$login = $_POST['login'] ?? '';
$senha = $_POST['senha'] ?? '';

$stmt = $conn->prepare("SELECT id_usuario, senha, nivel FROM usuarios WHERE login = ?");
$stmt->bind_param("s", $login);
$stmt->execute();
$resultado = $stmt->get_result()->fetch_assoc();

if ($resultado && password_verify($senha, $resultado['senha'])) {
    $_SESSION['usuario_id'] = $resultado['id_usuario'];
    $_SESSION['nivel'] = $resultado['nivel'];
    
    echo json_encode([
        "sucesso" => true, 
        "isAdmin" => ($resultado['nivel'] === 'admin')
    ]);
} else {
    echo json_encode(["sucesso" => false, "erro" => "Usuário ou senha inválidos"]);
}
