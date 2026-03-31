<?php
// Desativa exibição de erros HTML para não quebrar o JSON
ini_set('display_errors', 0); 
error_reporting(E_ALL);
header("Content-Type: application/json; charset=utf-8");

// --- CONFIGURAÇÃO DO BANCO (AIVEN) ---
$host = "mysql-63c6648-streaming-desenhos.j.aivencloud.com";
$port = 28840;
$user = "avnadmin";
$pass = "AVNS_y1R_KaHJC0qp4VAHb_k"; 
$dbname = "defaultdb";

// --- CONFIGURAÇÃO CLOUDINARY ---
$cloud_name = "dkpy0ps8t"; 
$upload_preset = "streaming-desenhos-antigos";

// Inicializa conexão SSL
$conn = mysqli_init();
mysqli_ssl_set($conn, NULL, NULL, NULL, NULL, NULL);
$conectar = @mysqli_real_connect($conn, $host, $user, $pass, $dbname, $port, NULL, MYSQLI_CLIENT_SSL);

if (!$conectar) {
    echo json_encode(["sucesso" => false, "erro" => "Erro de conexão com o banco"]);
    exit;
}

// Captura os dados enviados pelo JavaScript
$id = $_POST["id"] ?? null;
$nome = $_POST["nome"] ?? '';
$ano = (int)($_POST["ano"] ?? 0);
$desc = $_POST["descricao"] ?? '';
$video_url = $_POST["video_url"] ?? ''; 
$novaImagemUrl = null;

if (!$id) {
    echo json_encode(["sucesso" => false, "erro" => "ID ausente para edição."]);
    exit;
}

// 1. Processar Nova Imagem no Cloudinary (se o usuário enviou um novo arquivo)
if (!empty($_FILES["imagem"]["tmp_name"])) {
    $arquivo_temporario = $_FILES["imagem"]["tmp_name"];

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, "https://api.cloudinary.com/v1_1/$cloud_name/image/upload");
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, [
        "file" => new CURLFile($arquivo_temporario),
        "upload_preset" => $upload_preset
    ]);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    $resposta_json = curl_exec($ch);
    curl_close($ch);

    $dados_cloudinary = json_decode($resposta_json, true);

    if (isset($dados_cloudinary['secure_url'])) {
        $novaImagemUrl = $dados_cloudinary['secure_url'];
    }
}

// 2. Execução do UPDATE no Banco de Dados
if ($novaImagemUrl) {
    // Se trocou a imagem, atualiza tudo inclusive o campo imagem
    $stmt = $conn->prepare("UPDATE desenhos SET nome=?, ano_lancamento=?, descricao=?, imagem=?, video_url=? WHERE id_desenho=?");
    $stmt->bind_param("sisssi", $nome, $ano, $desc, $novaImagemUrl, $video_url, $id);
} else {
    // Se NÃO enviou imagem nova, atualiza apenas os textos para não apagar a imagem antiga
    $stmt = $conn->prepare("UPDATE desenhos SET nome=?, ano_lancamento=?, descricao=?, video_url=? WHERE id_desenho=?");
    $stmt->bind_param("sissi", $nome, $ano, $desc, $video_url, $id);
}

$resultado = $stmt->execute();

echo json_encode([
    "sucesso" => $resultado,
    "erro" => $resultado ? null : $stmt->error
]);

$stmt->close();
$conn->close();
?>
