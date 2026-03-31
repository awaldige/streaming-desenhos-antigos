<?php
// Impede o PHP de enviar erros em formato HTML
ini_set('display_errors', 0); // Desative em produção para não quebrar o JSON
error_reporting(E_ALL);
header("Content-Type: application/json; charset=utf-8");

// --- CONFIGURAÇÃO AIVEN ---
$host = "mysql-63c6648-streaming-desenhos.j.aivencloud.com";
$port = 28840;
$user = "avnadmin";
$pass = "AVNS_y1R_KaHJC0qp4VAHb_k"; 
$dbname = "defaultdb";

// Inicializa a conexão com SSL
$conn = mysqli_init();
mysqli_ssl_set($conn, NULL, NULL, NULL, NULL, NULL);
$conectar = @mysqli_real_connect($conn, $host, $user, $pass, $dbname, $port, NULL, MYSQLI_CLIENT_SSL);

if (!$conectar) {
    echo json_encode([
        "sucesso" => false, 
        "erro" => "Falha na conexão com Aiven: " . mysqli_connect_error()
    ]);
    exit;
}

// Captura o ID (aceita 'id' ou 'id_desenho')
$id = $_POST["id"] ?? $_POST["id_desenho"] ?? null;

if (!$id) {
    echo json_encode(["sucesso" => false, "erro" => "ID do desenho não recebido."]);
    exit;
}

try {
    // Nota: Removi a busca de imagem e o unlink() pois agora as imagens 
    // estão no Cloudinary e o servidor Render é efêmero (não guarda arquivos locais).

    $sqlDel = "DELETE FROM desenhos WHERE id_desenho = ?";
    $stmtDel = $conn->prepare($sqlDel);
    $stmtDel->bind_param("i", $id);
    
    if ($stmtDel->execute()) {
        if ($stmtDel->affected_rows > 0) {
            echo json_encode(["sucesso" => true]);
        } else {
            echo json_encode(["sucesso" => false, "erro" => "Nenhum desenho encontrado com o ID: " . $id]);
        }
    } else {
        echo json_encode(["sucesso" => false, "erro" => "Erro no Banco: " . $stmtDel->error]);
    }
    $stmtDel->close();

} catch (Exception $e) {
    echo json_encode(["sucesso" => false, "erro" => "Exceção: " . $e->getMessage()]);
}

$conn->close();
?>
