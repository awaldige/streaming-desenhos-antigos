<?php
// 1. Impede que qualquer erro de texto suje o JSON
ini_set('display_errors', 0);
error_reporting(E_ALL);
ob_start(); // Inicia o buffer para capturar qualquer lixo de saída
header("Content-Type: application/json; charset=utf-8");

// --- CONFIGURAÇÃO AIVEN ---
$host = "mysql-63c6648-streaming-desenhos.j.aivencloud.com";
$port = 28840;
$user = "avnadmin";
$pass = "AVNS_y1R_KaHJC0qp4VAHb_k"; 
$dbname = "defaultdb";

$conn = mysqli_init();
mysqli_ssl_set($conn, NULL, NULL, NULL, NULL, NULL);
$conectar = @mysqli_real_connect($conn, $host, $user, $pass, $dbname, $port, NULL, MYSQLI_CLIENT_SSL);

if (!$conectar) {
    ob_clean(); // Limpa o buffer
    echo json_encode(["sucesso" => false, "erro" => "Erro de conexão Cloud"]);
    exit;
}

// Captura os dados do POST (o JS envia 'login' e 'senha')
$login_digitado = $_POST['login'] ?? '';
$senha_digitada = $_POST['senha'] ?? '';

if (empty($login_digitado) || empty($senha_digitada)) {
    ob_clean();
    echo json_encode(["sucesso" => false, "erro" => "Preencha todos os campos"]);
    exit;
}

$stmt = $conn->prepare("SELECT id_usuario, login, senha, nivel FROM usuarios WHERE login = ?");
$stmt->bind_param("s", $login_digitado);
$stmt->execute();
$resultado = $stmt->get_result()->fetch_assoc();

if ($resultado) {
    // Verifica a senha (aceita hash ou texto puro para facilitar seu teste atual)
    $senha_valida = password_verify($senha_digitada, $resultado['senha']) || ($senha_digitada === $resultado['senha']);
    
    if ($senha_valida) {
        ob_clean(); // Garante que NADA saiu antes do JSON
        echo json_encode([
            "sucesso" => true,
            "status" => "logado", 
            "isAdmin" => ($resultado['nivel'] === 'admin'),
            "nome" => $resultado['login']
        ]);
    } else {
        ob_clean();
        echo json_encode(["sucesso" => false, "erro" => "Senha incorreta"]);
    }
} else {
    ob_clean();
    echo json_encode([
        "sucesso" => false, 
        "status" => "nao_encontrado", 
        "erro" => "Usuário não encontrado."
    ]);
}

$stmt->close();
$conn->close();
ob_end_flush(); // Envia o JSON limpo
?>
