<?php
// Impede o PHP de enviar erros em formato HTML (evita o erro 'Unexpected token <')
ini_set('display_errors', 1);
error_reporting(E_ALL);
header("Content-Type: application/json; charset=utf-8");

// --- CONFIGURAÇÃO AIVEN (Ajuste a sua senha abaixo) ---
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
// ------------------------------------------------------

// 2. Captura o ID enviado pelo JavaScript (FormData)
$id = $_POST["id"] ?? null;

if (!$id) {
    echo json_encode(["sucesso" => false, "erro" => "ID do desenho não foi recebido pelo PHP."]);
    exit;
}

try {
    // 3. BUSCAR A IMAGEM ANTES DE EXCLUIR O REGISTRO
    $sqlBusca = "SELECT imagem FROM desenhos WHERE id_desenho = ?";
    $stmtBusca = $conn->prepare($sqlBusca);
    $stmtBusca->bind_param("i", $id);
    $stmtBusca->execute();
    $resultado = $stmtBusca->get_result();
    $dados = $resultado->fetch_assoc();

    if ($dados && !empty($dados['imagem'])) {
        $caminhoArquivo = "../imagens/" . $dados['imagem'];
        
        // Deleta o arquivo físico se ele existir
        if (file_exists($caminhoArquivo)) {
            @unlink($caminhoArquivo);
        }
    }
    $stmtBusca->close();

    // 4. EXCLUIR O REGISTRO DO BANCO DE DADOS
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
