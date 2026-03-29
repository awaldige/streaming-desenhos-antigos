<?php
session_start();
header("Content-Type: application/json; charset=utf-8");

// --- CONFIGURAÇÃO AIVEN ---
$host = "mysql-63c6648-streaming-desenhos.j.aivencloud.com";
$port = 28840;
$user = "avnadmin";
$pass = "AVNS_y1R_KaHJC0qp4VAHb_k"; 
$dbname = "defaultdb";

// Inicializa a conexão com SSL (Obrigatório para o Aiven)
$conn = mysqli_init();
mysqli_ssl_set($conn, NULL, NULL, NULL, NULL, NULL);

$conectar = @mysqli_real_connect($conn, $host, $user, $pass, $dbname, $port, NULL, MYSQLI_CLIENT_SSL);

if (!$conectar) {
    echo json_encode(["sucesso" => false, "erro" => "Falha na conexão com o banco remoto: " . mysqli_connect_error()]);
    exit;
}
// --------------------------

$login_digitado = $_POST['login'] ?? '';
$senha_digitada = $_POST['senha'] ?? '';

// AJUSTE DE COLUNAS: Buscando 'usuario' em vez de 'login' para bater com o DBeaver
$stmt = $conn->prepare("SELECT id, usuario, senha, nivel_acesso FROM usuarios WHERE usuario = ?");
$stmt->bind_param("s", $login_digitado);
$stmt->execute();
$resultado = $stmt->get_result()->fetch_assoc();

if ($resultado) {
    // Verifica a senha (suporta password_hash ou texto puro para seus testes iniciais)
    if (password_verify($senha_digitada, $resultado['senha']) || $senha_digitada === $resultado['senha']) {
        
        // Grava na sessão usando os nomes das colunas da tabela 'usuarios'
        $_SESSION['usuario_id'] = $resultado['id'];
        $_SESSION['nivel'] = $resultado['nivel_acesso'];
        
        echo json_encode([
            "sucesso" => true, 
            "isAdmin" => ($resultado['nivel_acesso'] === 'admin'),
            "isAssinante" => true // Todo usuário cadastrado no banco é um assinante VIP
        ]);
    } else {
        echo json_encode(["sucesso" => false, "erro" => "Senha incorreta"]);
    }
} else {
    echo json_encode(["sucesso" => false, "erro" => "Usuário não encontrado no sistema"]);
}

$conn->close();
?>
