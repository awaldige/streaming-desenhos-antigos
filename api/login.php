<?php
session_start();
header("Content-Type: application/json; charset=utf-8");

// --- CONFIGURAÇÃO AIVEN ---
$host = "mysql-63c6648-streaming-desenhos.j.aivencloud.com";
$port = 28840;
$user = "avnadmin";
$pass = "AVNS_y1R_KaHJC0qp4VAHb_k"; // Lembre-se de ocultar isso no GitHub!
$dbname = "defaultdb";

$conn = mysqli_init();
mysqli_ssl_set($conn, NULL, NULL, NULL, NULL, NULL);
$conectar = @mysqli_real_connect($conn, $host, $user, $pass, $dbname, $port, NULL, MYSQLI_CLIENT_SSL);

if (!$conectar) {
    echo json_encode(["sucesso" => false, "erro" => "Erro de conexão Cloud"]);
    exit;
}

$login_digitado = $_POST['login'] ?? '';
$senha_digitada = $_POST['senha'] ?? '';

// AJUSTE: Usando exatamente 'id_usuario', 'login' e 'nivel' como no seu Diagrama ER
$stmt = $conn->prepare("SELECT id_usuario, login, senha, nivel FROM usuarios WHERE login = ?");
$stmt->bind_param("s", $login_digitado);
$stmt->execute();
$resultado = $stmt->get_result()->fetch_assoc();

if ($resultado) {
    if (password_verify($senha_digitada, $resultado['senha']) || $senha_digitada === $resultado['senha']) {
        
        $_SESSION['usuario_id'] = $resultado['id_usuario'];
        $_SESSION['nivel'] = $resultado['nivel'];
        
        echo json_encode([
            "sucesso" => true,
            "status" => "logado", 
            "isAdmin" => ($resultado['nivel'] === 'admin'),
            "nome" => $resultado['login']
        ]);
    } else {
        echo json_encode(["sucesso" => false, "erro" => "Senha incorreta"]);
    }
} else {
    // AQUI É O PULO DO GATO: Se não achar, avisa que o usuário precisa cadastrar
    echo json_encode([
        "sucesso" => false, 
        "status" => "nao_encontrado", 
        "erro" => "Usuário não encontrado. Deseja criar uma conta?"
    ]);
}

$conn->close();
?>
